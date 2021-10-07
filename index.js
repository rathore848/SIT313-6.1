const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const validator = require("validator")
const port = process.env.PORT || 8080;

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/task6',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

const userSchema = new mongoose.Schema(
    {
        _id: String,
        first_name: {
            type: String,
            required: true,
            unique: true,
            minlength: [2, "minimum 2 letters"],
            maxlength: 30
        },
        last_name: {
            type: String,
            required: true,
            unique: true,
            minlength: [2, "minimum 2 letters"],
            maxlength: 30
        },
        email: {type: String,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Email.not valid")
                }
            }
        },
        pwd: {type: String,
            minlength: 10,
            maxlength:30
        },

        address: {
            type: String,
            required: true,
            unique: true,
            minlength: [2, "minimum 2 letters"],
            maxlength: 30
        },
        city: String,
        state: String,
        zip: {type: Number
        },
        phone_number:{type: Number,
            min: 10
        }
    }
)

const User = new mongoose.model("User", userSchema)


db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

//app.use(express.json());
app.post("/sign_up",(req,res)=>{

    
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var phone_number = req.body.phone_number;

    var data = {
        "first_name": first_name,
        "last_name": last_name,
        "email" : email,
        "pwd": pwd,
        "address": address,
        "city": city,
        "state": state,
        "zip": zip,
        "phone_number": phone_number
    }
    

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('signup_success.html')

})



//To fetch data 
app.get("/sign_up", async(req, res)=>{

    try{
        const getUser = await User.find({});
        res.send(getUser);
    }catch(e){
        res.status(400).send(e);
    }
} )
//To fetch data of a particular field
app.get("/sign_up/:fname", async(req, res)=>{

    try{
        
        const getUser = await User.findOne({first_name: req.params.fname});
        res.send(getUser);
    }catch(e){
        res.status(400).send(e);
    }
} )
//To update a specific area
app.patch("/sign_up/:fname", async(req, res)=>{

    try{
        
        const getUser = await User.update({
            first_name: req.params.fname},
            {$set: req.body }
            );
        res.send(getUser);
    }catch(e){
        res.status(400).send(e);
    }
} )
//To delete the entire db
app.delete('/sign_up', (req, res) =>{
    User.deleteMany((err) =>{
        if(err){res.send(err)}
        else{res.send("Successfully deleted all tasks!")}
    })
})
// To delete a selected one
app.delete("/sign_up/:fname", async(req, res)=>{

    try{
        
        const getUser = await User.findOneAndDelete({first_name: req.params.fname});
        res.send(getUser);
    }catch(e){
        res.status(400).send(e);
    }
} )
app.listen(port, ()=>{
    console.log(`Listening on PORT ${port}`)
})


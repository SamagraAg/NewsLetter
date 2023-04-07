const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', function (req, res) {  
    res.sendFile(__dirname+ "/signup.html");
});

app.post("/", function (req, res) {  
    var data = req.body;
    // console.log(data);
    var firstName = data.fName;
    var lastName = data.lName;
    var email = data.email;

    if(!firstName || !lastName || !email)
    {
      res.sendFile(__dirname + "/failure.html")
    }

    // console.log(firstName , lastName , email);

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url : "https://us21.api.mailchimp.com/3.0/lists/463dccbb76" ,
        method : "POST" ,
        headers: {
            "Authorization" : "deepesh1 a00014a4b5b42323827d9f17a2093921-us21"
        },
        body: jsonData
    };

    request(options, function (error, response, body) {  
        if(error){
            res.sendFile(__dirname + "/failure.html");
        }
        else{
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });
});

app.post("/failure", function (req, res) {  
    res.redirect("/")
});


app.listen(process.env.PORT || 3000, function (req, res) {  
    console.log("Server started at port 3000!");
});

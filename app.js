const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const { options } = require("request");

const app = express();

const Port=(process.env.PORT||3000);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
  console.log(req.body);

  var data = {
    members:[
      {
        email_address:req.body.email,
        status: "subscribed",
        NAME:req.body.name,
      }
    ]
  }
  const jsonData=JSON.stringify(data);
  const url="https://us20.api.mailchimp.com/3.0/lists/5cab55efa9";
  const options= {
    method:"POST",
    auth:"kary:30b3ff7bce30d47af926ba7984ecf300-us20"
 }
 const request= https.request(url,options,function(response){

    if(response.statusCode===200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();


});
app.post("/failure",(req,res)=>{
  res.redirect("/");
})

app.listen(Port, function () {
  console.log("listening on port 3000.");
});


// mailchimp.setConfig({
//   apiKey: "30b3ff7bce30d47af926ba7984ecf300-us20",//5cab55efa9
//   server: "us20",
// });

// async function run() {
//   const response = await mailchimp.ping.get();
//   console.log(response);
// }

// run();
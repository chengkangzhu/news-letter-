const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", function (req, res) {
  //put the information collected into variables
  const firstName = req.body["first-name"];
  const lastName = req.body["last-name"];
  const email = req.body["email"];
  //not sure what is this
  //probably a json data format to send to mailchimp inorder to add to the mail list
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  //now send this jsondata to mailchimp

  const url = "https://us10.api.mailchimp.com/3.0/lists/c60ab374dd";
  const options = {
    method: "POST",
    auth: "chengkz:220a082a5b3953fa0b61ec528efb7ccd-us10",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

  app.post("/failure",function(req,res){
    res.redirect("/")
  })

});

app.listen(3000, function () {
  console.log("server running on port 3000");
});

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const serverless = require("serverless-http");
const path = require("path");

const router = express.Router();
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

router.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
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
  var jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/5fa6c489ab";
  const options = {
    method: "POST",
    auth: "vaibhav:227e17342f8159d33012c372183594ef-us21",
  };

  const request = https.request(url, options, function (response) {
    let responseCode = response.statusCode;
    if (responseCode === 200) {
      res.sendFile(path.join(__dirname, "public", "success.html"));
    } else {
      res.sendFile(path.join(__dirname, "public", "failure.html"));
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

router.post("/failure", function (req, res) {
  res.redirect("/");
});

app.use("/api", router);
module.exports = app;
module.exports.handler = serverless(app);

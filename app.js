const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// page routing

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
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
  var jsoneData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/5fa6c489ab";
  const options = {
    method: "POST",
    auth: "vaibhav:227e17342f8159d33012c372183594ef-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.error_code === 0) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsoneData);
  request.end();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT, function () {
  console.log("server running on port 3000 sucessfully!");
});

// API Key :- 227e17342f8159d33012c372183594ef-us21
// audionce id :- 5fa6c489ab

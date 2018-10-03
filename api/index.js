require('dotenv').config();
var express = require("express");
var app = express();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var bodyParser = require('body-parser');
var axios = require('axios');
var CircularJSON = require('circular-json');
const https = require('https');
var request = require('request');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// https://ureport-stage.bloomington.in.gov/crm-test/open311/v2/requests.json

// var options = {
//   hostname: 'https://ureport-stage.bloomington.in.gov',
//   port: 443,
//   path: '/crm-test/open311/v2/requests.json',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': Buffer.byteLength(post_data)
//   }
// };

app.post("/", upload.fields([]), function(req, res, next) {
  let formData = req.body;
  formData.api_key = process.env.OPEN_311_KEY;
  let postURL = 'https://ureport-stage.bloomington.in.gov/crm-test/open311/v2/requests.json';
  console.log(formData);

  // request.post({url: postURL, formData: formData}, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //     console.log('body:', body);
  //   }
  //   console.log('error:', error); // Print the error if one occurred
  // });

  // axios.post(postURL, formData)
  // .then(response => {
  //   console.log(formData);
  //   console.log('sent via server??');
  //   console.log(postURL);
  //   // res.send(response.status);
  //   // console.log(CircularJSON.stringify(response))
  //   // res.send(CircularJSON.stringify(response)) // <= send data to the client
  // })
  // .catch(err => {
  //   console.log(err)
  // })

  next();
});


module.exports = {
  path: "/api/",
  handler: app
}
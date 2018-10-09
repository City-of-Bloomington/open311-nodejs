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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var morgan = require('morgan');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let postURL = 'https://ureport-stage.bloomington.in.gov/crm-test/open311/v2/requests.json';
var multerIMG = upload.single('media');

app.post('/', multerIMG, function (req, res, next) {
  console.log(req.body);

  let formInfos = req.body;
  formInfos.api_key = process.env.OPEN_311_KEY;

  if(req.file) {
    formInfos.media = req.file.path;
  }

  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', postURL, true);
  // xhr.send(JSON.stringify(formData));
  // console.log(JSON.stringify(formData));

  request.post({url: postURL, form: formInfos}, function optionalCallback(err, httpResponse, body) {
    console.log(formInfos);
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    console.log(body.service_request_id);
  });

  console.log(res);

  // axios.post(postURL, formData)
  // .then(response => {
  //   console.log(formData);
  //   console.log('sent via server??');
  //   console.log(postURL);
  // })
  // .then(response => {
  //   console.log(response);

  //   // response.send('POST request to confirm page')
  // })
  // .catch(err => {
  //   console.log(err)
  // })

  next();
})

// app.post('/', upload.fields([]), function(req, res, next) {
//   // res.redirect(postURL);
//   // res.setHeader('Content-Type', 'multipart/form-data');

//   let formData = req.body;
//   formData.api_key = process.env.OPEN_311_KEY;

//   // console.log(formData);
//   // console.log('sent via server??');

//   // res.send(formData);
//   // res.json(formData)

//   axios.post(postURL, formData)
//   .then(response => {
//     console.log(formData);
//     console.log('sent via server??');
//     console.log(postURL);
//   })
//   .then(response => {
//     // response.send('POST request to confirm page')
//   })
//   .catch(err => {
//     console.log(err)
//   })

//   next();
// });

module.exports = {
  path: "/api/",
  handler: app
}
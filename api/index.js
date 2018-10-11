require('dotenv').config();
var express = require("express");
var app = express();
// var multer  = require('multer');

// var upload = multer({ dest: 'uploads/' });
// const storage = multer.memoryStorage();
// const upload = multer({ storage });


// var bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
app.use(busboyBodyParser());

// var axios = require('axios');
// var CircularJSON = require('circular-json');
// const https = require('https');
var request = require('request');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var morgan = require('morgan');
// var FormData = require('form-data');

let postURL = 'https://ureport-stage.bloomington.in.gov/crm-test/open311/v2/requests.json';

app.post('/', function (req, res, next) {
  let formInfos = req.body;
  formInfos.api_key = process.env.OPEN_311_KEY;

  if(req.files) {
    formInfos.media = req.files;
    console.log(req.files);
  }

  request.post({url: postURL, form: formInfos}, function optionalCallback(err, httpResponse, body) {
    console.log(formInfos);
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    res.json({ body })
  });
  return false;
})

module.exports = {
  path: "/api/",
  handler: app
}
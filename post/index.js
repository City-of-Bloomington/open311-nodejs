require('dotenv').config();
var express            = require("express");
var app                = express();
var request            = require('request');
const busboyBodyParser = require('busboy-body-parser');

let postURL = `${process.env.API_URL}${process.env.POST_API}`;

app.use(busboyBodyParser());
app.post('/', function (req, res, next) {

  var formData = {
    'api_key': process.env.OPEN_311_KEY,
    'service_code': req.body['service_code'],
    'lat': req.body['lat'],
    'long': req.body['long'],
    'address_string': req.body['address_string'],
    'email': req.body['email'],
    'first_name': req.body['first_name'],
    'last_name': req.body['last_name'],
    'phone': req.body['phone'],
    'description': req.body['description']
  }

  if (req.files.media) {
    formData.media = {
      value: req.files.media.data,
      options: {
        filename: req.files.media.data + '-' + Date.now(),
        contentType: req.files.media.mimetype
      }
    }
  }

  request.post({url: postURL, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    res.json({ body })
  });
  return false;
})

module.exports = {
  path: "/post/",
  handler: app
}
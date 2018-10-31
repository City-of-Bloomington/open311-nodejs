require('dotenv').config();
var express            = require("express");
var app                = express();
var request            = require('request');
const busboyBodyParser = require('busboy-body-parser');

var secretKey = `${process.env.RECAPTCHA_SERVERKEY}`;
let postURL = `${process.env.CRM_API_URL}${process.env.POST_API}`;

app.use(busboyBodyParser());
app.post('/', function (req, res, next) {
  // console.log(secretKey);
  // console.log(req.body);

  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g_recaptcha_response'] + "&remoteip=" + req.connection.remoteAddress;

  if(
    req.body['g_recaptcha_response'] === undefined ||
    req.body['g_recaptcha_response'] === '' ||
    req.body['g_recaptcha_response'] === null
  ) {
    res.status(500).send({"responseCode" : 1, "responseDesc" : "Please validate reCaptcha"});
    return next();
  }

  request(verificationUrl, function(error, response, body) {
    body = JSON.parse(body);
    if(!body.success) {
      return res.status(500).json({"responseCode" : 1, "responseDesc" : "Failed reCaptcha validation"});
    }
    return postForm();
  });

  function postForm() {
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
  }
  return false;
})

module.exports = {
  path: "/post/",
  handler: app
}
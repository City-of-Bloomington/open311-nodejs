require('dotenv').config();
var express            = require("express");
var app                = express();
var request            = require('request');
const axios            = require('axios')
var bodyParser         = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');

var secretKey = `${process.env.RECAPTCHA_SERVERKEY}`;
let postURL = `${process.env.CRM_API_TEST_URL}${process.env.POST_API}`;

app.use(busboyBodyParser());

app.post('/', function (req, res, next) {

  if(req.body) {
    console.log('.: Request :.');
    console.log(req.body);
  }

  var recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g_recaptcha_response'] + "&remoteip=" + req.connection.remoteAddress;



  if(
    req.body['g_recaptcha_response'] === undefined ||
    req.body['g_recaptcha_response'] === '' ||
    req.body['g_recaptcha_response'] === null
  ) {
    res.status(500).send(
      { "responseCode" : 1,
        "responseDesc" : "Please validate reCaptcha"
      }
    );

    return next();
  }

  request(recaptchaUrl, (error, response, body) => {
    body = JSON.parse(body);

    if(!body.success) {
      console.log('.: reCaptcha Fail :.');
      console.log(error)

      return res.status(500).json(
        { "responseCode" : 1,
          "responseDesc" : "Failed reCaptcha validation"}
      );
    } else {
      console.log('.: reCaptcha :.');
      console.log(body)

      return postForm();
    }
  });

  postForm = () => {
    req.body.api_key = process.env.OPEN_311_KEY;
    delete req.body['g_recaptcha_response'];

    if (req.files.media) {
      req.body.media = {
        value: req.files.media.data,
        options: {
          filename:     `${req.files.media.data-Date.now()}`,
          contentType:  req.files.media.mimetype
        }
      }
    }

    let data = { url: postURL, formData: req.body };

    request.post(data, (err, body) => {
      if (err) {
        console.log(`%c .: Submit Fail :.`, `background: red; color: white; padding: 2px 5px; border-radius: 2px;`);
        console.log(err)
      }

      console.log('.: Submit OK :.');
      // console.log(body)
      
      res.json({ body })
    });
  }
})

module.exports = {
  path: "/post/",
  handler: app
}
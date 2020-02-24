require('dotenv').config();
var express            = require("express");
var app                = express();
var request            = require('request');
const axios            = require('axios')
var bodyParser         = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');

var secretKey = `${process.env.RECAPTCHA_SERVERKEY}`;
let postURL = `${process.env.CRM_API_URL}${process.env.POST_API}`;

app.use(busboyBodyParser());

// app.use(bodyParser.json()); //parse application/json
// app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (req, res, next) {
  console.log(req.body);

  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g_recaptcha_response'] + "&remoteip=" + req.connection.remoteAddress;

  if(
    req.body['g_recaptcha_response'] === undefined ||
    req.body['g_recaptcha_response'] === '' ||
    req.body['g_recaptcha_response'] === null
  ) {
    res.status(500)
    .send({"responseCode" : 1, "responseDesc" : "Please validate reCaptcha"});

    return next();
  }

  // axios.post(verificationUrl)
  // .then((res) => {
  //   console.log(res)
  //   // postForm()
  // })
  // .catch((err)  => {
  //   console.log(err)
  // })

  request(verificationUrl, function(error, response, body) {
    body = JSON.parse(body);
    if(!req.success) {
      return res.status(500).json({"responseCode" : 1, "responseDesc" : "Failed reCaptcha validation"});
    }
    return res
    // return postForm();
  });

  // postForm = () => {
  //   const formData = req.body;
  //   formData.api_key = process.env.OPEN_311_KEY;
  //   delete formData['g_recaptcha_response'];

  //   if (req.files.media) {
  //     formData.media = {
  //       value: req.files.media.data,
  //       options: {
  //         filename:     `${req.files.media.data-Date.now()}`,
  //         contentType:  req.files.media.mimetype
  //       }
  //     }
  //   }

  //   request.post({url: postURL, formData: formData}, function optionalCallback(err, httpResponse, body) {
  //     if (err) {
  //       return console.error('Submit failed:', err);
  //     }
  //     console.log('Submit successful:', body);
  //     res.json({ body })
  //   });
  // }
  return false;
})

module.exports = {
  path: "/post/",
  handler: app
}
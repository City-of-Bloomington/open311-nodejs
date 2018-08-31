require('dotenv').config()
const {
  Nuxt,
  Builder }   = require('nuxt')
const config  = require('./nuxt.config.js')
const https   = require('https')
const fs      = require('fs')
const port    = process.env.LOCAL_PORT || 2222;
const isProd  = (process.env.NODE_ENV === 'production')

config.dev = !isProd
const nuxt    = new Nuxt(config)

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
  .then(listen)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
} else { listen() }

function listen() {
  const options = {
    // you'll need to generate these,
    // & I used a sym link to reference
    key: fs.readFileSync('certs/server.key', 'utf8'),
    cert: fs.readFileSync('certs/server.crt', 'utf8')
  };

  https.createServer(options, nuxt.render)
  .listen(port);

  console.log(`City of Bloomington\n`
            + `/ * * * * * * * * * * * * * * * /\n`
            + `uReport Vuejs client\n`
            + `/ * * * * * * * * * * * * * * * /\n`
            + `https://localhost:${port}`);
}
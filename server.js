require('dotenv').config();

const {
  Nuxt,
  Builder }       = require('nuxt'),
  config          = require('./nuxt.config.js'),
  pkg             = require('./package'),
  https           = require('https'),
  fs              = require('fs'),
  nuxt            = new Nuxt(config),
  options = {
                  key: fs.readFileSync('certs/server.key', 'utf8'),
                  cert: fs.readFileSync('certs/wildcard.bloomington.in.gov-fullChain.crt', 'utf8')
  },
  port            = process.env.LOCAL_PORT || 2222,
  isProd          = (process.env.NODE_ENV === 'production'),
  envMsg          = config.dev ? 'Development' : 'Production',
  dividerStars    = `★\xa0\xa0`,
  starRepeatCount = 22,
  devUrl          = `https://dhcp-cityhall-xxx-xxx.bloomington.in.gov`,
  dividerMsg      = `🛠️\xa0\xa0⛓️\xa0\xa0👩‍💻\xa0🔮\xa0👨‍💻\xa0⛓️\xa0\xa0🛠️`;

config.dev    = !isProd;

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
  https
  .createServer(options, nuxt.render)
  .listen(port);

  console.log(`\n\n${dividerMsg}\n`
            + `${dividerStars.repeat(starRepeatCount)}\n`
            + `App:  ${pkg.prettyName}\n`
            + `Env:  ${envMsg}\n`
            + `Who:  ${pkg.company}\n`
            + `Repo: ${pkg.repository.url}\n`
            + `Url:  ${devUrl}:${port}`
            + `\n${dividerStars.repeat(starRepeatCount)}\n`
            + `${dividerMsg}\n\n`);
}
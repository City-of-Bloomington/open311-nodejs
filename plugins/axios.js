export default function ({ $axios, app, store, redirect, route }) {
  $axios.onRequest((config) => {
    if (process.env.NODE_ENV === 'development')
      console.log(`${config.method.toUpperCase()} 🔮 ${config.url}`)
  })

  $axios.onError((config, error) => {
    const code = parseInt(error.response && error.response.status)

    if (process.env.NODE_ENV === 'development') {
      console.log(`@${config.url}`)
      console.log(`${config.method.toUpperCase()} 🛑 Failed`)
      console.log(errer)
    }

    if (code > 500) {
      redirect('/error')
    }
  })
}
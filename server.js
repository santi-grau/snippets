const Bundler = require('parcel-bundler')
const app = require('express')()

const parcel_option = { entryFiles: './app/views/*.pug' }

const bundler = new Bundler( parcel_option.entryFiles, parcel_option )
const parcel_middleware = bundler.middleware()

app.use('/*', function(req, res, next) {
    req.url = req.originalUrl
    parcel_middleware( req, res, next )
});



app.listen(8080)
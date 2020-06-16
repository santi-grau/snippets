const Bundler = require('parcel-bundler')
const app = require('express')()
var https = require('https')
const fs = require('fs');

const parcel_option = { entryFiles: './app/views/*.pug' }

const bundler = new Bundler( parcel_option.entryFiles, parcel_option )
const parcel_middleware = bundler.middleware()

app.use('/*', function(req, res, next) {
    req.url = req.originalUrl
    parcel_middleware( req, res, next )
});


var options = {
    key: fs.readFileSync( './ssl/localhost.key' ),
    cert: fs.readFileSync( './ssl/localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
};
var server = https.createServer( options, app );


const bundlerOptions = { hmr : false, open : true };



// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());


server.listen( 8080, function () {
    console.log( 'Express server listening on port ' + server.address().port );
} );


// app.listen(8080)
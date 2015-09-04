var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
// list the endpoints which you want to make securable here
var securableEndpoints;
// fhlint-begin: securable-endpoints
securableEndpoints = ['/hello'];
// fhlint-end

var app = express();

app.use(mbaasExpress.fhmiddleware());
// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);
if (process.env.FH_PORT && !process.env.FH_MONGODB_CONN_URL) {
  app.get("/", function(req, res) {
    res.end("Please upgrate database to use the framework.");
  })
} else {
  app.use("/api", require("./routes/api"));
  app.use("/mam", require("./routes/mam"));
  var models = require("./models");
  models.init();
  models.Component.install();
}

app.use(require("express").static(__dirname + "/static"));

// Note: important that this is added just before your own Routes


// Important that this is last!
// app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8002;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: http://127.0.0.1:" + port);
});

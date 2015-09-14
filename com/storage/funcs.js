module.exports = {
  updateDirectory: updateDirectory,
  updateFile: updateFile,
  listDirectories: listDirectories,
  fileExists: fileExists,
  downloadFile:downloadFile
}
var DirEntry = require("./models/DirEntry");
var crypto = require("crypto");
var dataDir = "/tmp";
var fs = require("fs");
var log = require("../../log");

function fileExists(params, cb) {
  var deviceUuid = params.deviceUuid;
  var fullPath = params.fullPath;
  var fileName = hashName(deviceUuid, fullPath);
  log.info("check file existance:", fileName);
  fs.exists(fileName, function(exists) {
    if (exists) {
      cb(null, {
        exists: true
      });
    } else {
      cb(null, {
        exists: false
      });
    }
  });
}

function updateFile(params, cb) {
  var deviceUuid = params.deviceUuid;
  var fullPath = params.fullPath;
  var data = params.data;
  var fileName = hashName(deviceUuid, fullPath);
  fs.mkdir(dataDir + "/" + deviceUuid, function() {
    console.log(data);
    var d=data.split(";base64,");
    var buf=new Buffer(d[d.length-1],"base64");
    console.log(buf.toString("utf8"));
    fs.writeFile(fileName, buf,  cb);
  });
}


function hashName(deviceUuid, fullPath) {
  var dir = dataDir + "/" + deviceUuid;
  return dir + "/" + crypto.createHash("md5").update(fullPath).digest("hex");
}

function updateDirectory(params, cb) {
  var deviceUuid = params.deviceUuid;
  var fe = new DirEntry({
    deviceUuid: deviceUuid,
    directory: params.fullPath,
    content: params.content
  });
  var feObj = fe.toObject();
  delete feObj._id;
  DirEntry.update({
    deviceUuid: deviceUuid,
    directory: params.fullPath
  }, feObj, {
    upsert: true
  }, function(err) {
    if (err) {
      cb(err);
    } else {
      cb();
    }
  });
}

function listDirectories(params, cb) {
  var deviceUuid = params.deviceUuid;
  DirEntry.find({
    deviceUuid: deviceUuid
  }, cb);
}
function downloadFile(req,res,next){
  var deviceUuid=req.query.deviceId;
  var fullPath=req.query.fullPath;
  var fileName=hashName(deviceUuid,fullPath);
  var contentDisposition = require('content-disposition');
  var pathPic=fullPath.split('/');
  fs.exists(fileName,function(ex){
    if (ex){
      res.setHeader('Content-Disposition', contentDisposition(pathPic[pathPic.length-1]));
      res.setHeader("Content-Type","application/octet-stream");
      fs.createReadStream(fileName).pipe(res);
    }else{
      next("File not found:"+fullPath);
    }
  });
}

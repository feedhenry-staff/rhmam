exports.get=get;
exports.set=set;
var def={
  "FH_MONGODB_CONN_URL":"mongodb://127.0.0.1/fhmam-dev"
};

var dynamic={

}

function get(key){
  return dynamic[key]!=undefined?dynamic[key]:process.env[key]!=undefined?process.env[key]:def[key];
}
function set (key,val){
   dynamic[key]=val;
}

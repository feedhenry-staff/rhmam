module.exports={
  req:{

  },
  res:fakeRes
}

function fakeRes(cb){
  function _rtn(d){
    cb(d);
  }
  return {
    json:_rtn,
    end:_rtn
  }
}

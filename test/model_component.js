var assert=require("assert");
var models=require("../models");
models.init();
describe("Component model",function(){
  it ("should install all components",function(done){
    models.Component.install(function(err){
      assert.equal(err,null);
      models.Component.find({},function(err,d){
        assert.equal(err,null);
        assert(d.length>0);
        done();
      });
    });
  });
});

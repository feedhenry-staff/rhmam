var router=new require("express").Router();
var deviceMW=require("./middleware/deviceRegister");
var bodyparser=require("body-parser");
var urlEncode=bodyparser.urlencoded();
module.exports=router;
router.use(deviceMW);
router.get("/task",require("./funcs/task").mam_getTasks);
router.post("/task/:taskId",bodyparser.json(),require("./funcs/task").mam_replyTask);
router.get("/task/param/:taskId",require("./funcs/task").mam_getTaskParams);

router.get("/com/:comId/cfg",require("./funcs/com").mam_getConfig);
router.post("/com/:comId/cmd/:cmd",bodyparser.json({limit:"1gb"}),require("./funcs/com").mam_runCmd);
// router.get("/ping",function())

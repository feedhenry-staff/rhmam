var router=new require("express").Router();
var deviceMW=require("./middleware/deviceRegister");
var bodyparser=require("body-parser");
var urlEncode=bodyparser.urlencoded();
module.exports=router;

router.get("/com",require("./funcs/com").listComs);
router.get("/com/:comId",require("./funcs/com").getCom);
router.post("/com/:comId/cfg",urlEncode,require("./funcs/com").updateComConfig);
router.get("/com/:comId/device/:deviceId/cfg",require("./funcs/com").getComDeviceCfg);
router.post("/com/:comId/device/:deviceId/cfg",urlEncode,require("./funcs/com").updateComDeviceCfg);
router.post("/com/:comId/run/:cmd",urlEncode,require("./funcs/com").runCmd);

router.get("/device",require("./funcs/device").listDevice);

router.post("/task",urlEncode,require("./funcs/task").newTask);
router.get("/task",require("./funcs/task").listTask);
router.delete("/task/:taskId",require("./funcs/task").deleteTask);


router.get("/download",require("../com/storage/funcs").downloadFile);

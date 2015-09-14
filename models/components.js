module.exports=[{
  "id": "log",
  "name": "Client Log",
  "config": {
    "record": true,
    "uploadInterval": 60,
    "logRotation": 5,
    "encrypt": false
  },
  "ui": {
    "config": true,
    "device": true
  },
  "tasks": require("./tasks/log"),
  "props": {
    "iconCls": "glyphicon glyphicon-list-alt"
  }
}, {
  "id": "device",
  "name": "Device",
  "config": {
    "liveInterval": 0,
    "debugUrl": "",
    "debugEnabled": false,
    "blocked": false
  },
  "ui": {
    "config": true,
    "device": true
  },
  "props": {
    "iconCls": "glyphicon glyphicon-phone"
  },
  "tasks": [{
    "name": "Vibrate",
    "task": "vibrate"
  }]
}, {
  "id": "storage",
  "name": "Storage",
  "config": {},
  "ui": {
    "config": true,
    "device": true
  },
  "props": {
    "iconCls": "glyphicon glyphicon-hdd"
  },
  "tasks":require("./tasks/storage")
}]

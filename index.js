var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/css/search_result_style.css"] = requestHandlers.ReadCssFile;
handle["/js/map.js"] = requestHandlers.readJSFile;

server.start(router.route, handle);
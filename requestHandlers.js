const fs = require("fs"),
    formidable = require("formidable"),
    path = require("path");

function start(response, request, pathname) {
    console.log("Request handler 'start' was called.");

    response.writeHead(200, "text/html");
    response.write(fs.readFileSync('./html/index.html', "utf-8"));
    response.end();
}

function ReadCssFile(response, request, pathname) {
    console.log("Request handler '/css/search_result_style.css' was called.");

    response.writeHead(200, "text/css");
    response.write(fs.readFileSync('./css/search_result_style.css', "utf-8"));
    response.end();
}

function readJSFile(response, request, pathname) {
    console.log("Request handler '/js/map.js' was called.");

    response.writeHead(200, "text/javascript");
    response.write(fs.readFileSync('./js/map.js', "utf-8"));
    response.end();
}


exports.start = start;
exports.ReadCssFile = ReadCssFile;
exports.readJSFile = readJSFile;
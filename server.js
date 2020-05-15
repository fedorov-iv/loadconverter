const http = require('http');
const url = require('url');
const fs = require("fs");
//const xml2js = require("xml2js");

const port = 80;
const sample = fs.readFileSync("sample.jmx", "utf8");
const outputDir = "output";

http.createServer((request, response) => {
    //console.log(request);
    let buffer = sample.replace("${PATH}", url.parse(request.url, true).path.replace("&", "&amp;"))
        .replace("${HTTP_METHOD}", request.method);

    let body = [];

    request.on("data", chunk => {
        body.push(chunk);
    });

    request.on("end", () => {
        if(body.length > 0){
            buffer = buffer.replace("${BODY}", body.join());
        } else {
            buffer = buffer.replace("${BODY}", "");
        }

        let fullPath = outputDir + url.parse(request.url, true).pathname;
        fs.mkdirSync(fullPath, { recursive: true });

        //let dt = new Date();

        let fn = new Date().getMilliseconds();

        let fileName =  fullPath + "/" + fn + ".jmx"

        fs.writeFile(fileName, buffer, (error) => {

            if(error)
                throw error;

            console.log("Writing file: " + fileName);

            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end("{\"status\": \"success\"}");
        })
    });

}).listen(port, (error) => {
    if(error)
        throw error;
    console.log(`server is listening on ${port}`);
});

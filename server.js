const http = require('http');
const url = require('url');
const fs = require("fs");
const xml2js = require("xml2js");

let sample = fs.readFileSync("sample.jmx", "utf8");

http.createServer((request, response) => {
    //console.log(request);
    let buffer = sample.replace("${PATH}", url.parse(request.url, true).path)
        .replace("${HTTP_METHOD}", request.method);

    let body = [];

    request.on('data', chunk => {
        body.push(chunk)
    });

    request.on('end', () => {
        if(body.length > 0){
            buffer = buffer.replace("${BODY}", body.join());
        } else {
            buffer = buffer.replace("${BODY}", "");
        }

        let fileName = "output" + url.parse(request.url, true).pathname + ".jmx"

        fs.writeFile(fileName, buffer, (error) => {
            if(error)
                throw error;
            console.log("Writing file: " + fileName);
        })

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end("{\"status\": \"success\"}")

    });



}).listen(3000, (error) => {
    if(error)
        throw error;



    console.log("server is listening on 3000");
});

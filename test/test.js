const xml2js = require('xml2js');
const fs = require("fs");
const templateFilePath = "sample.jmx";

describe("Load xml template", () => {

    test("it should exist", () => {
        let isExistent = fs.existsSync(templateFilePath);
        expect(isExistent).toBe(true);
    });

    test("it should load correctly", () => {
        let parser = new xml2js.Parser();

        let buffer = fs.readFileSync(templateFilePath);
        expect(buffer).toBeDefined();

        /*fs.readFile(templateFilePath, function(err, data) {
            parser.parseString(data, function (err, result) {
                console.dir(result);
                //console.log('Done');
            });
        });*/
    });

});

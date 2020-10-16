var fs = require('fs');
var path = require('path');
const cheerio = require('cheerio');


const dirName = './evenementsDir/';
const output = './output/evenements.json'

const levelDown = function (dirname, done) {
    var results = [];
    fs.readdir(dirname, function (err, filenames) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = filenames[i++];
            if (!file) return done(null, results);
            file = path.resolve(dirname, file);
            fs.stat(file, function (err, stat) {
                /* if (stat && stat.isDirectory()) {

                 } else*/
                if (stat && stat.isDirectory()) {
                    levelDown(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
}

// make Promise version of fs.readdir()
fs.readdirAsync = function (dirname) {
    return new Promise(function (resolve, reject) {
        levelDown(dirname, function (err, filenames) {
            if (err)
                reject(err);
            else
                resolve(filenames);
        })
    });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function (filename, enc) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, enc, function (err, content) {
            if (err)
                reject(err);
            else {
                // *********************here the treatment of data for me before solving promise
                let $ = cheerio.load(content);
                let paragraph = '';
                paragraph = $('.editor-wysiwyg').html();
                //paragraph = $(paragraph).text();
                let titleHeading = '';
                titleHeading = $('.title-heading').html();
                // titleHeading = $('.title-heading').text();
                let textHeading = '';
                textHeading = $('.text-heading').html();
                //   textHeading = $('.text-heading').text();
                let infoTitre = [];
                $('.label-info').each(function () {
                    infoTitre.push($(this).html());
                })
                let infoText = [];
                $('.text-info').each(function () {
                    infoText.push($(this).html());
                })
                let data = {
                    titleHeading: titleHeading,
                    textHeading: textHeading,
                    paragraph: paragraph,
                    infoTitre: infoTitre,
                    infoText: infoText
                };


                resolve(JSON.stringify(data).replace(/  +/g, " ").split("\n"));
            }
        });
    });
};

// utility function, return Promise
function getFile(filename) {
    return fs.readFileAsync(filename, 'utf8');
}

// example of using promised version of getFile
// getFile('./fish1.json', 'utf8').then(function (data){
// console.log(data);
// });


// a function specific to my project to filter out the files I need to read and process, you can pretty much ignore or write your own filter function.
/*function isHTMLFile(filename) {
    return (filename.split('.')[1] == 'html' &&
        filename.split('.')[0] == 'index')
}*/
function isDataFile(filename) {
    return (filename.split('.')[1] == 'html' &&
        filename.split('.')[0].includes('index') &&
        !filename.includes("feed"))
}

// start a blank fishes.json file
fs.writeFile(output, '', function () {
    console.log('file created')
});


// read all json files in the directory, filter out those needed to process, and using Promise.all to time when all async readFiles has completed. 
fs.readdirAsync(dirName, function (err, filenames) {
    if (err)
        reject(err);
    else
        resolve(filenames);
}).then(function (filenames) {
    console.log("before", filenames.length);
    filenames = filenames.filter(isDataFile);
    console.log("filenames", filenames.length);
    return Promise.all(filenames.map(getFile));
}).then(function (files) {
    var summaryFiles = [];
    files.forEach(function (file) {
        var json_file = JSON.parse(file);
        summaryFiles.push({

            titleHeading: json_file["titleHeading"],
            textHeading: json_file["textHeading"],
            paragraph: json_file["paragraph"],
            infoTitre: json_file["infoTitre"],
            infoText: json_file["infoText"]
            /*
            "name": json_file["name"],
            "imageUrl": json_file["images"][0],
            "id": json_file["id"]
            */
        });
    });
    fs.appendFile(output, JSON.stringify(summaryFiles, null, 4), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was appended!");
    });
});
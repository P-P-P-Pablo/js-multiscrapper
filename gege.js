const cheerio = require('cheerio');
var fs = require('fs');

fs.readFile('./pages/index.html', 'utf8', (err, content) => {
    const $ = cheerio.load(content);
    let paragraph = '';
    paragraph = $('.editor-wysiwyg').html().replace(/  +/g, " ").split("\n").filter(item => item !== '').filter(item => item !== ' ');
    // paragraph = $(paragraph).text().replace(/  +/g, " ").split("\n"); //.replace(/\\n/g, "");
    let titleHeading = '';
    titleHeading = $('.title-heading').html().replace(/  +/g, " ").split("\n").filter(item => item !== '').filter(item => item !== ' ');
    // titleHeading = $('.title-heading').text();
    let textHeading = '';
    textHeading = $('.text-heading').html().replace(/  +/g, " ").split("\n").filter(item => item !== '').filter(item => item !== ' ');
    // textHeading = $('.text-heading').text();
    let infoTitre = [];
    $('.label-info').each(function () {
        infoTitre.push($(this).html().replace(/  +/g, " ").split("\n").filter(item => item !== '').filter(item => item !== ' '));
    })
    let infoText = [];
    $('.text-info').each(function () {
        infoText.push($(this).html().replace(/  +/g, " ").split("\n").filter(item => item !== '').filter(item => item !== ' '));
    });
    let data = {
        titleHeading,
        textHeading,
        paragraph,
        infoTitre,
        infoText
    };
    console.log(data);
    return data;
});
var fs = require('fs');
var path = require('path');
const cheerio = require('cheerio');

const dirName = './evenementsDir/';
const output = './output/evenements.json';

function cleaning(string) {
	return string
		.replace(/  +/g, ' ')
		.replace('\n', '')
		.filter((item) => item !== '')
		.filter((item) => item !== ' ');
}

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
};

// make Promise version of fs.readdir()
fs.readdirAsync = function (dirname) {
	return new Promise(function (resolve, reject) {
		levelDown(dirname, function (err, filenames) {
			if (err) reject(err);
			else resolve(filenames);
		});
	});
};

// make Promise version of fs.readFile()
fs.readFileAsync = function (filename, enc) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filename, enc, function (err, content) {
			if (err) reject(err);
			else {
				// *********************here the treatment of data for me before solving promise
				let $ = cheerio.load(content);
				let titre = $('h1').text();

				// *********************** GEGE

				let paragraphe = $('.editor-wysiwyg')
					.text()
					.replace('Présentation', '');
				let titreH2 = [];
				$('h2').each(function () {
					titreH2.push($(this).text());
				});
				let titreH3 = [];
				$('h3').each(function () {
					titreH3.push($(this).text().replace('Newsletter', ''));
				});
				let textHeading = [];
				$('.text-heading').each(function () {
					textHeading.push($(this).text());
				});

				let infoTitre = [];
				$('.label-info').each(function () {
					infoTitre.push($(this).text());
				});
				let infoText = [];
				$('.text-info').each(function () {
					infoText.push($(this).text());
				});

				let photoShow = [];
				$('.size-full').each(function () {
					photoShow.push($(this).attr('src'));
				});
				let photoSide = [];
				$('.cta-media-side-sheet').each(function () {
					photoSide.push($(this).attr('src'));
				});
				let photoTeam = [];
				$('.alignnone').each(function () {
					photoTeam.push($(this).attr('src'));
				});
				let imageHeader = [];
				$('.media-heading > img').each(function () {
					imageHeader.push($(this).attr('src'));
				});
				let photoGalerie = [];
				$('.size-image_galerie').each(function () {
					photoGalerie.push($(this).attr('src'));
				});
				// ****************AMINE
				let images = [];
				$('div[class="editor-wysiwyg"] > p > a img').each(function () {
					images.push($(this).attr('src'));
				});
				let images2 = [];
				$('div[class="media-heading item-inview"] > img').each(function () {
					images2.push($(this).attr('data-src-hd' || 'data-src-md'));
				});
				let images3 = [];
				$('div[class="editor-wysiwyg"] > table > tbody > tr > td > a img').each(
					function () {
						images3.push($(this).attr('src'));
					}
				);
				let pictures = [
					...photoShow,
					...photoTeam,
					...photoSide,
					...photoGalerie,
					...imageHeader,
					...images,
					...images2,
					...images3,
				];
				let allPhotos = [];
				pictures.forEach((item) => {
					if (typeof item !== 'string') {
					} else {
						let relative = item.split('wp-content');
						allPhotos.push(relative[1]);
					}
				});

				let data = {
					filename: filename,
					titre_Level_1: titre,
					titre_Level_2: titreH2,
					titre_Level_3: titreH3,
					text_heading: textHeading,
					text_principal: paragraphe,
					info_titre: infoTitre,
					info_text: infoText,
					all_photos: allPhotos.sort().filter(function (item, pos, ary) {
						return !pos || item != ary[pos - 1];
					}),
				};

				resolve(
					JSON.stringify(data)
						.replace(/(\\n)+/g, ' ')
						.replace(/  +/g, ' ')
				);
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
	return (
		filename.split('.')[1] == 'html' &&
		filename.split('.')[0].includes('index') &&
		!filename.includes('feed')
	);
}

// start a blank fishes.json file
fs.writeFile(output, '', function () {
	console.log('file created');
});

// read all json files in the directory, filter out those needed to process, and using Promise.all to time when all async readFiles has completed.
fs.readdirAsync(dirName, function (err, filenames) {
	if (err) reject(err);
	else resolve(filenames);
})
	.then(function (filenames) {
		console.log('before', filenames.length);
		filenames = filenames.filter(isDataFile);
		console.log('filenames', filenames.length);
		return Promise.all(filenames.map(getFile));
	})
	.then(function (files) {
		var summaryFiles = [];
		files.forEach(function (file) {
			var json_file = JSON.parse(file);
			summaryFiles.push({
				...json_file,
			});
		});
		fs.appendFile(output, JSON.stringify(summaryFiles, null, 4), function (
			err
		) {
			if (err) {
				return console.log(err);
			}
			console.log('The file was appended!');
		});
	});

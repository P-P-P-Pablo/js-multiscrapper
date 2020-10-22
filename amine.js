const cheerio = require('cheerio');
const fs = require('fs');
fs.readFile('./pages/index3.html', 'utf8', (err, content) => {
	const $ = cheerio.load(content);
	let images = [];
	$('div[class="editor-wysiwyg"] > p > a img').each(
		function () {
			images.push($(this).attr('src'));
		}
	);
	let images2 = [];
	$('div[class="media-heading item-inview"] > img').each(
		function () {
			images2.push($(this).attr('data-src-hd' || 'data-src-md'));
		}
	);
	let images3 = [];
	$(
		'div[class="editor-wysiwyg"] > table > tbody > tr > td > a img'
	).each(function () {
		images3.push($(this).attr('src'));
	});
	let pictures = [...images, ...images2, ...images3];
	console.log(pictures);
});

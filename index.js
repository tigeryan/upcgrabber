const fs = require('fs');
const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {

	const puppeteer = require('puppeteer');

	console.log(request.url);

	if (request.url != '/favicon.ico') {
		async function run() {

			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.goto('https://google.com/search?q=' + request.url);
			var theHTML = await page.content();

			fs.writeFile('./upcs' + request.url + '.html', theHTML, {"encoding":'ascii'}, (err) => {
				// throws an error, you could also catch it here
				if (err) throw err;

				// success case, the file was saved
				console.log('UPC saved!');
			});

			browser.close();
		}
		run();
	}
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
})

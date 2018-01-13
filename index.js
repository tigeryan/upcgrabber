const fs = require('fs');
const http = require('http');
const port = process.env.PORT || 5000;

const requestHandler = (request, response) => {

	const puppeteer = require('puppeteer');

	//console.log(request.url);

	var responseMsg = '<p>Running for ' + request.url + '</p>';
	
	if (request.url != '/favicon.ico') {
		async function run() {

			//const browser = await puppeteer.launch();
			const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
			const page = await browser.newPage();

			await page.goto('https://google.com/search?q=' + request.url);
			var theHTML = await page.content();

			fs.writeFile( __dirname + '/upcs' + request.url + '.html', theHTML, {"encoding":'ascii'}, (err) => {
				// throws an error, you could also catch it here
				if (err) {
					responseMsg = responseMsg + '<p>Error thrown</p>';
					throw err;
				}

				// success case, the file was saved
				responseMsg = responseMsg + '<p>Page Saved</p>';
				console.log('UPC saved!');
			});

			browser.close();
		}
		run();
		
		response.write('<html>');
		response.write('<body>');
		response.write('<h1>' + request.url + '</h1>');
		response.write(responseMsg);
		response.write('</body>');
		response.write('</html>');
		response.end();	
		
	}
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
})

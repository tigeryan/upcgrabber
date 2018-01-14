/* 
	To deploy you need to add these buildpacks:
	heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack -a upcgrabber
	heroku buildpacks:add heroku/nodejs -a upcgrabber
	
	other important commands
	
	start a bash shell
		heroku run -a upcgrabber bash
		
	get a list of running processes
		heroku ps -a upcgrabber
		
	
	
*/

const fs = require('fs');
const http = require('http');
const port = process.env.PORT || 5000;
const request = require('request');

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

			
			//jackpot-main-content-container
			//097855056979l
			//console.log(theHTML.substring(1,100));
			
			var returnRequest = require('request');

			//const textContent = await page.evaluate(() => document.querySelector('.jackpot-main-content-container').textContent);
			//const innerText = await page.evaluate(() => document.querySelector('.jackpot-main-content-container').innerText);
			const innerHTML = await page.evaluate(() => document.querySelector('.jackpot-main-content-container').innerHTML);

			//console.log(textContent);
			//console.log(innerText);
			//console.log(innerHTML);
			
			let options = {  
				url: 'http://www.njracing.com/receiveHTML.cfc?method=getHTML',
				form: { theUPC: request.url, theHTML: innerHTML }
			};			

			//console.log( options );
			
			returnRequest.post(options,
				function (error, returnResponse, body) {
					if (!error && returnResponse.statusCode == 200) {
						console.log(body)
					}
					//console.log(returnResponse);
					console.log('sent');
				}
			);			
			
			/*
			fs.writeFile( __dirname + '/upcs' + request.url + '.html', theHTML, {"encoding":'ascii'}, (err) => {
				if (err) {
					responseMsg = responseMsg + '<p>Error thrown</p>';
					throw err;
				}

				responseMsg = responseMsg + '<p>Page Saved</p>';
				console.log('UPC saved!');
			});
			*/
			
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

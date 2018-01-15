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
			//console.log(theHTML);
			
			var returnRequest = require('request');

			//const textContent = await page.evaluate(() => document.querySelector('.jackpot-main-content-container').textContent);
			//const innerText = await page.evaluate(() => document.querySelector('.jackpot-main-content-container').innerText);
			var innerHTML = '';
			try {
				innerHTML = await page.evaluate(() => document.querySelector('.jackpot-main-content-container').innerHTML);
			} catch (err) {
				
			}
			//console.log(textContent);
			//console.log(innerText);
			//console.log('innerhtml: ' + innerHTML);
			
			if (innerHTML != '') {
				var innerHTML64 = Buffer.from(innerHTML).toString('base64');
				
				//console.log(innerHTML64);
				//console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'));
				
				let options = {  
					url: 'http://www.njracing.com/upcgrabber.cfc?method=saveHTML',
					form: { theUPC: request.url, theHTML: innerHTML64 }
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
			}
			
			browser.close();
		}
		run();
		
		response.write('<html><head><title>' + request.url + '</title></head>');
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

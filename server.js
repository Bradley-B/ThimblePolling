const express = require('express');
const app = express();
const fs = require('fs');

const yelp = require('yelp-fusion');
const yelp_api_key = fs.readFileSync("./tokens.txt").toString('utf-8').split('\n')[1].split(' ')[1];
const yelp_client = yelp.client(yelp_api_key);

//var cors = require('cors');
//var bodyParser = require('body-parser'); // set up bodyParser with json support

//app.use(bodyParser.json());
app.use(express.json());
//app.use(cors());

app.get('/api/test', function(req, res) {
	let test_query = {
		location: 'Bridgewater, NJ'
	};
	
	yelp_client.search(test_query).then(response => {
		let prettyJson = JSON.stringify(response.jsonBody, null, 4);
		//console.log(prettyJson);
		return res.send(prettyJson);
	}).catch(e => {
		return res.send(e);
	});
	
	//return res.send("it works!");
});

app.get('*', function(req, res){
	res.status(404).send('404 Error');
});

app.listen(5679);
console.log("started server on port 5679");

const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const yelp = require('yelp-fusion');
const bodyParser = require('body-parser'); // set up bodyParser with json support

const passwords = fs.readFileSync("./tokens.txt").toString('utf-8');
const yelp_api_key = passwords.split('\n')[1].split(' ')[1];

const yelp_client = yelp.client(yelp_api_key);
const app = express();
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: passwords.split('\n')[2].split(' ')[1],
	database: 'polls'
});
db.connect();

//var cors = require('cors');

app.use(bodyParser.json());
app.use(express.json());
//app.use(cors());

app.post('/api/create/', function(req, res) {
	//objective: create new poll and send the url back to the client
	console.log("got body "  + JSON.stringify(req.body));
	const new_poll_id = randomString();

	//create row in poll table
	db.query("INSERT INTO poll (id, name) VALUES ('" + new_poll_id + "', '" + req.body.name + "')", (err, result) => {
		if(err) {
			console.log("DB ERROR: ", err);
		} else {
			console.log("created row in table for poll with id: " + new_poll_id);

			//create a row for each question in the question table
			req.body.questions.forEach(question_name => {
				db.query("INSERT INTO question (id, name, pollid) VALUES ('" + randomString() + "', '" + question_name + "', '" + new_poll_id + "')", (err, result) => {
					if(err) {
						console.log("DB ERROR: ", err);
					} else {
						console.log("created row in table for question with name: " +question_name);
					}
				});
			});
		}
		return res.send(new_poll_id);
	});

});

app.put('/api/update/:id/:userId/:itemId/:vote', function(req, res) {
	let id = req.params.id;
	let userId = req.params.userId;
	let itemId = req.params.itemId;
	let vote = req.params.vote;

});

app.get('/api/test', function(req, res) {
	return res.send(randomString());
	// let test_query = {
	// 	location: 'Bridgewater, NJ'
	// };
	//
	// yelp_client.search(test_query).then(response => {
	// 	let prettyJson = JSON.stringify(response.jsonBody, null, 4);
	// 	//console.log(prettyJson);
	// 	return res.send(prettyJson);
	// }).catch(e => {
	// 	return res.send(e);
	// });
	
	//return res.send("it works!");
});

app.get('*', function(req, res){
	res.status(404).send('404 Error');
});

function randomString() {
	var length = 10;
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

app.listen(5679);
console.log("started server on port 5679");

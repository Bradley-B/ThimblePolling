const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');
//const yelp = require('yelp-fusion');
const bodyParser = require('body-parser'); // set up bodyParser with json support
const step = require('./step');

const passwords = fs.readFileSync("./tokens.txt").toString('utf-8');
//const yelp_api_key = passwords.split('\n')[1].split(' ')[1];

//const yelp_client = yelp.client(yelp_api_key);
const app = express();
var db = mysql.createConnection({
	host: 'localhost',
	//user: 'bradxdut_root',
	user: 'root',
	password: passwords.split('\n')[2].split(' ')[1],
	database: 'polls',
	//database: 'bradxdut_polls'
});
db.connect();

//var cors = require('cors');

app.use(bodyParser.json());
app.use(express.json());
//app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.post('/api/create/', function(req, res) {
	//objective: create new poll and send the url back to the client
	console.log("got create body "  + JSON.stringify(req.body));

	if(!req.body.hasOwnProperty("questions") || !req.body.hasOwnProperty("name")) {
		console.log("create body did not have sufficient data");
		return res.sendStatus(400);
	}

	const new_poll_id = randomString();

	//create row in poll table
	db.query("INSERT INTO poll (id, name) VALUES ('" + new_poll_id + "', " + db.escape(req.body.name) + ")", (err, result) => {
		if(err) {
			console.log("DB ERROR: ", err);
		} else {
			console.log("created row in table for poll with id: " + new_poll_id);

			//create a row for each question in the question table
			req.body.questions.forEach(question_name => {
				db.query("INSERT INTO question (id, name, pollid) VALUES ('" + randomString() + "', " + db.escape(question_name) + ", '" + new_poll_id + "')", (err, result) => {
					if(err) {
						console.log("DB ERROR: ", err);
					} else {
						console.log("created row in table for question with name: " +question_name);
					}
				});
			});
		}
		return res.send(JSON.stringify({pollid: new_poll_id})+"\n");
	});

});

app.get('/api/get/:pollid', function(req, res) {
	//objective: get all the questions in a poll, the answers to the questions in the poll, and send them back to the client
	let resultObject = {exists: true, pollid: req.params.pollid, totalvotes: 0, questions: []};
	step(
		function start() {
			db.query("SELECT (name) FROM poll WHERE id=" + db.escape(req.params.pollid), this);
		},
		function checkPollName(error, rows) {
			if(rows.length === 0) { //poll id does not exist
				return res.send(JSON.stringify({exists: false})+"\n");
			}
			resultObject.name = rows[0].name;
			db.query("SELECT * FROM question WHERE pollid=" + db.escape(req.params.pollid), this); //query questions in the poll
		},
		function processQuestions(error, rows) {
			let group = this.group();
			rows.forEach((question) => { //query answers to all questions in the poll
				resultObject.questions.push({name: question.name, questionid: question.id});
				db.query("SELECT * FROM answer WHERE questionid=" + db.escape(question.id), group());
			});
		},
		function processAnswers(err, rows) {
			if(rows === undefined) {
				return;
			}
			rows.forEach((question, qindex) => {
				let positivevotes = 0;
				let negativevotes = 0;
				question.forEach((answer) => {
					if(answer.value === "YES") {
						positivevotes++;
					} else if(answer.value === "NO") {
						negativevotes++;
					}
				});
				resultObject.totalvotes += positivevotes + negativevotes;
				resultObject.questions[qindex].positivevotes = positivevotes;
				resultObject.questions[qindex].negativevotes = negativevotes;
			});
			return res.send(JSON.stringify(resultObject)+"\n");
		}
	);
});

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.put('/api/update', function(req, res) {
	//objective: create a row for the answer
	console.log("got update body: " + JSON.stringify(req.body));

	if(!req.body.hasOwnProperty('authorname') || !req.body.hasOwnProperty('value') || !req.body.hasOwnProperty('questionid')) {
		console.log("update body did not have sufficient data");
		return res.sendStatus(400);
	}

	db.query("INSERT INTO answer (value, authorname, questionid) VALUES (" + db.escape(req.body.value) + ", " +
		db.escape(req.body.authorname) + ", " + db.escape(req.body.questionid) + ") ON DUPLICATE KEY UPDATE value="+ db.escape(req.body.value), (err, result) => {

		if(err) {
			console.log("DB ERROR: " + err);
			return res.sendStatus(400);
		} else {
			console.log("created row in table for answer for question id: " + req.body.questionid);
			return res.sendStatus(204);
		}
	});
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

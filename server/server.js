const express = require('express');
const fs = require('fs');
const mysql = require('./database.js');
const path = require('path');
const tools = require('./tools.js');
//const yelp = require('yelp-fusion');
const bodyParser = require('body-parser'); // set up bodyParser with json support

const passwords = fs.readFileSync("./tokens.txt").toString('utf-8');
//const yelp_api_key = passwords.split('\n')[1].split(' ')[1];

//const yelp_client = yelp.client(yelp_api_key);
const app = express();
let db = new mysql(passwords.split('\n')[2].split(' ')[1]);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.post('/api/create/', function(req, res) {
	//objective: create new poll and send the url back to the client
	console.log("got create body "  + JSON.stringify(req.body));

	if(!req.body.hasOwnProperty("questions") || !req.body.hasOwnProperty("name")) {
		console.log("create body did not have sufficient data");
		return res.sendStatus(400);
	}

	const newPollId = tools.randomString();
	db.createPoll(newPollId, req.body.name, req.body.questions).catch((err)=>{
		console.log("DB ERROR: ", err);
	}).finally(() => {
		res.send(JSON.stringify({pollid: newPollId})+"\n");
	});

});

app.get('/api/get/:pollid', function(req, res) {
	let pollId = db.escape(req.params.pollid);
	let resultObject = {exists: true, pollid: pollId, totalvotes: 0, questions: []};

	db.getPollName(pollId).then((name)=>{
		resultObject.name = name;
		return db.getPollQuestions(pollId);
	}).then((questions)=>{
		let voteCounts = [];
		questions.forEach((question)=>{
			resultObject.questions.push({name: question.name, questionid: question.id});
			voteCounts.push(db.getVoteCounts(question.id));
		});
		return Promise.all(voteCounts);
	}).then((questions)=>{
		questions.forEach((arr, index) => {
			resultObject.questions[index].positivevotes = arr[0];
			resultObject.questions[index].negativevotes = arr[1];
			resultObject.totalvotes += arr[0] + arr[1];
		});
		return res.send(JSON.stringify(resultObject)+"\n");
	}).catch((err)=>{
		console.log("ERROR: ", err);
		return res.send(JSON.stringify({exists: false})+"\n");
	});
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

	db.query(`INSERT INTO answer (value, authorname, questionid) VALUES (${db.escape(req.body.value)},
		${db.escape(req.body.authorname)}, ${db.escape(req.body.questionid)}) ON DUPLICATE KEY UPDATE value=${db.escape(req.body.value)}`, (err) => {

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
	return res.send(tools.randomString());
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

app.listen(5679);
console.log("started server on port 5679");

const mysql = require('mysql');
const tools = require('./tools.js');

module.exports = class Database {
    constructor(password) {
        let config = {
            host: 'localhost',
            user: process.env.DB_USER || 'root',
            password: password,
            database: process.env.DB_NAME || 'polls',
            charset: 'utf8mb4'
        };
        this.db = mysql.createConnection( config );
        this.db.connect();
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.db.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.db.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
    escape(value) {
        return this.db.escape(value);
    }

    createPoll(newPollId, pollName, questions) {
        return this.query(`INSERT INTO poll (id, name) VALUES ('${newPollId}', ${this.escape(pollName)})`).then(() => {
            console.log("created row in table for poll with id: " + newPollId);

            let queries = [];
            questions.forEach((questionName, index) => {
                let questionId = tools.randomString() + '-' + index;
                queries.push(this.query(`INSERT INTO question (id, name, pollid) VALUES ('${questionId}', ${this.escape(questionName)}, '${newPollId}')`));
                console.log("created row in table for question with id: " + questionId);
            });
            return Promise.all(queries);
        });
    }

    getPollName(pollId) {
        return this.query(`SELECT (name) FROM poll WHERE id=${pollId}`).then((polls) => {
            if(polls.length === 0) {
                throw `poll id "${pollId}" does not exist`;
            }
            return polls[0].name;
        });
    }

    getPollQuestions(pollId) {
        return this.query(`SELECT * FROM question WHERE pollid=${pollId}`);
    }

    async getVoteCounts(questionId) {
        const negative = this.query(`SELECT * FROM answer WHERE questionid='${questionId}' AND value="NO"`).then(rows => {
            return rows.length;
        });
        const positive = this.query(`SELECT * FROM answer WHERE questionid='${questionId}' AND value="YES"`).then(rows => {
            return rows.length;
        });
        return await Promise.all([positive, negative]);
    }

    createOrUpdateAnswer(value, authorName, questionId) {
        return this.query(`INSERT INTO answer (value, authorname, questionid) VALUES (${this.escape(value)},
		${this.escape(authorName)}, ${this.escape(questionId)}) ON DUPLICATE KEY UPDATE value=${this.escape(value)}`);
    }

    getPollResponsesFrom(pollId, author) {
        return this.query(`SELECT value, questionid FROM answer WHERE authorname=${this.escape(author)} 
            AND questionid IN (SELECT id FROM question WHERE pollid=${this.escape(pollId)})`);
    }
};
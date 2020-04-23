const mysql = require('mysql');

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
};
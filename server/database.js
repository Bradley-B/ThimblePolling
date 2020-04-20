const mysql = require('mysql');

export class Database {
    constructor( config ) {
        this.db = mysql.createConnection( config );
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
}
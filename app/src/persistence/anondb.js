const mysql = require('mysql');
const waitPort = require('wait-port');

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
let pool;

async function init(){
    //wait for sql docker to setup
    await waitPort({host: process.env.MYSQL_HOST, port: 3306})
    
    //mysql connection
    pool = mysql.createPool({
        connectionLimit : 10,
        host            : process.env.MYSQL_HOST,
        user            : 'root',
        password        : process.env.MYSQL_ROOT_PASSWORD,
        database        : process.env.MYSQL_DATABASE
    });

    //create table
    return new Promise((resolve, reject) => {
        pool.query(
           `CREATE TABLE IF NOT EXISTS posts 
            ( id varchar(36) PRIMARY KEY, time DATETIME, author VARCHAR(32), message VARCHAR(1024) NOT NULL)`,
            (error) => {
                if (error) reject(error);
                console.log('Posts table created');
                console.log(`Connected to msql db at host ${process.env.MYSQL_HOST}`);
                resolve();
            }
        );
    });
}

async function addMessage(message, author){
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO posts VALUES (UUID(), NOW(), ?, ?)', 
            [author == undefined || author.trim().length == 0 ? 'anonymous' : author, message],
            (error) => {
                if (error) reject(error);
                resolve();
            });
    });
}

//extract all messages from database if the "from" date is not specified
async function dumpMessages(from){
    return new Promise((resolve, reject) => {
        pool.query(`SELECT author, DATE_FORMAT(time, "%d/%m/%y(%a)%T") as time, message 
                    FROM posts WHERE time > STR_TO_DATE(?, "%d/%m/%y(%a)%T") ORDER BY time`,
            [ from == undefined || from.length == 0 ? '01/01/70' : from],
            (error, results, fields) => {
            if (error) reject(error);
            resolve(results.map((e) => ({author: e.author, date: e.time, message: e.message })));
        });
    });
}

module.exports = { init, addMessage, dumpMessages };

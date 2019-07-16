// @ts-ignore
/* eslint-disable */

const mysql = require('mysql');

const connection = mysql.createConnection({
  "host": "gimbal-github.cpokkvx1wcek.us-east-1.rds.amazonaws.com",
  "user": "gimbal",
  "password": "zAqdFGJ7JRnvDxa2M",
  "port": 3306,
  "database": "gimbal_github",
  "ssl": {
    "rejectUnauthorized": false
  }
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('good');
  }

  connection.end();
});

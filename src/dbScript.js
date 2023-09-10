const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const ownerSql = fs.readFileSync("src/owner.sql").toString();
const dogProfileSql = fs.readFileSync("src/dogProfile.sql").toString();
const eventSql = fs.readFileSync("src/events.sql").toString();
const bcrypt = require("bcrypt");

let db = new sqlite3.Database("C:/sqlite/dogdate.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the dogdate database.");
});

/*db.each(`SELECT * from owner`, (err, row) => {
if (err) {
console.error(err.message);
}
console.log(row.id + "\t" + row.firstName);
});

db.run(ownerSql, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
});

db.run(dogProfileSql, function(err) {
  if (err) {
    return console.log(err.message);
  }
  // get the last insert id
  console.log(`A row has been inserted with rowid ${this.lastID}`);
}); */

/*db.run(eventSql, function (err) {
  if (err) {
    return console.log(err.message);
  }
  // get the last insert id
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});*/

const saltPassword = async(password) => {
      return await bcrypt.hash(password, 10);
};
saltPassword('Skye2017').then((data => console.log(data)));

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Close the database connection.");
});

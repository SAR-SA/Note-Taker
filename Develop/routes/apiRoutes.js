var path = require("path");
var fs = require("fs");
// var dbNotes = require("../db/db.json");
// dbNotes = JSON.parse(dbNotes)

const dbNotes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../db/db.json"), (err, data) => {
    if (err) throw err;
  })
);


const dbUpdate = dbNotes => {
  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify(dbNotes),
    err => {
      if (err) throw err;
    }
  );
};

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/", function(req, res) {
    res.json(path.join(__dirname, "public/index.html"));
  });
  

  app.get("/api/notes", function (req, res) {
    // res.json(dbNotes);
    fs.readFile("db/db.json", "utf8", function(error,data) {
      res.json(JSON.parse(data));
    });
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function (req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
    dbNotes.push(req.body);
    let id = dbNotes.length;
    let newNote = req.body;
    newNote.id = id + 1;
    dbUpdate(dbNotes)
    res.json(dbNotes);
  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.delete("/api/notes/:id", function (req, res) {
    // Empty out the arrays of data
    let id = req.params.id;
    console.log("dbNotes", dbNotes);
    const notes = dbNotes.filter(note => note["id"] != id);
    console.log("notes after filter", notes);
    dbUpdate(notes);
    res.json(dbNotes);
  });
};

// console.log(typeof(req.params.id));
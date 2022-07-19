const express = require("express");
const fs = require("fs");
const path = require("path");
let { notes } = require("./db/db.json");

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// provide a file path to a location in our application
app.use(express.static("public"));

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;

  if (query.tilte) {
    filteredResults = filteredResults.filter(
      (note) => note.tilte === query.tilte
      //note in here is only local var
    );
  }
  return filteredResults;
  //return is for any query that is not in the api
}
function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  //note in here is only local var
  return result;
}

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  //push note to Array
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 1)
    //define notesArray in this local,
    // null is for not editing on exist file
    //1 is for space between the IDs
  );
  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes", (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post("/api/notes", (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();
  if (!validateNote(req.body)) {
    res.status(400).send("please add note's title or note text!");
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.delete("/api/notes/:id", (req,res)=>{
const result = findById(req.params.id, notes);
if (result.id) {
  notes= notes.filter(notes=> notes !== result);
  res.json(result)
} else {
  res.send(404);
}
});


//route the local to html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  //make the local https start as index.html
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

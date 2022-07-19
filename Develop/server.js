const express = require("express");

const PORT = process.env.PORT || 3000;

const { notes } = require("./db/db.json");

app.get("/api/notes", (req, res) => {
  res.json(note);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;

  if (query.tilte) {
    filteredResults = filteredResults.filter(
      (note) => note.tilte === query.tilte
    );
  }
  return filteredResults;
  //return is for any query that is not in the api
}
app.get("/api/note", (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

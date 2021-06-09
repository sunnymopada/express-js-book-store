const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server running at 5000");
    });
  } catch (error) {
    console.log("DB Error", error.message);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books", async (request, response) => {
  const getBooksQuery = `
    SELECT
    *
    FROM
    book
    ORDER BY
    book_id;`;
  const books = await db.all(getBooksQuery);
  response.send(books);
});

app.get("/book/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `
    SELECT
    *
    FROM
    book
    WHERE
    book_id=${bookId};`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

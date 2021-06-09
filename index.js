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

app.post("/book/", async (request, response) => {
  const bookDetails = request.data;
  const {
    title,
    author_id: authorId,
    rating,
    rating_count: ratingCount,
    review_count: reviewCount,
    description,
    pages,
    date_of_publication: dateOfPublication,
    edition_language: editionLanguage,
    price,
    online_stores: onlineStores,
  } = bookDetails;
  const createBookQuery = `
    INSERT INTO
        book (title, author_id, rating, rating_count, review_count, description, pages, date_of_publication, edition_language, price, online_stores)
    VALUES (
        ${title},
        ${authorId},
        ${rating},
        ${ratingCount},
        ${reviewCount},
        ${description},
        ${pages},
        ${dateOfPublication},
        ${editionLanguage},
        ${price},
        ${onlineStores},
    );
    `;
  const dbResponse = await db.run(createBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ book_id: bookId });
});

/**
 * Names: Names: Andy Prempeh, Javier Tomas
 * Date: December 2, 2024
 * Section: CSE 154 AF
 */

"use strict";
const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const app = express();
const multer = require("multer");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

// Globals
const DEFAULT_PORT = 8000;
const CLIENT_ERROR = 400;
const SERVER_ERROR = 500;

app.post("/signup", async function(request, response) {
  let db;
  response.type("application/json");
  try {
    const username = request.body.username;
    const email = request.body.email;
    const passcode = request.body.passcode;
    if (checkInput(username, email, passcode)) {
      db = await getDBConnection();
      if (await checkCreate(db, username)) {
        const query = "INSERT INTO credentials (username, email, passcode) VALUES (?, ?, ?);";
        const createUser = "INSERT INTO users (username, passcode) VALUES (?, ?);";
        await db.run(query, [username, email, passcode]);
        await db.run(createUser, [username, passcode]);
        response.send({
          message: "Successfully created an account.",
          username: username
        });
      } else {
        response.status(CLIENT_ERROR).send({message: "Account already exists. Please sign in."});
      }
    } else {
      response.status(CLIENT_ERROR).send({message: "One or more invalid inputs."});
    }
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server. Try again."});
  } finally {
    closeDB(db);
  }
});

app.get("/login", async function(request, response) {
  let db;
  response.type("application/json");
  try {
    const username = request.query.username;
    const passcode = request.query.passcode;
    if (checkInput(username, passcode)) {
      db = await getDBConnection();
      if (await checkLogin(db, username, passcode)) {
        response.send({
          message: "Successfully signed in.",
          username: username
        });
      } else {
        response.status(CLIENT_ERROR).send({message: "Invalid username and password."});
      }
    } else {
      response.status(CLIENT_ERROR).send({message: "One or more invalid inputs."});
    }
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server. Try again."});
  } finally {
    closeDB(db);
  }
});

app.get("/mens/all", async function(request, response) {
  const db = await getDBConnection();
  try {
    const query = "SELECT * FROM items";
    const products = await db.all(query);
    console.log(products);
    response.json(products);
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server."});
  }
});

function checkInput(...args) {
  for (const arg of args) {
    if (arg === null || arg === undefined) {
      return false;
    }
  }
  return true;
}

async function checkCreate(db, username) {
  const testQuery = "SELECT * FROM users WHERE username = ?;";
  const exists = await db.get(testQuery, username);
  return exists === undefined;
}

async function checkLogin(db, username, passcode) {
  const testQuery = "SELECT * FROM users WHERE username = ? AND passcode = ?;";
  const exists = await db.run(testQuery, [username, passcode]);
  return exists !== undefined;
}

/**
 * Function used to close a database connection.
 * @param {sqlite3.Database} db sqlite database to close.
 */
function closeDB(db) {
  if (db) {
    db.close();
  }
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "epic-store.db",
    driver: sqlite3.Database
  });

  return db;
}

app.use(express.static("public"));

const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
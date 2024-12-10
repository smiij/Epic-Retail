/**
 * Names: Names: Andy Prempeh, Javier Tomas
 * Date: December 2, 2024
 * Section: CSE 154 AF
 * This app.js handles all the necessary end points of the backend of our site.
 * It handles login request, sign up requests and requests for the sites products.
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

/**
 * Takes a form with the fields username, email, passcode. Will create a new account for
 * the user if an account under the same username does not exist.
 */
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
        const query = "INSERT INTO users (username, email, passcode, cart) VALUES (?, ?, ?, ?);";
        await db.run(query, [username, email, passcode, JSON.stringify("[]")]);
        response.send({
          message: "Successfully created an account.",
          username: username,
          cart: JSON.stringify("[]")
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

/**
 * Takes query parameters with username and passcode. On a successful match with an existing
 * account. Will sign in user.
 */
app.get("/login", async function(request, response) {
  let db;
  response.type("application/json");
  try {
    const username = request.query.username;
    const passcode = request.query.passcode;
    if (checkInput(username, passcode)) {
      db = await getDBConnection();
      if (await checkLogin(db, username, passcode)) {
        const query = "SELECT cart FROM users WHERE username = ?;";
        const cart = await db.get(query, username);
        response.send({
          message: "Successfully signed in.",
          username: username,
          cart: cart.cart
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

/**
 * Takes a form with fields username and cart. Saves the users cart for later login.
 */
app.post("/signout", async function(request, response) {
  let db;
  response.type("application/json");
  try {
    const username = request.body.username;
    const cart = request.body.cart;
    db = await getDBConnection();
    const query = "UPDATE users SET cart = ? WHERE username = ?;";
    await db.run(query, [JSON.stringify(cart), username]);
    response.send({message: "Successfully signed out."});
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server. Try again."});
  } finally {
    closeDB(db);
  }
});

/**
 * Take a form with fields username and cart. Will create an order history for user when
 * they decide to make a purchase.
 */
app.post("/buy", async function(request, response) {
  let db;
  response.type("application/json");
  try {
    const username = request.body.username;
    const cart = request.body.cart;
    db = await getDBConnection();
    const query = "INSERT INTO orders (id, username, cart) VALUES (?, ?, ?);";
    await db.run(query, [null, username, cart]);
    response.send({
      message: "Thank you for shopping",
      username: username,
      cart: JSON.stringify("[]")
    });
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server. Try again."});
  } finally {
    closeDB(db);
  }
});

/**
 * GET /mens/:category
 * Retrieves a list of products from the mens section based on the category.
 */
app.get("/mens/:category", async function(request, response) {
  const db = await getDBConnection();
  const category = request.params.category;
  let query;

  if (category === "all") {
    query = "SELECT * FROM new_items WHERE type = 'mens';";
  } else {
    query = "SELECT * FROM new_items WHERE type = 'mens' AND description = ?;";
  }
  try {
    const products = category === "all" ? await db.all(query) : await db.all(query, [category]);
    response.json(products);
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server."});
  }
});

/**
 * GET /womens/:category
 * Retrieves a list of products from the womens section based on the category.
 */
app.get("/womens/:category", async function(request, response) {
  const db = await getDBConnection();
  const category = request.params.category;
  let query;

  if (category === "all") {
    query = "SELECT * FROM new_items WHERE type = 'womens';";
  } else {
    query = "SELECT * FROM new_items WHERE type = 'womens' AND description = ?;";
  }
  try {
    const products = category === "all" ? await db.all(query) : await db.all(query, [category]);
    response.json(products);
  } catch (error) {
    response.status(SERVER_ERROR).send({message: "An error occured on the server."});
  }
});

/**
 * Helper function used to check if user input are null.
 * @param  {...any} args list of arguments to check for null or undefined.
 * @returns {boolean} returns false on any null or undefined value. True otherwise.
 */
function checkInput(...args) {
  for (const arg of args) {
    if (arg === null || arg === undefined) {
      return false;
    }
  }
  return true;
}

/**
 * Checks to see if a new account under the username can be created.
 * @param {sqlite3.Database} db sqlite database.
 * @param {string} username username to check.
 * @returns {boolean} true if username does not exist, false otherwise.
 */
async function checkCreate(db, username) {
  const testQuery = "SELECT * FROM users WHERE username = ?;";
  const exists = await db.get(testQuery, username);
  return exists === undefined;
}

/**
 * Checks to see if username and password match as one of the users in the database.
 * @param {sqlite3.Database} db sqlite database
 * @param {string} username username to check.
 * @param {string} passcode passcode to check.
 * @returns {boolean} returns true if username and passcode match, false otherwise.
 */
async function checkLogin(db, username, passcode) {
  const testQuery = "SELECT * FROM users WHERE username = ? AND passcode = ?;";
  const exists = await db.get(testQuery, [username, passcode]);
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
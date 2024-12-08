/*
 * Names: Andy Prempeh, Javier Tomas
 * Date: October 30, 2024
 * Section: CSE 154 AF
 * This is index.js file that will contain all button functionality page loads.
 */
"use strict";
(function() {

  // Globals
  const SHORT_WAIT = 2000;
  const LONG_WAIT = 3000;

  window.addEventListener("load", init);

  function init() {
    id("logo").addEventListener("click", visitMainPage);
    id("sign-up-btn").addEventListener("click", visitSignUp);
    id("login-btn").addEventListener("click", visitLogin);
    id("sign-up-form").addEventListener("submit", processSignupRequest);

    qsa(".filter-header").forEach((header) => {
      header.addEventListener("click", () => {
        toggleFilter(header);
      });
    });

    // id("all-categories-link").addEventListener("click", togglePage);
  }

  function visitMainPage() {
    window.location.href = "index.html";
  }

  // Mens Section
  function toggleFilter(header) {
    let filter = header.getAttribute("data-filter");
    let filterContent = id(filter);
    if (filterContent) {
      filterContent.classList.toggle("hidden");
    }
  }

  function togglePage() {
    let mensClothing = id("mens-clothing");
    let mainPage = id("recs");

    if (mainPage.classList.contains("hidden")) {
      // If the main page is already hidden, show it and hide men's clothing
      mainPage.classList.remove("hidden");
      mensClothing.classList.add("hidden");
    } else {
      // If the main page is visible, hide it and show men's clothing
      mainPage.classList.add("hidden");
      mensClothing.classList.remove("hidden");
    }
  }

  function visitSignUp() {
    window.location.href = "sign-up.html";
  }

  async function processSignupRequest(event) {
    try {
      event.preventDefault();
      const username = event.target.username.value;
      const email = event.target.email.value;
      const passcode = event.target.password.value;
      event.target.username.value = "";
      event.target.email.value = "";
      event.target.password.value = "";
      const form = new FormData();
      form.append("username", username);
      form.append("email", email);
      form.append("passcode", passcode);
      await fetch("/signup", {method: "POST", body: form})
        .then(statusCheck)
        .then(res => res.text())
        .then(showMessage);
    } catch (error) {
      handleError(error);
    }
  }

  function visitLogin() {
    window.location.href = "login.html";
  }

  /** Helper Functions */

  /**
   * Provides a message to the user when something goes wrong with a request.
   * Directs user back to the main page.
   */
  function handleError(error) {
    showMessage("Sorry an error has occured: " + error);
    setTimeout(() => {
      visitMainPage();
    }, LONG_WAIT);
  }

  /**
   * Helper function used to display helpful information to the user.
   * @param {String} message message to display.
   */
  function showMessage(message) {
    const messageDiv = id("message");
    messageDiv.textContent = message;
    messageDiv.classList.toggle("hidden");
    messageDiv.classList.toggle("show");
    id("sign-up-page").classList.add("hidden");
    setTimeout(() => {
      id("sign-up-page").classList.remove("hidden");
      messageDiv.classList.toggle("show");
      messageDiv.classList.toggle("hidden");
      messageDiv.textContent = "";
      visitMainPage();
    }, LONG_WAIT);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
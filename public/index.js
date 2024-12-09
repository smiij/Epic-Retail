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
    addOptionalListeners();

    if (window.location.pathname.includes("index.html")) {
      isSignedIn();
    }
    qsa(".filter-header").forEach((header) => {
      header.addEventListener("click", () => {
        toggleFilter(header);
      });
    });

    // id("all-mens").addEventListener("click", loadMens);

  }

  function addOptionalListeners() {
    if (id("signout-btn")) {
      id("signout-btn").addEventListener("click", signout);
    }
    if (id("sign-up-form")) {
      id("sign-up-form").addEventListener("submit", processSignupRequest);
    }
    if (id("login-form")) {
      id("login-form").addEventListener("submit", processLoginRequest);
    }
    if (id("all-mens")) {
      id("all-mens").addEventListener("click", loadMens);
    }
    if (id("all-women")) {
      // id("all-womens").addEventListener("click", loadWomens);
    }
  }

  // Mens Section
  function toggleFilter(header) {
    let filter = header.getAttribute("data-filter");
    let filterContent = id(filter);
    if (filterContent) {
      filterContent.classList.toggle("hidden");
    }
  }

  async function loadMens() {
    let feed = id("feed");
    try {
      const response = await fetch("/mens/all");
      statusCheck(response);
      const data = response.json();
      data.forEach((product) => {
        feed.appendChild(createFeed(product));
      });
    } catch (err) {
      handleError(err);
    }

    let mens = id("mens-clothing");
    let main = id("recs");
    main.classList.add("hidden");
    mens.classList.remove("hidden");
  }

  function createFeed(product) {

    let itemSection = gen("section");
    itemSection.classList.add("product");
    let itemImg = gen("img");
    let space = gen("hr");
    let itemName = gen("p");
    let itemPrice = gen("p");
    let size = gen("p");
    itemName.textContent = product.name;
    itemPrice.textContent = "$" + product.price;
    itemImg.src = product.img;
    size.textContent = product.size;

    itemSection.appendChild(itemImg, space, itemName, itemPrice, size);

    return itemSection;
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
        .then(res => res.json())
        .then(showMessage);
    } catch (error) {
      handleError(error);
    }
  }

  async function processLoginRequest(event) {
    try {
      event.preventDefault();
      const username = event.target.username.value;
      const passcode = event.target.password.value;
      event.target.username.value = "";
      event.target.password.value = "";
      const form = new FormData();
      form.append("username", username);
      form.append("passcode", passcode);
      await fetch(`/login?username=${username}&passcode=${passcode}`)
        .then(statusCheck)
        .then(res => res.json())
        .then(showMessage);
    } catch (error) {
      handleError(error);
    }
  }

  function isSignedIn() {
    if (window.localStorage.getItem("signedIn")) {
      id("username").textContent = window.localStorage.getItem("username");
      toggleSignedIn();
    }
  }

  function signout() {
    id("username").textContent = "";
    toggleSignedIn();
    window.localStorage.removeItem("signedIn");
    window.localStorage.removeItem("username");
  }

  // togglePages

  function toggleSignedIn() {
    id("header-btns").classList.toggle("hidden");
    id("user-info").classList.toggle("hidden");
  }

  // visitor pages

  function visitMainPage() {
    window.location.href = "index.html";
  }

  function visitSignUp() {
    window.location.href = "sign-up.html";
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
    showMessage(error);
    setTimeout(() => {
      visitMainPage();
    }, LONG_WAIT);
  }

  /**
   * Helper function used to display helpful information to the user.
   * @param {String} response message to display.
   */
  function showMessage(response) {
    const messageDiv = id("message");
    messageDiv.textContent = response.message;
    messageDiv.classList.toggle("hidden");
    messageDiv.classList.toggle("show");
    togglePage();
    setTimeout(() => {
      togglePage();
      messageDiv.classList.toggle("show");
      messageDiv.classList.toggle("hidden");
      messageDiv.textContent = "";
      if (response.username) {
        window.localStorage.setItem("signedIn", true);
        window.localStorage.setItem("username", response.username);
      }
      visitMainPage();
    }, LONG_WAIT);
  }

  function togglePage() {
    if (id("sign-up-page")) {
      id("sign-up-page").classList.toggle("hidden");
    }
    if (id("login-page")) {
      id("login-page").classList.toggle("hidden");
    }
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
/*
  Names: Andy Prempeh and Javier Tomas
  Date: October 30, 2024
  Section: AF
  This is index.js file that will contain all button functionality page loads.
*/

"use strict";
(function() {

  window.addEventListener("load", init);

  function init() {
    id("logo").addEventListener("click", mainPage);
    id("sign-up-btn").addEventListener("click", visitSignUp);
    id("login-btn").addEventListener("click", visitLogin);

    qsa(".filter-header").forEach((header) => {
      header.addEventListener("click", () => {
        toggleFilter(header);
      });
    });

    id("all-categories-link").addEventListener("click", togglePage);

  }

  function mainPage() {
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



  function hideAll() {
    const main = [...qs("main").children];
    main.forEach(tag => tag.classList.add("hidden"));
  }

  function visitSignUp() {
    hideAll();
    id("sign-up-page").classList.remove("hidden");
  }

  function visitLogin() {
    hideAll();
    id("login-page").classList.remove("hidden");
  }




  /** Helper Functions */

  /**
   * Provides a message to the user when something goes wrong with a request.
   * Directs user back to the main page.
   */
  function handleError() {
    const errorPage = id("error-page");
    errorPage.classList.remove("hidden");
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
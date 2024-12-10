/*
 * Names: Andy Prempeh, Javier Tomas
 * Date: October 30, 2024
 * Section: CSE 154 AF
 * This is index.js file that will contain functionality for our site.
 * This file adds all allows us to dynamically load products from the database and display them.
 * It also allows users to sign up, login, and buy products.
 */
"use strict";
(function() {
  // Globals
  const LONG_WAIT = 3000;
  const TAX_RATE = 0.11;

  window.addEventListener("load", init);

  /**
   * Sets up all the initial event listeners for each page. Also displays the user's information
   * if the user has recently signed in.
   */
  function init() {
    id("logo").addEventListener("click", visitMainPage);
    id("sign-up-btn").addEventListener("click", visitSignUp);
    id("login-btn").addEventListener("click", visitLogin);
    addOptionalListeners();
    isSignedIn();
    dropdownEvents();
    populateMensRecs();
    populateWomensRecs();

    qsa(".filter-header").forEach((header) => {
      header.addEventListener("click", () => {
        toggleFilter(header);
      });
    });
  }

  /**
   * Sets up the optional event listeners depending on what page the user is currently on.
   */
  function addOptionalListeners() {
    if (id("signout-btn")) {
      id("signout-btn").addEventListener("click", processSignout);
    }
    if (id("sign-up-form")) {
      id("sign-up-form").addEventListener("submit", processSignupRequest);
    }
    if (id("login-form")) {
      id("login-form").addEventListener("submit", processLoginRequest);
    }
    [...qsa(".cart")].forEach(tag => {
      tag.addEventListener("click", visitCart);
    });
    if (qs(".cart-items") && window.localStorage.getItem("signedIn")) {
      populateCartPage();
    }
    if (qs(".summary") && window.localStorage.getItem("signedIn")) {
      getCheckoutCost();
    }
    if (qs(".checkout-btn") && window.localStorage.getItem("signedIn")) {
      qs(".checkout-btn").addEventListener("click", processBuy);
    }
  }

  /**
   * Populates the mens recommendations section with random products from the database.
   * @returns {Promise<void>} A promise that resolves when the products are loaded.
   * @throws {Error} An error if the response is not successful.
   */
  async function populateMensRecs() {
    let mensRecs = id("mens-recs");
    try {
      const mensResponse = await fetch("/mens/all");
      statusCheck(mensResponse);
      const mensData = await mensResponse.json();
      const mensGrouped = groupByDescription(mensData);
      Object.values(mensGrouped).forEach((products) => {
        const randProd = getRandomItem(products);
        mensRecs.appendChild(createFeed(randProd));
      });

    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Populates the womens recommendations section with random products from the database.
   * @returns {Promise<void>} A promise that resolves when the products are loaded.
   * @throws {Error} An error if the response is not successful.
   */
  async function populateWomensRecs() {
    let womensRecs = id("womens-recs");
    try {
      const womensResponse = await fetch("/womens/all");
      statusCheck(womensResponse);
      const womensData = await womensResponse.json();
      const womensGrouped = groupByDescription(womensData);
      Object.values(womensGrouped).forEach((products) => {
        const randProd = getRandomItem(products);
        womensRecs.appendChild(createFeed(randProd));
      });
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Groups products by their description.
   * @param {Array} products - The array of products to group.
   * @returns {Object} - An object where each key is a unique description and each value is an array
   */
  function groupByDescription(products) {
    return products.reduce((acc, product) => {
      const description = product.description;
      if (!acc[description]) {
        acc[description] = [];
      }
      acc[description].push(product);
      return acc;
    }, {});
  }

  /**
   * Returns a random item from an array.
   * @param {Array} data - The array to pick a random item from.
   * @returns {object} - A random item from the array.
   */
  function getRandomItem(data) {
    const randInd = Math.floor(Math.random() * data.length);
    return data[randInd];
  }

  /**
   * Adds event listeners to dropdown menu items for men's and women's sections,
   * triggering data load based on the selected category.
   */
  function dropdownEvents() {
    let menBtn = qsa(".dropdown-content a");
    menBtn.forEach((btn) => {
      let category = btn.classList[0];
      btn.addEventListener("click", () => loadMens(category));
    });

    let womenBtn = qsa(".dropdown-content-w a");
    womenBtn.forEach((btn) => {
      let category = btn.classList[0];
      btn.addEventListener("click", () => loadWomens(category));
    });
  }

  /**
   * Toggles the visibility of the filter content section associated with the
   * clicked header element by using the `data-filter` attribute to find the
   * corresponding content to show or hide.
   * @param {HTMLElement} header - The header element that was clicked to trigger the filter toggle.
   */
  function toggleFilter(header) {
    let filter = header.getAttribute("data-filter");
    let filterContent = id(filter);
    if (filterContent) {
      filterContent.classList.toggle("hidden");
    }
  }

  /**
   * Loads and displays men's products based on the selected category.
   * @param {string} category - The category of products to load (e.g., "all", "tops", "bottoms").
   * @returns {Promise<void>} A promise that resolves when the products are loaded.
   */
  async function loadMens(category) {
    let feed = id("mensfeed");
    feed.innerHTML = " ";
    let call = `/mens/${category}`;
    try {
      const response = await fetch(call);
      statusCheck(response);
      let data = await response.json();
      data.forEach((product) => {
        feed.appendChild(createFeed(product));
      });
    } catch (err) {
      handleError(err);
    }

    let mens = id("mens-clothing");
    let main = id("recs");
    let womens = id("womens-clothing");
    if (!womens.classList.contains("hidden")) {
      womens.classList.add("hidden");
    }
    main.classList.add("hidden");
    mens.classList.remove("hidden");
  }

  /**
   * Loads and displays women's products based on the selected category.
   * @param {string} category - The category of products to load (e.g., "all", "tops", "bottoms").
   * @returns {Promise<void>} A promise that resolves when the products are loaded.
   */
  async function loadWomens(category) {
    let feed = id("womensfeed");
    feed.innerHTML = " ";
    let call = `/womens/${category}`;
    try {
      const response = await fetch(call);
      statusCheck(response);
      let data = await response.json();
      data.forEach((product) => {
        feed.appendChild(createFeed(product));
      });
    } catch (err) {
      handleError(err);
    }

    let womens = id("womens-clothing");
    let main = id("recs");
    let mens = id("mens-clothing");
    if (!mens.classList.contains("hidden")) {
      mens.classList.add("hidden");
    }
    [...qsa(".add-to-cart")].forEach(button => {
      button.addEventListener("click", addToCart);
    });
    main.classList.add("hidden");
    womens.classList.remove("hidden");
  }

  /**
   * Creates a DOM section representing a product, including its image, name, price, and size.
   * @param {Object} product - The product object.
   * @returns {Object} The DOM section representing the product.
   */
  function createFeed(product) {
    let itemSection = gen("section");
    itemSection.classList.add("product");
    itemSection.addEventListener("click", () => detailedView(product));
    let itemLink = gen("a");

    let itemImg = gen("img");
    let space = gen("hr");
    let itemName = gen("p");
    let itemPriceSec = gen("section");
    itemPriceSec.classList.add("price");
    let itemPrice = gen("p");
    itemPriceSec.appendChild(itemPrice);
    let sizeSection = gen("section");
    let size = gen("p");
    sizeSection.appendChild(size);
    itemName.textContent = product.name;
    itemPrice.textContent = "$" + product.price;
    itemImg.src = product.image_url;
    itemImg.alt = product.name + " " + product.type;
    size.textContent = "Size: " + product.size;
    [itemImg, space, itemName].forEach((element) => {
      itemLink.appendChild(element);
    });
    [itemLink, itemPriceSec, sizeSection].forEach((element) => {
      itemSection.appendChild(element);
    });
    return itemSection;
  }

  /**
   * Displays detailed information about a selected product in a detailed view page.
   * This function creates the layout of the detailed view and hides other sections.
   * @param {Object} product - The product object containing detailed information to be displayed.
   */
  function detailedView(product) {
    let main = id("recs");
    let view = id("detailView");

    let mainSection = gen("section");
    let mainLeft = gen("section");

    let img = gen("img");
    let mainContentRight = gen("section");
    let buy = setupBuyBtn();
    let name = gen("h2");
    let price = gen("h3");
    let size = gen("p");
    size.textContent = "Size: " + product.size;
    price.textContent = "$" + product.price;
    name.textContent = product.name;
    img.src = product.image_url;
    img.alt = product.name + " " + product.type;

    mainLeft.appendChild(img);
    [name, price, buy, size].forEach((element) => {
      mainContentRight.appendChild(element);
    });
    addClass(mainLeft, mainContentRight);
    mainSection.appendChild(mainLeft);
    mainSection.appendChild(mainContentRight);
    view.appendChild(mainSection);
    hide();
    main.classList.add("hidden");
    view.classList.remove("hidden");
  }

  /**
   * Helper function used to set up the buy button for items.
   * @returns {object} newly created HTML button.
   */
  function setupBuyBtn() {
    const buy = gen("button");
    buy.textContent = "Add to Cart";
    buy.classList.add("add-to-cart");
    buy.addEventListener("click", addToCart);
    return buy;
  }

  /**
   * Adds classes to the two elements passed in to display them in a detailed view.
   * @param {Object} elementOne - The first element to add a class to.
   * @param {Object} elementTwo - The second element to add a class to.
   */
  function addClass(elementOne, elementTwo) {
    elementOne.classList.add("mainRight");
    elementTwo.classList.add("mainLeft");
  }

  /**
   * Hides certain sections of the page to display the detailed view of a product.
   */
  function hide() {
    let mens = id("mens-clothing");
    let womens = id("womens-clothing");

    if (!mens.classList.contains("hidden")) {
      mens.classList.add("hidden");
    }
    if (!womens.classList.contains("hidden")) {
      womens.classList.add("hidden");
    }
  }

  /**
   * Helper function used to check if an item is currently in the user's cart.
   * @param {String} productName name of product.
   * @returns {boolean} returns whether item is in user's cart.
   */
  function itemIsInCart(productName) {
    const cart = getCart();
    for (const item of cart) {
      if (item["productName"] === productName) {
        return true;
      }
    }
    return false;
  }

  /**
   * Helper function used to add an additional quantity of item if product is already
   * in the user's cart.
   * @param {String} productName name of produce.
   */
  function addAdditional(productName) {
    const cart = getCart();
    for (const item of cart) {
      if (item["productName"] === productName) {
        item["quantity"] += 1;
      }
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
    getCheckoutCost();
  }

  /**
   * Callback function used to increment item quantity.
   */
  function incrementQuantity() {
    const cart = getCart();
    const quantity = this.parentNode.children[1];
    for (const item of cart) {
      if (item["productName"] === this.getAttribute("productid")) {
        item["quantity"] += 1;
        quantity.textContent = item["quantity"];
      }
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
    getCheckoutCost();
  }

  /**
   * Callback function used to decrement item quantity.
   */
  function decrementQuantity() {
    const cart = getCart();
    const quantity = this.parentNode.children[1];
    for (const item of cart) {
      if (item["productName"] === this.getAttribute("productid")) {
        if (item["quantity"] > 1) {
          item["quantity"] -= 1;
          quantity.textContent = item["quantity"];
        }
      }
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
    getCheckoutCost();
  }

  /**
   * Callback function used to remove item from the user's shopping cart.
   */
  function removeFromCart() {
    const cart = getCart();
    this.parentNode.remove();
    for (let i = 0; i < cart.length; i++) {
      if (cart[i]["productName"] === this.getAttribute("productid")) {
        cart.splice(i, 1);
      }
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
    getCheckoutCost();
  }

  /**
   * Calculated the checkout cost based on user's cart items.
   * Changes the displays for price tags.
   */
  function getCheckoutCost() {
    const cart = getCart();
    let subTotal = 0;
    let taxes = 0;
    for (const item of cart) {
      let price = Number(item.price.split("$")[1]);
      let quantity = item.quantity;
      subTotal += price * quantity;
    }
    taxes = subTotal * TAX_RATE;
    id("subtotal-price").textContent = "Items: $" + subTotal;
    id("tax").textContent = "Tax: $" + taxes;
    id("total-cost").textContent = "Total: $" + (subTotal + taxes);
  }

  /**
   * Callback function used to add an item to the user's cart. This is called
   * when the user clicks on the "add to cart" button.
   */
  function addToCart() {
    if (window.localStorage.getItem("signedIn")) {
      const imageNode = this.parentNode.previousSibling.children[0];
      const childNodes = [...this.parentNode.children];
      const cart = getCart();
      if (itemIsInCart(childNodes[0].textContent)) {
        addAdditional(childNodes[0].textContent);
      } else {
        const productDetails = {};
        productDetails["src"] = imageNode.src;
        productDetails["alt"] = imageNode.alt;
        productDetails["productName"] = childNodes[0].innerHTML;
        productDetails["price"] = childNodes[1].innerHTML;
        productDetails["quantity"] = 1;
        cart.push(productDetails);
        window.localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  }

  /**
   * Populates the cart.html with all the items the user has in their cart.
   */
  function populateCartPage() {
    const cart = getCart();
    const cartView = qs(".cart-items");
    cart.forEach(item => {
      const parentDiv = gen("div");
      parentDiv.classList.add("cart-item");
      const image = gen("img");
      image.src = item["src"];
      image.alt = item["alt"];
      const detail = createDetail(item["productName"], item["price"]);
      const quantity = createQuantity(item["productName"], item["quantity"]);
      const removeBtn = gen("span");
      removeBtn.classList.add("remove");
      removeBtn.setAttribute("productid", item["productName"]);
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", removeFromCart);
      parentDiv.appendChild(image);
      parentDiv.appendChild(detail);
      parentDiv.appendChild(quantity);
      parentDiv.appendChild(removeBtn);
      cartView.appendChild(parentDiv);
    });
  }

  /**
   * Helper function used to create a details tag for an item.
   * @param {String} itemName item name.
   * @param {String} price price of the item.
   * @returns {Object} the newly created div HTML tag containing the passed in information.
   */
  function createDetail(itemName, price) {
    const details = gen("div");
    details.classList.add("details");
    const productName = gen("h4");
    productName.textContent = itemName;
    const productPrice = gen("p");
    productPrice.classList.add("price");
    productPrice.textContent = price;
    details.appendChild(productName);
    details.appendChild(productPrice);
    return details;
  }

  /**
   * Helper function used to create a quantity tag for an item.
   * @param {String} productName name of the product.
   * @param {String} currentQuantity quantity of items in cart.
   * @returns {Object} newly created div HTML tag containing information on quantity.
   */
  function createQuantity(productName, currentQuantity) {
    const quantity = gen("div");
    quantity.classList.add("quantity");
    const minus = gen("button");
    minus.textContent = "-";
    const number = gen("span");
    number.textContent = currentQuantity;
    const plus = gen("button");
    plus.textContent = "+";
    minus.setAttribute("productid", productName);
    plus.setAttribute("productid", productName);
    minus.addEventListener("click", decrementQuantity);
    plus.addEventListener("click", incrementQuantity);
    quantity.appendChild(minus);
    quantity.appendChild(number);
    quantity.appendChild(plus);
    return quantity;
  }

  /**
   * Makes a POST request to the API for user to create an account.
   * @param {Event} event submit event.
   */
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

  /**
   * Makes a GET request to the API to log into an existing account.
   * @param {event} event submit event.
   */
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

  /**
   * Make a POST request to the API to sign out. Saves user's cart information.
   */
  async function processSignout() {
    try {
      id("username").textContent = "";
      id("header-btns").classList.remove("hidden");
      id("user-info").classList.add("hidden");
      const form = new FormData();
      form.append("username", window.localStorage.getItem("username"));
      form.append("cart", window.localStorage.getItem("cart"));
      window.localStorage.removeItem("signedIn");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("cart");
      await fetch("/signout", {method: "POST", body: form})
        .then(statusCheck)
        .then(res => res.json())
        .then(showMessage);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Makes a POST request to the API to buy items.
   */
  async function processBuy() {
    try {
      const username = window.localStorage.getItem("username");
      const cart = window.localStorage.getItem("cart");
      const form = new FormData();
      form.append("username", username);
      form.append("cart", cart);
      await fetch("/buy", {method: "POST", body: form})
        .then(statusCheck)
        .then(res => res.json())
        .then(showMessage);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Checks to see if user is currently signed in. If so, displays user's name.
   */
  function isSignedIn() {
    if (window.localStorage.getItem("signedIn")) {
      id("username").textContent = window.localStorage.getItem("username");
      id("header-btns").classList.add("hidden");
      id("user-info").classList.remove("hidden");
    }
  }

  /**
   * changes view to the Main page.
   */
  function visitMainPage() {
    window.location.href = "index.html";
  }

  /**
   * changes view to the Sign up page.
   */
  function visitSignUp() {
    window.location.href = "sign-up.html";
  }

  /**
   * changes view to the login page.
   */
  function visitLogin() {
    window.location.href = "login.html";
  }

  /**
   * changes view to the cart page.
   */
  function visitCart() {
    window.location.href = "cart.html";
  }

  /**
   * Helper function used to properly parse the user's cart to an object.
   * @returns {array} array of items.
   */
  function getCart() {
    let cart = JSON.parse(window.localStorage.getItem("cart"));
    if (typeof cart === "string") {
      cart = JSON.parse(cart);
    }
    return cart;
  }

  /**
   * Provides a message to the user when something goes wrong with a request.
   * Directs user back to the main page.
   * @param {Error} error error message.
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
        window.localStorage.setItem("cart", response.cart);
      }
      visitMainPage();
    }, LONG_WAIT);
  }

  /**
   * Toggles the signup page and login page.
   */
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
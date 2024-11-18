# EPIC Retail API Documentation
This API allows us to access and interact with a marketplace for curated items. Allows the web application the ability to brose, buy sell and manage items.

## *Endpoint: http://localhost:8000/signin*

**Request Format:** signin?username={username}&password={password}

**Request Type:**: GET

**Returned Data Format**: JSON

**Description:** This endpoint is used for when a user tries to login into their account. The user will provide their username and password onto a front end Form which will then be directed to this endpoint. If the user's credentials match, they will be logged into their account.

**Example Request:** *http://localhost:8000/signin?username=janedoe&password=simplepw*

**Example Response:**
```
{
  success: true,
  username: janedoe,
  message: Successfully logged in.
}
```

**Error Handling:**
If a user fails to loggin successfully, a helpful message will display saying "username and password do not match. Please try again."


## *Endpoint: http://localhost:8000/register*
**Request Format:** register?username={username}&password={password}&email={email}&phone={phone}

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** This endpoint is used when a user tries to make a new account on the site. The user will provide a username, password, email, and phone number onto a front end Form to register for an account. The backend server will then check to see that an account with the same email and/or phone number does not already exist. If successful the user will be logged into the site under the new username.

**Example Request:** http://localhost:8000/register?username=janedoe&password=simplepw&email=jan@aol.com&phone=2069731832

**Example Response:**

```
{
  success: true,
  username: janedoe,
  message: Successfully created an account.
}
```

**Error Handling:**
If a user tries to create an account under the same email and phone number, a helpful message will display saying "An account under the same email/phone number already exists, please login."

## *Endpoint: http://localhost:8000/items*
**Request Format:** items?section=""&category=""&filters=""

**Request Type:** GET 

**Returned Data Format**: JSON

**Description:** This endpoint retrieves a list of all clothing items from whichever section is chosen of either men, women or kids and populates the webpage with them. It also returns items based on the filters chosen by the user that meet thos requirements.

**Example Request:** http://localhost:8000/items?section=men&category=outerwear&price_min=50&sort=price_asc

**Example Response:**
```
{
  "items": [
    {
      "id": "98765",
      "title": "Levi's Denim Jacket",
      "description": "Classic denim jacket in great condition.",
      "price": 120,
      "condition": "Used",
      "size": "L",
      "seller": {
        "id": "67890",
        "username": "fashionking",
        "rating": 4.8
      },
      "images": [
        "https://example.com/images/98765.jpg"
      ]
    }
    {
      "id": "54321",
      "title": "Nike Windbreaker",
      "description": "Lightweight, weather-resistant jacket.",
      "price": 80,
      "condition": "New",
      "size": "M",
      "seller": {
        "id": "34567",
        "username": "outerwearpro",
        "rating": 4.5
      },
      "images": [
        "https://example.com/images/54321.jpg"
      ]
    },
  ]
}

```
**Error Handling:**
Returns an error message if a parameter is invalid or if there are no items that match
the given parameters.
Ex. "error": "Invalid pricing filter. Valid pricing range is between $1 and $1000 ."

## *Endpoint: http://localhost:8000/sell*
**Request Format:** 
{
  "title": "Please Enter a Title",
  "description": "Please add a description",
  "price": Please add a Price,
  "category": "Please add a category",
  "size": "Please add a size",
  "section": "Who is this for",
  "brand": "What brand is this?",
  "images": [
    "Please add images"
  ],
}


**Request Type:** POST

**Returned Data Format**: JSON

**Description:** This endpoint allows authenticated users to list their own items for sale
by providing necessary details like a title, description, price, size and image. It validates
the required fields then returns the created items details.

**Example Request:** 
{
  "title": "Supreme Box Logo Hoodie",
  "description": "Brand new, never worn. Includes tags.",
  "price": 400,
  "category": "Outerwear",
  "size": "L",
  "section": "Men",
  "brand": "Supreme",
  "images": [
    "https://example.com/images/12345.jpg",
    "https://example.com/images/12345_2.jpg"
  ]
}

**Example Response:**
```
{
  "message": "Item successfully listed for sale.",
  "item": {
    "id": "12345",
    "title": "Supreme Box Logo Hoodie",
    "price": 400,
    "condition": "New",
    "size": "L",
    "category": "Outerwear",
    "gender": "Men",
    "images": [
      "https://example.com/images/12345.jpg",
      "https://example.com/images/12345_2.jpg"
    ],
    "seller": {
      "id": "67890",
      "username": "fashionking"
    }
  }
}

```

**Error Handling:**
If the user does not enter in required information an error is returned that tells them to fill in all required fields.

## *Endpoint: http://localhost:8000/buy*
**Request Format:** 
{
  "item_id": "12345",
  "quantity": 1,
  "shipping_address": {
    "name": "John Doe",
    "street": "  St",
    "city": " ",
    "state": "",
    "zip": "",
    "country": ""
  },
  "payment_method": {
    "type": "credit_card",
    "token": ""
  }
}

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** The buying endpoint allows users to buy items from the webpage. This endpoint handles the creation of orders and initiates the payment process.

**Example Request:** 
{
  "item_id": "12345",
  "quantity": ,
  "shipping_address": {
    "name": " ",
    "street": " ",
    "city": " ",
    "state": "",
    "zip": "",
    "country": ""
  },
  "payment_method": {
    "type": "",
    "token": ""
  }
}

**Example Response:**
```
{
  "order_id": "ord_98765",
  "status": "processing",
  "total_amount": 150.00,
  "currency": "USD",
  "estimated_delivery": "2024-11-24",
  "tracking_number": null
}
```

**Error Handling:**
400 Bad Request: For invalid input data or parameter combinations
401 Unauthorized: For authentication failures
403 Forbidden: For authorization issues
404 Not Found: When the requested item is not available
409 Conflict: For inventory conflicts (e.g., item out of stock)
422 Unprocessable Entity: For payment processing failures
429 Too Many Requests: For rate limiting issues
500 Internal Server Error: For unexpected server-side errors

## *Endpoint: http://localhost:8000/search*
**Request Format:** search?{query}

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This endpoint is used whenever the user types in a query into the search bar. The user will be presented with a list of items that match item details with the words in their query.

**Example Request:** http://localhost:8000/search?mens%20red%20jacket

**Example Response:**
```
  {
    "items": [
    {
      "id": "98765",
      "title": "Levi's Denim Jacket",
      "description": "Classic denim jacket in great condition.",
      "details": ["jacket", "denim", "levi's", "used"],
      "price": 120,
      "condition": "Used",
      "size": "L",
      "seller": {
        "id": "67890",
        "username": "fashionking",
        "rating": 4.8
      },
      "images": [
        "https://example.com/images/98765.jpg"
      ]
    },
    {
      "id": "54321",
      "title": "Nike Windbreaker",
      "description": "Lightweight, weather-resistant jacket.",
      "details": ["jacket", "weather-resistant", "new", "nike"],
      "price": 80,
      "condition": "New",
      "size": "M",
      "seller": {
        "id": "34567",
        "username": "outerwearpro",
        "rating": 4.5
      },
      "images": [
        "https://example.com/images/54321.jpg"
      ]
    }
    ...
    {
      "id": "83922",
      "title": "Vans Classic",
      "description": "Red Vans classic shoes",
      "details": ["vans", "shoes", "red"]
      "price": 80,
      "condition": "New",
      "size": "S",
      "seller": {
        "id": "34567",
        "username": "outerwearpro",
        "rating": 4.5
      },
      "images": [
        "https://example.com/images/83922.jpg"
      ]
    }
    ]
  }
```

**Error Handling:**
Desplays an error message saying "Sorry, no items found under 'mens red jacket' when unable to find items by the user's query."

## *Endpoint: http://localhost:8000/cart*
**Request Format:** cart?username={username}

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** When a user is signed in, they can view the items they have in their cart. This GET request will be made on behalf of the user when they click on the cart button.

**Example Request:** http://localhost:8000/cart?username=janedoe

**Example Response:**
```
  {
    "cart": [
    {
      "id": "98765",
      "title": "Levi's Denim Jacket",
      "description": "Classic denim jacket in great condition.",
      "price": 120,
      "condition": "Used",
      "size": "L",
      "seller": {
        "id": "67890",
        "username": "fashionking",
        "rating": 4.8
      },
      "images": [
        "https://example.com/images/98765.jpg"
      ]
    },
    {
      "id": "54321",
      "title": "Nike Windbreaker",
      "description": "Lightweight, weather-resistant jacket.",
      "price": 80,
      "condition": "New",
      "size": "M",
      "seller": {
        "id": "34567",
        "username": "outerwearpro",
        "rating": 4.5
      },
      "images": [
        "https://example.com/images/54321.jpg"
      ]
    }]
  }
```

**Error Handling:**
If the server has trouble loading the user's cart, it will display the message "Sorry unable to load cart, please try at a later time."
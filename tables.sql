CREATE TABLE users (
  id INTEGER,
  username VARCHAR(64),
  email VARCHAR(64),
  passcode VARCHAR(64),
  cart TEXT,
  PRIMARY KEY ("id" AUTOINCREMENT)
);

CREATE TABLE items (
  id INT PRIMARY KEY, 
  name VARCHAR(64),
  description TEXT,
  price DECIMAL(8, 2),
  image_url TEXT,
  type TEXT,
  size TEXT,
  count INT
  color TEXT
);

CREATE TABLE orders (
  id INTEGER,
  username VARCHAR(64),
  cart TEXT,
  PRIMARY KEY ("id" AUTOINCREMENT),
  FOREIGN KEY (username) REFERENCES users (username)
);
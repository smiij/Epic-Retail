CREATE TABLE credentials (
  username VARCHAR(64),
  email VARCHAR(64),
  passcode VARCHAR(64)
);

CREATE TABLE users (
  username VARCHAR(64),
  passcode VARCHAR(64)
);

CREATE TABLE items (
  id INT PRIMARY KEY,
  name VARCHAR(64),
  description TEXT,
  price DECIMAL(10, 2),
  image_url TEXT
  type TEXT
  size TEXT
);
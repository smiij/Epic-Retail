CREATE TABLE users (
  username VARCHAR(64) PRIMARY KEY,
  email VARCHAR(64),
  passcode VARCHAR(64),
  cart TEXT
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
);
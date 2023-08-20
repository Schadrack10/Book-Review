const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.headers.authorization; // Assuming the token is sent in the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing." });
  }
  console.log(
    token == req.headers.authorization ? "its the same" : "its not the same"
  );

  try {
    const decodedToken = jwt.verify(token, "token-key"); // Replace 'your-secret-key' with your actual secret key
    req.user = decodedToken; // Store the decoded user information in the request object
    next(); // Move to the next middleware
  } catch (error) {
    console.log(error.message)
    return res.status(403).json({ message: error.message });
  }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));

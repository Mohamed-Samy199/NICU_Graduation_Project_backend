const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => { 
  try {
    // Check if the Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(token, "secret");

    // Attach the decoded token to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = isAuth;

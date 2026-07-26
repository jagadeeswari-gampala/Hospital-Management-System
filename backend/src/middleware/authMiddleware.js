const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Remove "Bearer " from token
        const tokenValue = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            tokenValue,
            process.env.JWT_SECRET
        );

        // Store user information
        req.user = decoded;

        // Move to next function
        next();

    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};


module.exports = authMiddleware;
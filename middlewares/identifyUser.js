const jwt = require("jsonwebtoken");

const identifyUser = async (req, res, next) => {
    try {
        let token;

        // Check token in headers or cookies
        if (req.headers?.client === "not-browser" && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1]; // Extract token after "Bearer "
        } else {
            token = req.cookies?.Authorization; // Get token from cookies
        }

        // If no token is found, return an error
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "You are not a verified user"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        
        
        // Attach user data to request and proceed
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            status: "error",
            message: "You are not authenticated. Invalid or expired token."
        });
    }
};



module.exports = identifyUser;






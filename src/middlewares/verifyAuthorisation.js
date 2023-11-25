const jwt = require('jsonwebtoken');

const verifyAuthorisation = (req, res, next) => {
    console.log("enter middleware", token);    
    const token = req.headers['token'];
    const authorisation = req.headers['authorization'];
    if (!token) {
        return res.status(403).send("Vous n'êtes pas autorisé à accéder à cette ressource");
    }

    try {
        const bearer = token.split(' '); // Supposer que le token est envoyé comme "Bearer <token>"
        const bearerToken = bearer[1];
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Token invalide');
    }

    return next();
};

module.exports = verifyAuthorisation;
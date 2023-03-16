const jwt = require('jsonwebtoken')
const SHA_256 = "7419bdb1d6689a4bcc1d6a2ef82eba13bee46961866bf304497c2a6e85fb08b9"

module.exports = function (req, res, next) {

    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verfied = jwt.verify(token, SHA_256);
        req.user = verfied;
        next();
    } catch {
        res.status(400).json({ message: "Invalid Token" })
    }
}
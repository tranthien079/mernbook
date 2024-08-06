require('dotenv').config();
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    const white_list = ["/", "/register", "/login"];
    
    if(white_list.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
        return;
    } 
    
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        // verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                name: decoded.name, 
                role: decoded.role,
                avatar: decoded.avatar
            };  // Add user info to request object
            next(); 
        } catch (error) {
            return res.status(401).json({ message: 'Token bị hết hạn hoặc không hợp lệ' });
        }
    } else {
        return res.status(401).json({ message: 'Bạn chưa có token hoặc token bị hết hạn' });
    }
}

module.exports = authMiddleware;

const delay = (req, res, next) => {
    setTimeout(() => {
        if(req.header.authorization) {
            const token = req.header.authorization.split(' ')[1];
        }
        next();
    }, 3000);
}

module.exports = delay;
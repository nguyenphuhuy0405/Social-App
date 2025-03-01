const jwt = require('jsonwebtoken');

function VerifyToken(req, res, next) {
    try {
        //If access token not exist return error message
        if (!req?.headers?.authorization?.startsWith('Bearer')) {
            return res.status(401).json({
                message: 'Required Access Token',
            });
        } else {
            //Get access token
            const accessToken = req.headers['authorization'].split(' ')[1];

            jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        message: 'Invalid Access Token',
                    });
                }
                console.log('decoded: ', decoded);
                req.user = decoded;
                next();
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'An error occured! ' + error,
        });
    }
}

function VerifyUserIsAdmin(req, res, next) {
    if (req.user.isAdmin === false) {
        return res.status(401).json({
            message: 'Required admin role',
        });
    }
    next();
}
module.exports = {
    VerifyToken,
    VerifyUserIsAdmin,
};

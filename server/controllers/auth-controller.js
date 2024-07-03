const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/GenerateToken');

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            console.log('register:', username, email, password);
            if (!username || !email || !password) {
                return res.status(500).json('All fields are required');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });

            //save user and respond
            const user = await newUser.save();
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            !user && res.status(404).json('user not found');

            const validPassword = await bcrypt.compare(password, user.password);
            !validPassword && res.status(500).json('wrong password');

            // //Create access token & refresh token
            // const accessToken = generateAccessToken(user._id, user.isAdmin);
            // const refreshToken = generateRefreshToken(user._id);

            // //Save refresh token in database
            // user.refreshToken = refreshToken;
            // await user.save();

            // //Save refresh token in cookies
            // res.cookie('refreshToken', refreshToken, {
            //     httpOnly: false,
            //     secure: false,
            //     maxAge: 30 * 24 * 60 * 60 * 100, // 30 days
            // });

            // console.log('accessToken:', accessToken);
            // console.log('refreshToken:', refreshToken);

            // return res.status(200).json({
            //     accessToken,
            //     user,
            // });

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
}

module.exports = new AuthController();

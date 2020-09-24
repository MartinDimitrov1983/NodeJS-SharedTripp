const models = require('../models');
const jwt = require('../utils/jwt');
const config = require('../config/config');

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('login', { pageTitle: 'Login Page' });
        },

        register: (req, res, next) => {
            res.render('register', { pageTitle: 'Register Page' });
        },

        logout: (req, res, next) => {
            res
                .clearCookie(config.cookie)
                .clearCookie("email")
                .redirect('/home');
        }
    },

    post: {
        login: (req, res, next) => {
            const { email, password } = req.body;

            models.User.findOne({ email })
                .then((userData) => Promise.all([userData, userData.matchPassword(password)]))
                .then(([userData, match]) => {
                    if (!match) {
                        res.render("login", { errorMassages: ["Password or username is invalid"] })
                        console.log("aaaa")
                        return;
                    }

                    const token = jwt.createToken({ id: userData._id });

                    res
                        .cookie(config.cookie, token)
                        .cookie("email", userData.email)
                        .redirect('/');

                })
                .catch(() => {

                    res.render("login", { errorMassages: ["Password or username is invalid"] });
                })

        },

        register: (req, res, next) => {
            const { email, password, repassword } = req.body;

            if (password !== repassword) {
                res.render("register", { errorMassages: ["Both passwords should match"]})
                return
            }

            models.User.create({ email, password })
                .then(() => {

                    res.redirect('/user/login');
                })
                .catch((err) => {
                    if (err.name === "ValidationError") {

                        const errorMassages = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        console.log(errorMassages)

                        res.render("register", { errorMassages })
                        return
                    }
                })
        }
    }
};
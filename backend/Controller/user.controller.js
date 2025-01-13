
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");






function signupHandler(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).send({ message: "All fields are required", error: true });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email format", error: true });
        }

        let namRegex = /^[a-z\s]+$/i;
        if (!namRegex.test(name)) {
            return res.status(400).send({ message: "Invalid name", error: true });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters long", error: true });
        }

        bcrypt.hash(password, 3, async function (err, hash) {
            if (err) {
                return res.status(500).send({ message: "Please try again later", error: true });
            }
            let datetime = Date.now();
            const data = new userModel({ email, password: hash, name, datetime });
            await data.save();
            return res.status(200).send({ message: "User Registered Successsfully", error: false });
        });
    } catch (err) {
        console.log(err.message, err)
        res.status(500).send({ message: "Something went wrong", error: true });
    }
}


async function loginHandler(req, res) {
    try {
        var { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required", error: true });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email format", error: true });
        }

        const Data = await userModel.findOne({ email });
        if (!Data) {
            return res.status(401).send({ message: "Invalid credentials", error: true })
        }
        else {
            bcrypt.compare(password, Data.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ email, userid: Data._id.toString() }, process.env.JWT_SECRET);
                    const option = {
                        httpOnly: true,
                        secure: false,
                    }
                    res.cookie('token', token, option)

                    return res.status(200).send({
                        message: "login successful",
                        role: Data.role,
                        error: false
                    });
                } else {
                    return res.status(200).send({ message: "Invalid credentials", error: true });
                }
            });
        }
    } catch (err) {
        res.status(500).send({ message: "server Error", error: true });
    }
}


async function signoutHandler(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: "", error: false });

    } catch (err) {
        res.status(500).send({ message: "server Error", error: true });
    }
}



async function validateToken(req, res) {
    try {
        let token = req.cookies.token
        if (!token) {
            return res.status(401).send({ message: "Access denied, no token provided", error: true });
        }

        jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                return res.status(401).send({ message: "Please login", error: true });
            } else {
                const logindata = await userModel.findOne({
                    email: decoded.email, _id: decoded.userid
                });

                if (logindata) {
                    const option = {
                        httpOnly: true,
                        secure: false,
                    }
                    res.cookie('token', token, option)
                    return res.status(200).send({ message: "Token verified successfully", data: logindata, error: false });
                }
                else {
                    return res.status(401).send({ message: "Invalid token", error: true });
                }
            }
        });

    } catch (err) {
        res.status(500).send({ message: "server Error", error: true });
    }
}


module.exports = { signupHandler, loginHandler, signoutHandler, validateToken }
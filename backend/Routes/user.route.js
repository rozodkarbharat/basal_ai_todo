const express = require('express');
const IsUserExist = require('../middleware/IsUserExist');
const { signupHandler, loginHandler, signoutHandler, validateToken } = require('../Controller/user.controller');


const userRoute = express.Router()



userRoute.post("/signup", IsUserExist, signupHandler);

userRoute.post("/login", loginHandler);

userRoute.get("/signout", signoutHandler)

userRoute.get("/validate-user",validateToken)


module.exports = userRoute
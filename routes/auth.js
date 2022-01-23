const express = require("express");

const authControllers = require("../controllers/auth-controllers");

const router = express.Router();

router.get("/signup", authControllers.getSignup);

router.get("/login", authControllers.getLogin);

router.post("/signup", authControllers.createAccount);

router.post("/login", authControllers.userLogIn);

router.post("/logout", authControllers.userLogOut);

module.exports = router;

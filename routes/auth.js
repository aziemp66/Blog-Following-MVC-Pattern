const express = require("express");
const { route } = require("express/lib/application");

const authControllers = require("../controllers/auth-controllers");

const router = express.Router();

router.get("/signup", authControllers.getSignup);

router.get("/login", authControllers.getLogin);

router.post("/signup", authControllers.createAccount);

router.post("/login", authControllers.userLogIn);

router.post("/logout", authControllers.userLogOut);

router.get("/401", authControllers.get401);

module.exports = router;

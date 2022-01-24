const User = require("../models/user");
const validationSession = require("../util/validation-session");
const validation = require("../util/validation");

function get401(req, res) {
    res.status(401).render("401");
}

function getSignup(req, res) {
    const sessionErrorData = validationSession.getSessionErrorData(req, {
        email: "",
        confirmEmail: "",
        password: "",
    });

    res.render("signup", {
        inputData: sessionErrorData,
    });
}

function getLogin(req, res) {
    const sessionErrorData = validationSession.getSessionErrorData(req, {
        email: "",
        confirmEmail: "",
        password: "",
    });

    res.render("login", {
        inputData: sessionErrorData,
    });
}

async function createAccount(req, res) {
    const userData = req.body;
    const enteredEmail = userData.email; // userData['email']
    const enteredConfirmEmail = userData["confirm-email"];
    const enteredPassword = userData.password;

    if (
        !validation.userIsValid(
            enteredEmail,
            enteredConfirmEmail,
            enteredPassword
        )
    ) {
        validationSession.flashErrorsToSession(
            req,
            {
                message: "Invalid input - please check your data.",
                email: enteredEmail,
                confirmEmail: enteredConfirmEmail,
                password: enteredPassword,
            },
            function () {
                res.redirect("/signup");
            }
        );
        return;
    }

    const newUser = new User(enteredEmail, enteredPassword);
    const existingUser = await newUser.userExist();

    if (existingUser) {
        validationSession.flashErrorsToSession(
            req,
            {
                message: "User exists already!",
                email: enteredEmail,
                confirmEmail: enteredConfirmEmail,
                password: enteredPassword,
            },
            function () {
                res.redirect("/signup");
            }
        );
        return;
    }

    await newUser.createUser();

    res.redirect("/login");
}

async function userLogIn(req, res) {
    const userData = req.body;
    const enteredEmail = userData.email;
    const enteredPassword = userData.password;

    const newUser = new User(enteredEmail, enteredPassword);
    const existingUser = await newUser.findUser();

    if (!existingUser) {
        validationSession.flashErrorsToSession(
            req,
            {
                message:
                    "Could not log you in - please check your credentials!",
                email: enteredEmail,
                password: enteredPassword,
            },
            function () {
                res.redirect("/login");
            }
        );
        return;
    }

    const success = await newUser.login(existingUser.password);

    if (!success) {
        validationSession.flashErrorsToSession(
            req,
            {
                message: "Could not log you in - Wrong Passwords",
                email: enteredEmail,
                password: enteredPassword,
            },
            function () {
                res.redirect("/login");
            }
        );
        return;
    }

    validationSession.userSession(req, existingUser, function () {
        res.redirect("/admin");
    });
}

function userLogOut(req, res) {
    validationSession.userLogOut(req);
    res.redirect("/");
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    createAccount: createAccount,
    userLogIn: userLogIn,
    userLogOut: userLogOut,
    get401: get401,
};

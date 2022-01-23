function getSessionErrorData(req, defaultValues) {
    let sessionInputData = req.session.inputData;

    if (!sessionInputData) {
        sessionInputData = {
            hasError: false,
            ...defaultValues,
        };
    }

    req.session.inputData = null;

    return sessionInputData;
}

function flashErrorsToSession(req, data, action) {
    req.session.inputData = {
        hasError: true,
        ...data,
    };

    req.session.save(action);
}

function userSession(req, userData, action) {
    req.session.user = { id: userData._id, email: userData.email };
    req.session.isAuthenticated = true;
    req.session.save(action);
}

function userLogOut(req) {
    req.session.user = null;
    req.session.isAuthenticated = false;
}

module.exports = {
    getSessionErrorData: getSessionErrorData,
    flashErrorsToSession: flashErrorsToSession,
    userSession: userSession,
    userLogOut: userLogOut,
};

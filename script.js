// =====================================================
// AL-ALEEM ADMIN LOGIN
// ONE ADMIN EMAIL / CODE PASSWORD SYSTEM
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const splashScreen =
        document.getElementById("splashScreen");

    const mainPage =
        document.getElementById("mainPage");

    const loginForm =
        document.getElementById("loginForm");

    const loginEmailInput =
        document.getElementById("loginEmail");

    const loginPasswordInput =
        document.getElementById("loginPassword");

    const sendCodeBtn =
        document.getElementById("sendCodeBtn");

    const passwordArea =
        document.getElementById("passwordArea");

    const loginDescription =
        document.getElementById("loginDescription");

    const resendCodeBox =
        document.getElementById("resendCodeBox");

    const resendCodeBtn =
        document.getElementById("resendCodeBtn");

    const forgotPasswordBtn =
        document.getElementById("forgotPasswordBtn");

    const forgotPasswordOverlay =
        document.getElementById("forgotPasswordOverlay");

    const closeForgotPasswordBtn =
        document.getElementById("closeForgotPasswordBtn");

    const forgotPasswordForm =
        document.getElementById("forgotPasswordForm");

    const forgotEmailInput =
        document.getElementById("forgotEmail");

    const forgotSendCodeBtn =
        document.getElementById("forgotSendCodeBtn");

    const forgotResendBox =
        document.getElementById("forgotResendBox");

    const forgotResendCodeBtn =
        document.getElementById("forgotResendCodeBtn");

    const messageBox =
        document.getElementById("messageBox");

    const messageText =
        document.getElementById("messageText");

    const messageIcon =
        document.getElementById("messageIcon");


    // =====================================================
    // STORAGE KEYS
    // =====================================================

    const USERS_KEY =
        "alAleemUsers";

    const CURRENT_USER_KEY =
        "alAleemCurrentUser";

    const LOGIN_STATUS_KEY =
        "alAleemLoggedIn";

    const ADMIN_ACCOUNT_KEY =
        "alAleemAdminAccount";


    // =====================================================
    // DASHBOARD PAGE
    // =====================================================

    const DASHBOARD_PAGE =
        "./aleem-dashboard/aleem.html";


    // =====================================================
    // RESEND SETTINGS
    // =====================================================

    const MAX_RESENDS = 3;

    const RESEND_WAIT_TIME = 60;

    let firstLoginResendCount = 0;

    let firstLoginResendTimer = null;

    let forgotPasswordSendCount = 0;

    let forgotPasswordTimer = null;

    let messageTimer = null;


    // =====================================================
    // SPLASH SCREEN
    // =====================================================

    if (mainPage) {

        mainPage.style.display =
            "none";

    }


    setTimeout(function () {

        if (splashScreen) {

            splashScreen.classList.add(
                "hide"
            );

        }


        if (mainPage) {

            mainPage.style.display =
                "flex";

        }

    }, 5000);


    // =====================================================
    // GET ADMIN ACCOUNT
    // =====================================================

    function getAdminAccount() {

        try {

            const savedAccount =
                localStorage.getItem(
                    ADMIN_ACCOUNT_KEY
                );


            if (!savedAccount) {

                return null;

            }


            const account =
                JSON.parse(
                    savedAccount
                );


            if (
                !account ||
                typeof account !== "object"
            ) {

                return null;

            }


            return account;

        } catch (error) {

            console.error(
                "Error reading admin account:",
                error
            );


            return null;

        }

    }


    // =====================================================
    // SAVE ADMIN ACCOUNT
    // =====================================================

    function saveAdminAccount(account) {

        try {

            localStorage.setItem(
                ADMIN_ACCOUNT_KEY,
                JSON.stringify(account)
            );


            syncAccountWithOldUserStorage(
                account
            );


            return true;

        } catch (error) {

            console.error(
                "Error saving admin account:",
                error
            );


            return false;

        }

    }


    // =====================================================
    // KEEP DASHBOARD USER STORAGE COMPATIBLE
    // =====================================================

    function syncAccountWithOldUserStorage(account) {

        try {

            const dashboardUser = {

                id:
                    account.id,

                name:
                    account.name ||
                    "Administrator",

                email:
                    account.email,

                phone:
                    account.phone ||
                    "",

                password:
                    account.password,

                role:
                    account.role ||
                    "Administrator",

                school:
                    account.school ||
                    "Al-Aleem Group of Schools",

                profilePicture:
                    account.profilePicture ||
                    "",

                createdAt:
                    account.createdAt ||
                    ""

            };


            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(
                    [dashboardUser]
                )
            );

        } catch (error) {

            console.error(
                "Error synchronizing account:",
                error
            );

        }

    }


    // =====================================================
    // SAVE CURRENT USER
    // =====================================================

    function saveCurrentUser(account) {

        try {

            const currentUser = {

                id:
                    account.id,

                name:
                    account.name ||
                    "Administrator",

                email:
                    account.email,

                phone:
                    account.phone ||
                    "",

                role:
                    account.role ||
                    "Administrator",

                school:
                    account.school ||
                    "Al-Aleem Group of Schools",

                profilePicture:
                    account.profilePicture ||
                    "",

                createdAt:
                    account.createdAt ||
                    ""

            };


            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(currentUser)
            );


            localStorage.setItem(
                LOGIN_STATUS_KEY,
                "true"
            );


            return true;

        } catch (error) {

            console.error(
                "Error saving current user:",
                error
            );


            return false;

        }

    }


    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    function showMessage(
        message,
        type = "success",
        duration = 3500
    ) {

        if (
            !messageBox ||
            !messageText ||
            !messageIcon
        ) {

            return;

        }


        if (messageTimer) {

            clearTimeout(
                messageTimer
            );

        }


        messageText.textContent =
            message;


        messageBox.classList.remove(
            "error"
        );


        if (type === "error") {

            messageBox.classList.add(
                "error"
            );


            messageIcon.textContent =
                "!";

        } else {

            messageIcon.textContent =
                "✓";

        }


        messageBox.classList.add(
            "show"
        );


        messageTimer =
            setTimeout(
                function () {

                    messageBox.classList.remove(
                        "show"
                    );

                },
                duration
            );

    }


    // =====================================================
    // GENERATE UNIQUE CODE
    // =====================================================

    function generateCode(previousCode = "") {

        let newCode = "";


        do {

            newCode =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ).toString();

        } while (
            newCode === previousCode
        );


        return newCode;

    }


    // =====================================================
    // VALID EMAIL
    // =====================================================

    function isValidEmail(input) {

        if (!input) {

            return false;

        }


        return input.checkValidity();

    }


    // =====================================================
    // CLEAR LOGIN FORM
    // =====================================================

    function clearLoginForm() {

        if (loginEmailInput) {

            loginEmailInput.value =
                "";

        }


        if (loginPasswordInput) {

            loginPasswordInput.value =
                "";

        }

    }


    // =====================================================
    // FIRST LOGIN DISPLAY
    // =====================================================

    function showFirstTimeLogin() {

        if (sendCodeBtn) {

            sendCodeBtn.style.display =
                "block";

        }


        if (passwordArea) {

            passwordArea.classList.remove(
                "show"
            );

        }


        if (resendCodeBox) {

            resendCodeBox.classList.remove(
                "show"
            );

        }


        if (loginDescription) {

            loginDescription.textContent =
                "Enter your email address and click Send Code";

        }

    }


    // =====================================================
    // NORMAL LOGIN DISPLAY
    // =====================================================

    function showNormalLogin() {

        if (sendCodeBtn) {

            sendCodeBtn.style.display =
                "none";

        }


        if (passwordArea) {

            passwordArea.classList.add(
                "show"
            );

        }


        if (resendCodeBox) {

            resendCodeBox.classList.remove(
                "show"
            );

        }


        if (loginDescription) {

            loginDescription.textContent =
                "Enter your email address and password to continue";

        }

    }


    // =====================================================
    // FIRST CODE WAITING DISPLAY
    // =====================================================

    function showFirstCodeWaiting() {

        if (sendCodeBtn) {

            sendCodeBtn.style.display =
                "none";

        }


        if (passwordArea) {

            passwordArea.classList.add(
                "show"
            );

        }


        if (resendCodeBox) {

            resendCodeBox.classList.add(
                "show"
            );

        }


        if (loginDescription) {

            loginDescription.textContent =
                "Enter the code shown in the notification as your password";

        }

    }


    // =====================================================
    // CHECK ACCOUNT WHEN PAGE LOADS
    // =====================================================

    const existingAccount =
        getAdminAccount();


    if (!existingAccount) {

        showFirstTimeLogin();

    } else if (
        existingAccount.firstLoginCompleted === true
    ) {

        showNormalLogin();

        clearLoginForm();

    } else {

        showFirstCodeWaiting();


        // The email is kept because this is still
        // the FIRST code setup process.

        if (
            loginEmailInput &&
            existingAccount.email
        ) {

            loginEmailInput.value =
                existingAccount.email;

        }


        if (loginPasswordInput) {

            loginPasswordInput.value =
                "";

        }

    }


    // =====================================================
    // SEND FIRST LOGIN CODE
    // =====================================================

    if (sendCodeBtn) {

        sendCodeBtn.addEventListener(
            "click",
            function () {

                if (!loginEmailInput) {

                    return;

                }


                const email =
                    loginEmailInput.value
                        .trim()
                        .toLowerCase();


                if (!email) {

                    showMessage(
                        "Please enter your email address.",
                        "error"
                    );


                    loginEmailInput.focus();


                    return;

                }


                if (
                    !isValidEmail(
                        loginEmailInput
                    )
                ) {

                    showMessage(
                        "Please enter a valid email address.",
                        "error"
                    );


                    loginEmailInput.focus();


                    return;

                }


                const savedAccount =
                    getAdminAccount();


                // =================================================
                // ACCOUNT ALREADY EXISTS
                // =================================================

                if (savedAccount) {

                    if (
                        savedAccount.email
                            .toLowerCase() !==
                        email
                    ) {

                        showMessage(
                            "This email is not authorized to access this account.",
                            "error"
                        );


                        return;

                    }


                    if (
                        savedAccount.firstLoginCompleted === true
                    ) {

                        showNormalLogin();


                        if (loginPasswordInput) {

                            loginPasswordInput.value =
                                "";

                            loginPasswordInput.focus();

                        }


                        showMessage(
                            "This account already has a password. Please enter your password.",
                            "error"
                        );


                        return;

                    }


                    showFirstCodeWaiting();


                    return;

                }


                // =================================================
                // GENERATE FIRST CODE
                // =================================================

                const generatedCode =
                    generateCode();


                const newAccount = {

                    id:
                        Date.now().toString(),

                    name:
                        "Administrator",

                    email:
                        email,

                    phone:
                        "",

                    password:
                        generatedCode,

                    role:
                        "Administrator",

                    school:
                        "Al-Aleem Group of Schools",

                    profilePicture:
                        "",

                    createdAt:
                        new Date().toISOString(),

                    firstLoginCompleted:
                        false

                };


                const saved =
                    saveAdminAccount(
                        newAccount
                    );


                if (!saved) {

                    showMessage(
                        "Your login code could not be created. Please try again.",
                        "error"
                    );


                    return;

                }


                firstLoginResendCount =
                    0;


                showFirstCodeWaiting();


                showMessage(
                    "Your login code is: " +
                    generatedCode +
                    ". This code is now your password.",
                    "success",
                    10000
                );


                if (loginPasswordInput) {

                    loginPasswordInput.value =
                        "";

                    loginPasswordInput.focus();

                }

            }
        );

    }


    // =====================================================
    // FIRST LOGIN RESEND COUNTDOWN
    // =====================================================

    function startFirstLoginCountdown() {

        if (!resendCodeBtn) {

            return;

        }


        if (firstLoginResendTimer) {

            clearInterval(
                firstLoginResendTimer
            );

        }


        let secondsLeft =
            RESEND_WAIT_TIME;


        resendCodeBtn.disabled =
            true;


        resendCodeBtn.textContent =
            "Resend code in " +
            secondsLeft +
            "s";


        firstLoginResendTimer =
            setInterval(
                function () {

                    secondsLeft--;


                    if (
                        secondsLeft > 0
                    ) {

                        resendCodeBtn.textContent =
                            "Resend code in " +
                            secondsLeft +
                            "s";

                    } else {

                        clearInterval(
                            firstLoginResendTimer
                        );


                        firstLoginResendTimer =
                            null;


                        firstLoginResendCount =
                            0;


                        resendCodeBtn.disabled =
                            false;


                        resendCodeBtn.textContent =
                            "Resend Code";

                    }

                },
                1000
            );

    }


    // =====================================================
    // RESEND FIRST LOGIN CODE
    // =====================================================

    if (resendCodeBtn) {

        resendCodeBtn.addEventListener(
            "click",
            function () {

                const account =
                    getAdminAccount();


                if (!account) {

                    showMessage(
                        "No account was found.",
                        "error"
                    );


                    return;

                }


                if (
                    account.firstLoginCompleted === true
                ) {

                    showNormalLogin();

                    clearLoginForm();


                    return;

                }


                if (
                    firstLoginResendCount >=
                    MAX_RESENDS
                ) {

                    startFirstLoginCountdown();


                    return;

                }


                const oldCode =
                    account.password;


                const newCode =
                    generateCode(
                        oldCode
                    );


                account.password =
                    newCode;


                const saved =
                    saveAdminAccount(
                        account
                    );


                if (!saved) {

                    showMessage(
                        "A new code could not be generated. Please try again.",
                        "error"
                    );


                    return;

                }


                firstLoginResendCount++;


                if (loginPasswordInput) {

                    loginPasswordInput.value =
                        "";

                    loginPasswordInput.focus();

                }


                showMessage(
                    "Your new login code is: " +
                    newCode +
                    ". Your previous code will no longer work.",
                    "success",
                    10000
                );


                if (
                    firstLoginResendCount >=
                    MAX_RESENDS
                ) {

                    startFirstLoginCountdown();

                }

            }
        );

    }


    // =====================================================
    // LOGIN
    // =====================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    !loginEmailInput ||
                    !loginPasswordInput
                ) {

                    return;

                }


                const email =
                    loginEmailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    loginPasswordInput.value;


                if (!email) {

                    showMessage(
                        "Please enter your email address.",
                        "error"
                    );


                    loginEmailInput.focus();


                    return;

                }


                if (
                    !isValidEmail(
                        loginEmailInput
                    )
                ) {

                    showMessage(
                        "Please enter a valid email address.",
                        "error"
                    );


                    loginEmailInput.focus();


                    return;

                }


                if (!password) {

                    showMessage(
                        "Please enter your password.",
                        "error"
                    );


                    loginPasswordInput.focus();


                    return;

                }


                const account =
                    getAdminAccount();


                if (!account) {

                    showMessage(
                        "Please click Send Code first.",
                        "error"
                    );


                    return;

                }


                // =================================================
                // BLOCK ANOTHER EMAIL
                // =================================================

                if (
                    account.email
                        .toLowerCase() !==
                    email
                ) {

                    showMessage(
                        "This email is not authorized to access this account.",
                        "error"
                    );


                    loginEmailInput.focus();


                    return;

                }


                // =================================================
                // CHECK PASSWORD
                // =================================================

                if (
                    account.password !==
                    password
                ) {

                    showMessage(
                        "Incorrect password.",
                        "error"
                    );


                    loginPasswordInput.value =
                        "";


                    loginPasswordInput.focus();


                    return;

                }


                // =================================================
                // SUCCESSFUL LOGIN
                // =================================================

                account.firstLoginCompleted =
                    true;


                const accountSaved =
                    saveAdminAccount(
                        account
                    );


                if (!accountSaved) {

                    showMessage(
                        "Login could not be completed. Please try again.",
                        "error"
                    );


                    return;

                }


                const sessionSaved =
                    saveCurrentUser(
                        account
                    );


                if (!sessionSaved) {

                    showMessage(
                        "Login could not be completed. Please try again.",
                        "error"
                    );


                    return;

                }


                showMessage(
                    "Login successful. Opening dashboard..."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            DASHBOARD_PAGE;

                    },
                    800
                );

            }
        );

    }


    // =====================================================
    // OPEN FORGOT PASSWORD
    // =====================================================

    if (forgotPasswordBtn) {

        forgotPasswordBtn.addEventListener(
            "click",
            function () {

                const account =
                    getAdminAccount();


                if (!account) {

                    showMessage(
                        "No admin account has been created yet.",
                        "error"
                    );


                    return;

                }


                // Keep forgot password email empty.
                // User must type the email manually.

                if (forgotEmailInput) {

                    forgotEmailInput.value =
                        "";

                }


                if (forgotResendBox) {

                    forgotResendBox.classList.remove(
                        "show"
                    );

                }


                forgotPasswordSendCount =
                    0;


                if (forgotSendCodeBtn) {

                    forgotSendCodeBtn.style.display =
                        "block";

                    forgotSendCodeBtn.disabled =
                        false;

                    forgotSendCodeBtn.textContent =
                        "Send New Code";

                }


                if (forgotResendCodeBtn) {

                    forgotResendCodeBtn.disabled =
                        false;

                    forgotResendCodeBtn.textContent =
                        "Resend Code";

                }


                if (forgotPasswordOverlay) {

                    forgotPasswordOverlay.classList.add(
                        "show"
                    );

                }


                document.body.style.overflow =
                    "hidden";


                setTimeout(
                    function () {

                        if (forgotEmailInput) {

                            forgotEmailInput.focus();

                        }

                    },
                    100
                );

            }
        );

    }


    // =====================================================
    // CLOSE FORGOT PASSWORD
    // =====================================================

    function closeForgotPassword() {

        if (forgotPasswordOverlay) {

            forgotPasswordOverlay.classList.remove(
                "show"
            );

        }


        document.body.style.overflow =
            "";

    }


    if (closeForgotPasswordBtn) {

        closeForgotPasswordBtn.addEventListener(
            "click",
            closeForgotPassword
        );

    }


    // =====================================================
    // CLICK OUTSIDE FORGOT PASSWORD
    // =====================================================

    if (forgotPasswordOverlay) {

        forgotPasswordOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    forgotPasswordOverlay
                ) {

                    closeForgotPassword();

                }

            }
        );

    }


    // =====================================================
    // ESCAPE KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                forgotPasswordOverlay &&
                forgotPasswordOverlay
                    .classList
                    .contains("show")
            ) {

                closeForgotPassword();

            }

        }
    );


    // =====================================================
    // GENERATE FORGOT PASSWORD CODE
    // =====================================================

    function generateForgotPasswordCode() {

        const account =
            getAdminAccount();


        if (!account) {

            showMessage(
                "No admin account was found.",
                "error"
            );


            return false;

        }


        if (!forgotEmailInput) {

            return false;

        }


        const email =
            forgotEmailInput.value
                .trim()
                .toLowerCase();


        if (!email) {

            showMessage(
                "Please enter your registered email address.",
                "error"
            );


            forgotEmailInput.focus();


            return false;

        }


        if (
            !isValidEmail(
                forgotEmailInput
            )
        ) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );


            forgotEmailInput.focus();


            return false;

        }


        // =================================================
        // ONLY REGISTERED EMAIL CAN RESET PASSWORD
        // =================================================

        if (
            account.email
                .toLowerCase() !==
            email
        ) {

            showMessage(
                "This email is not authorized to reset the password.",
                "error"
            );


            forgotEmailInput.focus();


            return false;

        }


        const oldPassword =
            account.password;


        const newCode =
            generateCode(
                oldPassword
            );


        // =================================================
        // NEW CODE BECOMES THE NEW PASSWORD
        // =================================================

        account.password =
            newCode;


        account.firstLoginCompleted =
            true;


        const saved =
            saveAdminAccount(
                account
            );


        if (!saved) {

            showMessage(
                "A new password code could not be generated. Please try again.",
                "error"
            );


            return false;

        }


        // =================================================
        // KEEP MAIN LOGIN FORM EMPTY
        // =================================================

        if (loginEmailInput) {

            loginEmailInput.value =
                "";

        }


        if (loginPasswordInput) {

            loginPasswordInput.value =
                "";

        }


        // =================================================
        // SHOW NEW PASSWORD FOR 10 SECONDS
        // =================================================

        showMessage(
            "Your new password code is: " +
            newCode +
            ". Your previous password will no longer work.",
            "success",
            10000
        );


        return true;

    }


    // =====================================================
    // FORGOT PASSWORD COUNTDOWN
    // =====================================================

    function startForgotPasswordCountdown() {

        if (!forgotResendCodeBtn) {

            return;

        }


        if (forgotPasswordTimer) {

            clearInterval(
                forgotPasswordTimer
            );

        }


        let secondsLeft =
            RESEND_WAIT_TIME;


        forgotResendCodeBtn.disabled =
            true;


        forgotResendCodeBtn.textContent =
            "Resend code in " +
            secondsLeft +
            "s";


        forgotPasswordTimer =
            setInterval(
                function () {

                    secondsLeft--;


                    if (
                        secondsLeft > 0
                    ) {

                        forgotResendCodeBtn.textContent =
                            "Resend code in " +
                            secondsLeft +
                            "s";

                    } else {

                        clearInterval(
                            forgotPasswordTimer
                        );


                        forgotPasswordTimer =
                            null;


                        forgotPasswordSendCount =
                            0;


                        forgotResendCodeBtn.disabled =
                            false;


                        forgotResendCodeBtn.textContent =
                            "Resend Code";

                    }

                },
                1000
            );

    }


    // =====================================================
    // FIRST FORGOT PASSWORD SEND
    // =====================================================

    if (forgotPasswordForm) {

        forgotPasswordForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const successful =
                    generateForgotPasswordCode();


                if (!successful) {

                    return;

                }


                forgotPasswordSendCount =
                    1;


                if (forgotSendCodeBtn) {

                    forgotSendCodeBtn.style.display =
                        "none";

                }


                if (forgotResendBox) {

                    forgotResendBox.classList.add(
                        "show"
                    );

                }

            }
        );

    }


    // =====================================================
    // RESEND FORGOT PASSWORD CODE
    // =====================================================

    if (forgotResendCodeBtn) {

        forgotResendCodeBtn.addEventListener(
            "click",
            function () {

                if (
                    forgotPasswordSendCount >=
                    MAX_RESENDS
                ) {

                    startForgotPasswordCountdown();


                    return;

                }


                const successful =
                    generateForgotPasswordCode();


                if (!successful) {

                    return;

                }


                forgotPasswordSendCount++;


                if (
                    forgotPasswordSendCount >=
                    MAX_RESENDS
                ) {

                    startForgotPasswordCountdown();

                }

            }
        );

    }


    // =====================================================
    // PASSWORD SHOW / HIDE
    // =====================================================

    const passwordToggles =
        document.querySelectorAll(
            ".password-toggle"
        );


    passwordToggles.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.getAttribute(
                            "data-target"
                        );


                    if (!targetId) {

                        return;

                    }


                    const passwordInput =
                        document.getElementById(
                            targetId
                        );


                    if (!passwordInput) {

                        return;

                    }


                    const eyeIcon =
                        button.querySelector(
                            ".eye"
                        );


                    if (
                        passwordInput.type ===
                        "password"
                    ) {

                        passwordInput.type =
                            "text";


                        if (eyeIcon) {

                            eyeIcon.classList.remove(
                                "fa-eye-slash"
                            );


                            eyeIcon.classList.add(
                                "fa-eye"
                            );

                        }

                    } else {

                        passwordInput.type =
                            "password";


                        if (eyeIcon) {

                            eyeIcon.classList.remove(
                                "fa-eye"
                            );


                            eyeIcon.classList.add(
                                "fa-eye-slash"
                            );

                        }

                    }

                }
            );

        }
    );


    // =====================================================
    // CHECK EMAIL WHEN USER LEAVES EMAIL FIELD
    // =====================================================

    if (loginEmailInput) {

        loginEmailInput.addEventListener(
            "blur",
            function () {

                const account =
                    getAdminAccount();


                if (!account) {

                    return;

                }


                const email =
                    loginEmailInput.value
                        .trim()
                        .toLowerCase();


                if (!email) {

                    return;

                }


                if (
                    email !==
                    account.email
                        .toLowerCase()
                ) {

                    showMessage(
                        "Only the registered admin email can login.",
                        "error"
                    );

                }

            }
        );

    }


    // =====================================================
    // PREVENT OUR JAVASCRIPT FROM RESTORING LOGIN VALUES
    // =====================================================

    window.addEventListener(
        "pageshow",
        function () {

            const account =
                getAdminAccount();


            if (
                account &&
                account.firstLoginCompleted === true
            ) {

                clearLoginForm();

            }

        }
    );

});
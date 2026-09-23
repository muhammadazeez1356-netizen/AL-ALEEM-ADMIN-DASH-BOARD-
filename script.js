// =====================================================
// AL-ALEEM SIGNUP / LOGIN
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const splashScreen = document.getElementById("splashScreen");
    const mainPage = document.getElementById("mainPage");

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    const loginOverlay = document.getElementById("loginOverlay");
    const openLoginBtn = document.getElementById("openLoginBtn");
    const closeLoginBtn = document.getElementById("closeLoginBtn");
    const backToSignupBtn = document.getElementById("backToSignupBtn");
    const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

    const messageBox = document.getElementById("messageBox");
    const messageText = document.getElementById("messageText");
    const messageIcon = document.getElementById("messageIcon");


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    const USERS_KEY = "alAleemUsers";
    const CURRENT_USER_KEY = "alAleemCurrentUser";
    const LOGIN_STATUS_KEY = "alAleemLoggedIn";


    /* =====================================================
       DASHBOARD PAGE
    ===================================================== */

    const DASHBOARD_PAGE = "./aleem-dashboard/aleem.html";


    /* =====================================================
       SPLASH SCREEN
    ===================================================== */

    if (mainPage) {
        mainPage.style.display = "none";
    }

    setTimeout(function () {

        if (splashScreen) {
            splashScreen.classList.add("hide");
        }

        if (mainPage) {
            mainPage.style.display = "flex";
        }

    }, 5000);


    /* =====================================================
       GET USERS
    ===================================================== */

    function getUsers() {

        try {

            const savedUsers =
                localStorage.getItem(USERS_KEY);

            if (!savedUsers) {
                return [];
            }

            const users =
                JSON.parse(savedUsers);

            if (!Array.isArray(users)) {
                return [];
            }

            return users;

        } catch (error) {

            console.error(
                "Error reading users:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       SAVE USERS
    ===================================================== */

    function saveUsers(users) {

        try {

            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(users)
            );

            return true;

        } catch (error) {

            console.error(
                "Error saving users:",
                error
            );

            return false;
        }
    }


    /* =====================================================
       SAVE CURRENT USER
    ===================================================== */

    function saveCurrentUser(user) {

        try {

            const currentUser = {

                id: user.id,

                name:
                    user.name ||
                    user.fullname ||
                    "Administrator",

                email:
                    user.email ||
                    "",

                phone:
                    user.phone ||
                    "",

                role:
                    user.role ||
                    "Administrator",

                school:
                    user.school ||
                    "Al-Aleem Group of Schools",

                profilePicture:
                    user.profilePicture ||
                    "",

                createdAt:
                    user.createdAt ||
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


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(
        message,
        type = "success"
    ) {

        if (
            !messageBox ||
            !messageText ||
            !messageIcon
        ) {
            return;
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


        setTimeout(function () {

            messageBox.classList.remove(
                "show"
            );

        }, 3500);

    }


    /* =====================================================
       OPEN LOGIN
    ===================================================== */

    if (
        openLoginBtn &&
        loginOverlay
    ) {

        openLoginBtn.addEventListener(
            "click",
            function () {

                loginOverlay.classList.add(
                    "show"
                );

                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    /* =====================================================
       CLOSE LOGIN
    ===================================================== */

    function closeLogin() {

        if (loginOverlay) {

            loginOverlay.classList.remove(
                "show"
            );

        }

        document.body.style.overflow =
            "";

    }


    if (closeLoginBtn) {

        closeLoginBtn.addEventListener(
            "click",
            closeLogin
        );

    }


    /* =====================================================
       CLICK OUTSIDE LOGIN
    ===================================================== */

    if (loginOverlay) {

        loginOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    loginOverlay
                ) {

                    closeLogin();

                }

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                loginOverlay &&
                loginOverlay.classList.contains("show")
            ) {

                closeLogin();

            }

        }
    );


    /* =====================================================
       BACK TO SIGNUP
    ===================================================== */

    if (backToSignupBtn) {

        backToSignupBtn.addEventListener(
            "click",
            function () {

                closeLogin();

            }
        );

    }


    /* =====================================================
       SIGN UP
    ===================================================== */

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "signupName"
                    );

                const emailInput =
                    document.getElementById(
                        "signupEmail"
                    );

                const phoneInput =
                    document.getElementById(
                        "signupPhone"
                    );

                const passwordInput =
                    document.getElementById(
                        "signupPassword"
                    );

                const confirmPasswordInput =
                    document.getElementById(
                        "confirmPassword"
                    );


                if (
                    !nameInput ||
                    !emailInput ||
                    !phoneInput ||
                    !passwordInput ||
                    !confirmPasswordInput
                ) {

                    showMessage(
                        "Signup form could not be loaded correctly.",
                        "error"
                    );

                    return;
                }


                const name =
                    nameInput.value.trim();

                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();

                const phone =
                    phoneInput.value.trim();

                const password =
                    passwordInput.value;

                const confirmPassword =
                    confirmPasswordInput.value;


                if (!name) {

                    showMessage(
                        "Please enter your full name.",
                        "error"
                    );

                    nameInput.focus();

                    return;
                }


                if (!email) {

                    showMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }


                if (
                    !emailInput.checkValidity()
                ) {

                    showMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }


                if (!phone) {

                    showMessage(
                        "Please enter your phone number.",
                        "error"
                    );

                    phoneInput.focus();

                    return;
                }


                if (password.length < 6) {

                    showMessage(
                        "Password must be at least 6 characters.",
                        "error"
                    );

                    passwordInput.focus();

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showMessage(
                        "Passwords do not match.",
                        "error"
                    );

                    confirmPasswordInput.focus();

                    return;
                }


                const users =
                    getUsers();


                const existingUser =
                    users.find(
                        function (user) {

                            return (
                                user.email &&
                                user.email
                                    .toLowerCase() ===
                                    email
                            );

                        }
                    );


                if (existingUser) {

                    showMessage(
                        "An account with this email already exists. Please login.",
                        "error"
                    );

                    return;
                }


                const newUser = {

                    id:
                        Date.now().toString(),

                    name:
                        name,

                    email:
                        email,

                    phone:
                        phone,

                    password:
                        password,

                    role:
                        "Administrator",

                    school:
                        "Al-Aleem Group of Schools",

                    profilePicture:
                        "",

                    createdAt:
                        new Date().toISOString()

                };


                users.push(
                    newUser
                );


                const usersSaved =
                    saveUsers(users);


                if (!usersSaved) {

                    showMessage(
                        "Your account could not be saved. Please try again.",
                        "error"
                    );

                    return;
                }


                const sessionSaved =
                    saveCurrentUser(
                        newUser
                    );


                if (!sessionSaved) {

                    showMessage(
                        "Account created, but login could not be completed.",
                        "error"
                    );

                    return;
                }


                showMessage(
                    "Account created successfully. Opening dashboard..."
                );


                signupForm.reset();


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


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const loginEmailInput =
                    document.getElementById(
                        "loginEmail"
                    );

                const loginPasswordInput =
                    document.getElementById(
                        "loginPassword"
                    );


                if (
                    !loginEmailInput ||
                    !loginPasswordInput
                ) {

                    showMessage(
                        "Login form could not be loaded correctly.",
                        "error"
                    );

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


                if (!password) {

                    showMessage(
                        "Please enter your password.",
                        "error"
                    );

                    loginPasswordInput.focus();

                    return;
                }


                const users =
                    getUsers();


                if (users.length === 0) {

                    showMessage(
                        "No account found. Please create an account first.",
                        "error"
                    );

                    return;
                }


                const user =
                    users.find(
                        function (account) {

                            return (
                                account.email &&
                                account.email
                                    .toLowerCase() ===
                                    email
                            );

                        }
                    );


                if (!user) {

                    showMessage(
                        "No account found with this email. Please create an account first.",
                        "error"
                    );

                    return;
                }


                if (
                    user.password !==
                    password
                ) {

                    showMessage(
                        "Incorrect password. Please try again.",
                        "error"
                    );

                    loginPasswordInput.focus();

                    return;
                }


                const sessionSaved =
                    saveCurrentUser(
                        user
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


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    if (forgotPasswordBtn) {

        forgotPasswordBtn.addEventListener(
            "click",
            function () {

                const loginEmail =
                    document.getElementById(
                        "loginEmail"
                    );


                if (!loginEmail) {
                    return;
                }


                const email =
                    loginEmail.value
                        .trim()
                        .toLowerCase();


                if (!email) {

                    showMessage(
                        "Please enter your email first.",
                        "error"
                    );

                    loginEmail.focus();

                    return;
                }


                const users =
                    getUsers();


                const user =
                    users.find(
                        function (account) {

                            return (
                                account.email &&
                                account.email
                                    .toLowerCase() ===
                                    email
                            );

                        }
                    );


                if (!user) {

                    showMessage(
                        "No account was found with this email.",
                        "error"
                    );

                    return;
                }


                showMessage(
                    "Password recovery would be sent to your email."
                );

            }
        );

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

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

                    const eyeSpan =
                        button.querySelector(
                            "span"
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


                        if (eyeSpan) {

                            eyeSpan.textContent =
                                "🙈";

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


                        if (eyeSpan) {

                            eyeSpan.textContent =
                                "👁";

                        }

                    }

                }
            );

        }
    );

});



document.addEventListener("DOMContentLoaded", function () {

    const passwordToggle = document.querySelector(".password-toggle");

    passwordToggle.addEventListener("click", function () {

        const targetId = this.getAttribute("data-target");
        const passwordInput = document.getElementById(targetId);
        const icon = this.querySelector(".eye");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        } else {

            passwordInput.type = "password";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        }

    });

});
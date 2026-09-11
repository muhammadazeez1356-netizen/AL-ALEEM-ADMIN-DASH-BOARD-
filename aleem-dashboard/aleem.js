document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const CURRENT_USER_KEY = "alAleemCurrentUser";
    const LOGIN_STATUS_KEY = "alAleemLoggedIn";


    /* =====================================================
       LOGIN PAGE
    ===================================================== */

    const LOGIN_PAGE = "../index.html";


    /* =====================================================
       GET CURRENT USER
    ===================================================== */

    function getCurrentUser() {

        try {

            const savedUser =
                localStorage.getItem(CURRENT_USER_KEY);


            if (!savedUser) {
                return null;
            }


            const currentUser =
                JSON.parse(savedUser);


            if (
                !currentUser ||
                typeof currentUser !== "object"
            ) {
                return null;
            }


            return currentUser;

        } catch (error) {

            console.error(
                "Unable to read current user:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    function isLoggedIn() {

        const loginStatus =
            localStorage.getItem(LOGIN_STATUS_KEY);

        const currentUser =
            getCurrentUser();


        if (
            loginStatus === "true" &&
            currentUser
        ) {
            return true;
        }


        return false;
    }


    /* =====================================================
       PROTECT DASHBOARD
    ===================================================== */

    if (!isLoggedIn()) {

        window.location.replace(
            LOGIN_PAGE
        );

        return;
    }


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const currentUser =
        getCurrentUser();


    console.log(
        "Logged in user:",
        currentUser
    );


    /* =====================================================
       SIDEBAR MOBILE TOGGLE
    ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.querySelector(".side-bar");


    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", function () {

            sidebar.classList.toggle("show");

        });
    }


    /* =====================================================
       SIDEBAR MENU ACTIVE STATE
    ===================================================== */

    const menuItems =
        document.querySelectorAll(
            ".sidebar-menu .menu-item"
        );


    menuItems.forEach(function (item) {

        item.addEventListener("click", function () {

            if (
                item.classList.contains("logout")
            ) {
                return;
            }


            menuItems.forEach(function (menu) {

                menu.classList.remove("active");

            });


            item.classList.add("active");


            if (sidebar) {

                sidebar.classList.remove("show");

            }

        });

    });


    /* =====================================================
       DISPLAY USER INFORMATION
    ===================================================== */

    function displayUserInformation() {

        if (!currentUser) {
            return;
        }


        const adminDetails =
            document.querySelector(
                ".admin-details"
            );


        if (adminDetails) {

            const nameElement =
                adminDetails.querySelector("strong");

            const roleElement =
                adminDetails.querySelector("small");


            if (nameElement) {

                nameElement.textContent =
                    currentUser.name ||
                    "Administrator";

            }


            if (roleElement) {

                roleElement.textContent =
                    currentUser.role ||
                    "Administrator";

            }

        }


        const nameElements =
            document.querySelectorAll(
                "[data-user-name]"
            );


        nameElements.forEach(function (element) {

            element.textContent =
                currentUser.name ||
                "Administrator";

        });


        const emailElements =
            document.querySelectorAll(
                "[data-user-email]"
            );


        emailElements.forEach(function (element) {

            element.textContent =
                currentUser.email ||
                "";

        });


        const phoneElements =
            document.querySelectorAll(
                "[data-user-phone]"
            );


        phoneElements.forEach(function (element) {

            element.textContent =
                currentUser.phone ||
                "";

        });


        const roleElements =
            document.querySelectorAll(
                "[data-user-role]"
            );


        roleElements.forEach(function (element) {

            element.textContent =
                currentUser.role ||
                "Administrator";

        });

    }


    displayUserInformation();


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "keyup",
            function () {

                const searchValue =
                    this.value
                        .toLowerCase()
                        .trim();


                const rows =
                    document.querySelectorAll(
                        "tbody tr"
                    );


                rows.forEach(function (row) {

                    const rowText =
                        row.textContent.toLowerCase();


                    if (
                        rowText.includes(searchValue)
                    ) {

                        row.style.display = "";

                    } else {

                        row.style.display = "none";

                    }

                });

            }
        );

    }


    /* =====================================================
       CALENDAR
    ===================================================== */

    const previousMonth =
        document.getElementById(
            "previousMonth"
        );

    const nextMonth =
        document.getElementById(
            "nextMonth"
        );

    const calendarMonth =
        document.getElementById(
            "calendarMonth"
        );


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    const today = new Date();


    let currentMonth =
        today.getMonth();

    let currentYear =
        today.getFullYear();


    function updateCalendarTitle() {

        if (!calendarMonth) {
            return;
        }


        calendarMonth.textContent =
            `${months[currentMonth]} ${currentYear}`;

    }


    updateCalendarTitle();


    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            function () {

                currentMonth--;


                if (currentMonth < 0) {

                    currentMonth = 11;
                    currentYear--;

                }


                updateCalendarTitle();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            function () {

                currentMonth++;


                if (currentMonth > 11) {

                    currentMonth = 0;
                    currentYear++;

                }


                updateCalendarTitle();

            }
        );

    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const notification =
        document.querySelector(
            ".notification"
        );


    if (notification) {

        notification.addEventListener(
            "click",
            function () {

                alert(
                    "You have 3 new notifications.\n\n" +
                    "• Examination timetable released\n" +
                    "• Result submission deadline\n" +
                    "• Parent-teacher meeting scheduled"
                );

            }
        );

    }


    /* =====================================================
       QUICK ACCESS
    ===================================================== */

    const quickItems =
        document.querySelectorAll(
            ".quick-item"
        );


    quickItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const actionNameElement =
                    this.querySelector("span");


                const actionName =
                    actionNameElement
                        ? actionNameElement.textContent.trim()
                        : "Quick Action";


                console.log(
                    `Opening: ${actionName}`
                );

            }
        );

    });


    /* =====================================================
       ADMIN PROFILE
    ===================================================== */

    const adminProfile =
        document.querySelector(
            ".admin-profile"
        );


    if (adminProfile) {

        adminProfile.addEventListener(
            "click",
            function () {

                if (!currentUser) {
                    return;
                }


                const name =
                    currentUser.name ||
                    "Administrator";

                const email =
                    currentUser.email ||
                    "Not available";

                const phone =
                    currentUser.phone ||
                    "Not available";

                const role =
                    currentUser.role ||
                    "Administrator";

                const school =
                    currentUser.school ||
                    "Al-Aleem Group of Schools";


                alert(
                    "ADMINISTRATOR PROFILE\n\n" +
                    "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Phone: " + phone + "\n" +
                    "Role: " + role + "\n" +
                    "School: " + school
                );

            }
        );

    }


    /* =====================================================
       LOGOUT MODAL
    ===================================================== */

    const logout =
        document.querySelector(
            ".menu-item.logout"
        );


    let logoutModal =
        document.getElementById(
            "logoutModal"
        );


    if (!logoutModal) {

        logoutModal =
            document.createElement("div");

        logoutModal.id =
            "logoutModal";


        logoutModal.innerHTML = `

            <div class="logout-modal-overlay">

                <div class="logout-modal-box">

                    <button
                        type="button"
                        class="logout-modal-close"
                        id="logoutModalClose"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    <div class="logout-modal-icon">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </div>

                    <h2>Logout</h2>

                    <p>
                        Are you sure you want to logout
                        from your administrator account?
                    </p>

                    <div class="logout-modal-actions">

                        <button
                            type="button"
                            class="logout-cancel-btn"
                            id="logoutCancelBtn"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            class="logout-confirm-btn"
                            id="logoutConfirmBtn"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(
            logoutModal
        );

    }


    /* =====================================================
       LOGOUT MODAL ELEMENTS
    ===================================================== */

    const logoutOverlay =
        logoutModal.querySelector(
            ".logout-modal-overlay"
        );


    const logoutModalClose =
        document.getElementById(
            "logoutModalClose"
        );


    const logoutCancelBtn =
        document.getElementById(
            "logoutCancelBtn"
        );


    const logoutConfirmBtn =
        document.getElementById(
            "logoutConfirmBtn"
        );


    /* =====================================================
       OPEN LOGOUT MODAL
    ===================================================== */

    function openLogoutModal() {

        if (!logoutModal) {
            return;
        }


        logoutModal.classList.add("show");


        document.body.classList.add(
            "logout-modal-open"
        );

    }


    /* =====================================================
       CLOSE LOGOUT MODAL
    ===================================================== */

    function closeLogoutModal() {

        if (!logoutModal) {
            return;
        }


        logoutModal.classList.remove("show");


        document.body.classList.remove(
            "logout-modal-open"
        );

    }


    /* =====================================================
       LOGOUT BUTTON
    ===================================================== */

    if (logout) {

        logout.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                openLogoutModal();

            }
        );

    }


    /* =====================================================
       CLOSE MODAL - X BUTTON
    ===================================================== */

    if (logoutModalClose) {

        logoutModalClose.addEventListener(
            "click",
            function () {

                closeLogoutModal();

            }
        );

    }


    /* =====================================================
       CLOSE MODAL - CANCEL
    ===================================================== */

    if (logoutCancelBtn) {

        logoutCancelBtn.addEventListener(
            "click",
            function () {

                closeLogoutModal();

            }
        );

    }


    /* =====================================================
       CLOSE MODAL - OUTSIDE
    ===================================================== */

    if (logoutOverlay) {

        logoutOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === logoutOverlay
                ) {

                    closeLogoutModal();

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
                logoutModal &&
                logoutModal.classList.contains("show")
            ) {

                closeLogoutModal();

            }

        }
    );


    /* =====================================================
       CONFIRM LOGOUT
    ===================================================== */

    if (logoutConfirmBtn) {

        logoutConfirmBtn.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    CURRENT_USER_KEY
                );


                localStorage.removeItem(
                    LOGIN_STATUS_KEY
                );


                closeLogoutModal();


                window.location.replace(
                    LOGIN_PAGE
                );

            }
        );

    }


    /* =====================================================
       LOGOUT MODAL STYLES
    ===================================================== */

    const logoutModalStyle =
        document.createElement("style");


    logoutModalStyle.id =
        "logoutModalStyles";


    logoutModalStyle.textContent = `

        #logoutModal {
            display: none;
        }

        #logoutModal.show {
            display: block;
        }

        .logout-modal-overlay {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 999999;
            animation: logoutOverlayFade 0.2s ease;
        }

        .logout-modal-box {
            position: relative;
            width: 100%;
            max-width: 430px;
            background: #ffffff;
            border-radius: 18px;
            padding: 35px 30px 30px;
            text-align: center;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
            animation: logoutModalPop 0.25s ease;
        }

        .logout-modal-close {
            position: absolute;
            top: 13px;
            right: 15px;
            width: 35px;
            height: 35px;
            border: none;
            background: transparent;
            color: #777;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            border-radius: 50%;
            transition: 0.2s ease;
        }

        .logout-modal-close:hover {
            background: #f1f1f1;
            color: #222;
        }

        .logout-modal-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff4f4;
            color: #d93025;
            font-size: 28px;
        }

        .logout-modal-box h2 {
            margin: 0 0 10px;
            font-size: 25px;
            font-weight: 700;
            color: #222;
        }

        .logout-modal-box p {
            margin: 0 auto 25px;
            max-width: 340px;
            color: #666;
            font-size: 15px;
            line-height: 1.6;
        }

        .logout-modal-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .logout-modal-actions button {
            flex: 1;
            min-height: 46px;
            border-radius: 10px;
            padding: 10px 18px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s ease;
        }

        .logout-cancel-btn {
            border: 1px solid #ddd;
            background: #ffffff;
            color: #444;
        }

        .logout-cancel-btn:hover {
            background: #f5f5f5;
        }

        .logout-confirm-btn {
            border: 1px solid #d93025;
            background: #d93025;
            color: #ffffff;
        }

        .logout-confirm-btn:hover {
            background: #b9231b;
            border-color: #b9231b;
        }

        body.logout-modal-open {
            overflow: hidden;
        }

        @keyframes logoutOverlayFade {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }

        }

        @keyframes logoutModalPop {

            from {
                opacity: 0;
                transform: scale(0.94) translateY(10px);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }

        }

        @media (max-width: 480px) {

            .logout-modal-overlay {
                padding: 15px;
            }

            .logout-modal-box {
                max-width: 100%;
                padding: 32px 20px 22px;
                border-radius: 16px;
            }

            .logout-modal-icon {
                width: 60px;
                height: 60px;
                font-size: 24px;
            }

            .logout-modal-box h2 {
                font-size: 22px;
            }

            .logout-modal-box p {
                font-size: 14px;
            }

            .logout-modal-actions {
                flex-direction: column-reverse;
            }

            .logout-modal-actions button {
                width: 100%;
            }

        }

    `;


    document.head.appendChild(
        logoutModalStyle
    );

});
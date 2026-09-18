document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const USERS_KEY = "alAleemUsers";
    const CURRENT_USER_KEY = "alAleemCurrentUser";
    const LOGIN_STATUS_KEY = "alAleemLoggedIn";
    const CURRENT_PAGE_KEY = "alAleemCurrentPage";

    const LOGIN_PAGE = "../index.html";


    /* =====================================================
       GET CURRENT USER
    ===================================================== */

    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    CURRENT_USER_KEY
                )
            );

        } catch (error) {

            return null;

        }

    }


    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    function isLoggedIn() {

        return (
            localStorage.getItem(
                LOGIN_STATUS_KEY
            ) === "true" &&
            getCurrentUser()
        );

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

    let currentUser =
        getCurrentUser();


    /* =====================================================
       MAIN ELEMENTS
    ===================================================== */

    const mainContent =
        document.getElementById(
            "mainContent"
        );

    const menuItems =
        document.querySelectorAll(
            ".sidebar-menu .menu-item"
        );

    const headerTitle =
        document.getElementById(
            "headerTitle"
        );

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const sideBar =
        document.querySelector(
            ".side-bar"
        );


    /* =====================================================
       PAGE TITLES
    ===================================================== */

    const pageTitles = {

        dashboard: "Dashboard",
        teachers: "Teachers",
        students: "Students",
        courses: "Courses",
        attendance: "Attendance",
        results: "Results",
        messages: "Messages",
        settings: "Settings"

    };


    /* =====================================================
       DISPLAY CURRENT USER
    ===================================================== */

    function displayCurrentUser() {

        currentUser =
            getCurrentUser();


        if (!currentUser) {
            return;
        }


        const userName =
            currentUser.name ||
            currentUser.fullname ||
            "Administrator";


        const userEmail =
            currentUser.email ||
            "";


        const userPhone =
            currentUser.phone ||
            "";


        const userRole =
            currentUser.role ||
            "Administrator";


        const sidebarName =
            document.getElementById(
                "sidebarName"
            );


        const driverName =
            document.getElementById(
                "driverName"
            );


        const adminDetails =
            document.querySelector(
                ".admin-details"
            );


        const adminName =
            document.getElementById(
                "adminName"
            );


        const adminRole =
            document.getElementById(
                "adminRole"
            );


        const adminAvatarImage =
            document.getElementById(
                "adminAvatarImage"
            );


        const adminAvatarDefault =
            document.getElementById(
                "adminAvatarDefault"
            );


        if (sidebarName) {

            sidebarName.textContent =
                userName;

        }


        if (driverName) {

            driverName.textContent =
                userName;

        }


        if (adminName) {

            adminName.textContent =
                userName;

        }


        if (adminRole) {

            adminRole.textContent =
                userRole;

        }


        if (adminDetails) {

            adminDetails.setAttribute(
                "data-name",
                userName
            );

            adminDetails.setAttribute(
                "data-email",
                userEmail
            );

            adminDetails.setAttribute(
                "data-phone",
                userPhone
            );

        }


        /* =================================================
           PROFILE PICTURE
        ================================================= */

        if (
            adminAvatarImage &&
            adminAvatarDefault
        ) {

            if (
                currentUser.profilePicture
            ) {

                adminAvatarImage.src =
                    currentUser.profilePicture;

                adminAvatarImage.style.display =
                    "block";

                adminAvatarDefault.style.display =
                    "none";

            } else {

                adminAvatarImage.src =
                    "";

                adminAvatarImage.style.display =
                    "none";

                adminAvatarDefault.style.display =
                    "block";

            }

        }

    }


    displayCurrentUser();


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (
        menuToggle &&
        sideBar
    ) {

        menuToggle.addEventListener(
            "click",
            function () {

                sideBar.classList.toggle(
                    "show"
                );

            }
        );

    }


    /* =====================================================
       SIDEBAR MENU
    ===================================================== */

    menuItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function (event) {

                    const page =
                        item.getAttribute(
                            "data-page"
                        );


                    /* ===============================
                       LOGOUT
                    =============================== */

                    if (
                        item.classList.contains(
                            "logout"
                        )
                    ) {

                        event.preventDefault();
                        event.stopPropagation();

                        openLogoutModal();

                        return;

                    }


                    /* ===============================
                       NORMAL MENU ITEM
                    =============================== */

                    if (!page) {
                        return;
                    }


                    event.preventDefault();


                    /* ===============================
                       REMEMBER CURRENT PAGE
                    =============================== */

                    localStorage.setItem(
                        CURRENT_PAGE_KEY,
                        page
                    );


                    menuItems.forEach(
                        function (menu) {

                            menu.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    if (
                        headerTitle &&
                        pageTitles[page]
                    ) {

                        headerTitle.textContent =
                            pageTitles[page];

                    }


                    if (
                        page ===
                        "dashboard"
                    ) {

                        loadDashboard();

                    } else {

                        loadPage(page);

                    }


                    if (
                        sideBar &&
                        window.innerWidth <= 900
                    ) {

                        sideBar.classList.remove(
                            "show"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    function loadDashboard() {

        window.location.href =
            "aleem.html";

    }


    /* =====================================================
       LOAD PAGE
    ===================================================== */

    function loadPage(page) {

        if (!mainContent) {
            return;
        }


        const file =
            page + ".html";


        mainContent.innerHTML = `

            <div class="page-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Loading ${pageTitles[page] || page}...
                </p>

            </div>

        `;


        fetch(file)

            .then(
                function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Could not load " +
                            file
                        );

                    }

                    return response.text();

                }
            )

            .then(
                function (html) {

                    const parser =
                        new DOMParser();


                    const pageDocument =
                        parser.parseFromString(
                            html,
                            "text/html"
                        );


                    let pageContent =
                        pageDocument.querySelector(
                            "#mainContent"
                        );


                    if (!pageContent) {

                        pageContent =
                            pageDocument.querySelector(
                                ".main-content"
                            );

                    }


                    if (!pageContent) {

                        pageContent =
                            pageDocument.querySelector(
                                ".page-content"
                            );

                    }


                    if (!pageContent) {

                        pageContent =
                            pageDocument.body;

                    }


                    if (!pageContent) {

                        throw new Error(
                            "No page content found in " +
                            file
                        );

                    }


                    mainContent.innerHTML =
                        pageContent.innerHTML;


                    loadPageScript(page);

                }
            )

            .catch(
                function (error) {

                    console.error(error);


                    mainContent.innerHTML = `

                        <div class="page-error">

                            <div class="page-error-icon">

                                <i class="fa-solid fa-triangle-exclamation"></i>

                            </div>

                            <h2>
                                Unable to Load Page
                            </h2>

                            <p>
                                We could not load the
                                ${pageTitles[page] || page}
                                page.
                            </p>

                            <small>
                                File: ${file}
                            </small>

                        </div>

                    `;

                }
            );

    }


    /* =====================================================
       LOAD PAGE SCRIPT
    ===================================================== */

    function loadPageScript(page) {

        const oldScript =
            document.querySelector(
                "script[data-page-script]"
            );


        if (oldScript) {
            oldScript.remove();
        }


        if (page === "dashboard") {
            return;
        }


        const script =
            document.createElement(
                "script"
            );


        script.src =
            page + ".js";


        script.setAttribute(
            "data-page-script",
            page
        );


        script.onload =
            function () {

                console.log(
                    page +
                    ".js loaded successfully."
                );

            };


        script.onerror =
            function () {

                console.log(
                    page +
                    ".js was not found or could not be loaded."
                );

            };


        document.body.appendChild(
            script
        );

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchValue =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const rows =
                    document.querySelectorAll(
                        "tbody tr"
                    );


                rows.forEach(
                    function (row) {

                        const rowText =
                            row.textContent
                                .toLowerCase();


                        if (
                            rowText.includes(
                                searchValue
                            )
                        ) {

                            row.style.display =
                                "";

                        } else {

                            row.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       CALENDAR
    ===================================================== */

    const calendarMonth =
        document.getElementById(
            "calendarMonth"
        );


    const calendarYear =
        document.getElementById(
            "calendarYear"
        );


    const previousMonth =
        document.getElementById(
            "previousMonth"
        );


    const nextMonth =
        document.getElementById(
            "nextMonth"
        );


    let calendarDate =
        new Date();


    function updateCalendar() {

        if (
            !calendarMonth
        ) {

            return;

        }


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


        calendarMonth.textContent =
            months[
                calendarDate.getMonth()
            ];


        if (calendarYear) {

            calendarYear.textContent =
                calendarDate.getFullYear();

        }

    }


    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            function () {

                calendarDate.setMonth(
                    calendarDate.getMonth() - 1
                );

                updateCalendar();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            function () {

                calendarDate.setMonth(
                    calendarDate.getMonth() + 1
                );

                updateCalendar();

            }
        );

    }


    updateCalendar();


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const notificationBtn =
        document.getElementById(
            "notificationBtn"
        );


    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            function () {

                alert(
                    "You have 3 new notifications."
                );

            }
        );

    }


    /* =====================================================
       QUICK ACCESS
    ===================================================== */

    const quickAccess =
        document.querySelectorAll(
            ".quick-access"
        );


    quickAccess.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    console.log(
                        "Quick access clicked."
                    );

                }
            );

        }
    );


    /* =====================================================
       ADMIN PROFILE
    ===================================================== */

    const adminProfile =
        document.getElementById(
            "adminProfile"
        );


    if (adminProfile) {

        adminProfile.addEventListener(
            "click",
            function () {

                const settingsItem =
                    document.querySelector(
                        '.menu-item[data-page="settings"]'
                    );


                if (settingsItem) {

                    settingsItem.click();

                }

            }
        );

    }


    /* =====================================================
       LOGOUT MODAL
    ===================================================== */

    function openLogoutModal() {

        let logoutModal =
            document.getElementById(
                "logoutModal"
            );


        if (!logoutModal) {

            logoutModal =
                document.createElement(
                    "div"
                );


            logoutModal.id =
                "logoutModal";


            logoutModal.innerHTML = `

                <div class="logout-overlay">

                    <div class="logout-box">

                        <div class="logout-icon">

                            <i class="fa-solid fa-right-from-bracket"></i>

                        </div>

                        <h2>
                            Logout
                        </h2>

                        <p>
                            Are you sure you want to logout?
                        </p>

                        <div class="logout-buttons">

                            <button
                                type="button"
                                id="cancelLogout"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                id="confirmLogout"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            `;


            const style =
                document.createElement(
                    "style"
                );


            style.textContent = `

                #logoutModal {

                    position: fixed;
                    inset: 0;
                    z-index: 99999;

                }

                .logout-overlay {

                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 20px;

                }

                .logout-box {

                    width: 100%;
                    max-width: 420px;

                    background: white;
                    border-radius: 18px;

                    padding: 35px 25px;

                    text-align: center;

                    box-shadow:
                        0 20px 50px rgba(0,0,0,0.25);

                }

                .logout-icon {

                    width: 70px;
                    height: 70px;

                    margin: 0 auto 15px;

                    border-radius: 50%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #e8f5ee;

                    color: #075b35;

                    font-size: 28px;

                }

                .logout-box h2 {

                    margin: 0 0 10px;

                    color: #222;

                }

                .logout-box p {

                    margin-bottom: 25px;

                    color: #666;

                }

                .logout-buttons {

                    display: flex;
                    gap: 12px;

                }

                .logout-buttons button {

                    flex: 1;

                    border: none;

                    padding: 12px;

                    border-radius: 8px;

                    cursor: pointer;

                    font-size: 15px;

                    font-weight: 600;

                }

                #cancelLogout {

                    background: #eee;
                    color: #333;

                }

                #confirmLogout {

                    background: #075b35;
                    color: white;

                }

            `;


            document.head.appendChild(
                style
            );


            document.body.appendChild(
                logoutModal
            );

        }


        logoutModal.style.display =
            "block";


        const cancelLogout =
            document.getElementById(
                "cancelLogout"
            );


        const confirmLogout =
            document.getElementById(
                "confirmLogout"
            );


        if (cancelLogout) {

            cancelLogout.onclick =
                function () {

                    logoutModal.style.display =
                        "none";

                };

        }


        if (confirmLogout) {

            confirmLogout.onclick =
                function () {

                    localStorage.removeItem(
                        CURRENT_USER_KEY
                    );


                    localStorage.removeItem(
                        LOGIN_STATUS_KEY
                    );


                    localStorage.removeItem(
                        CURRENT_PAGE_KEY
                    );


                    window.location.replace(
                        LOGIN_PAGE
                    );

                };

        }

    }


    /* =====================================================
       RESTORE LAST OPENED PAGE AFTER REFRESH
    ===================================================== */

    const savedPage =
        localStorage.getItem(
            CURRENT_PAGE_KEY
        );


    if (
        savedPage &&
        savedPage !== "dashboard" &&
        pageTitles[savedPage]
    ) {

        menuItems.forEach(
            function (item) {

                if (
                    item.getAttribute(
                        "data-page"
                    ) === savedPage
                ) {

                    item.classList.add(
                        "active"
                    );

                } else {

                    item.classList.remove(
                        "active"
                    );

                }

            }
        );


        if (headerTitle) {

            headerTitle.textContent =
                pageTitles[savedPage];

        }


        loadPage(
            savedPage
        );

    }

});
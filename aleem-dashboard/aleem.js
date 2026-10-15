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
        ".side-bar .menu-item"
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


    /*
       Make displayCurrentUser available to the
       settings section below.
    */

    window.displayCurrentUser =
        displayCurrentUser;


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


        /*
           Settings is handled directly inside
           this aleem.js file.
        */

        if (page === "settings") {

            return;

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



    /* =====================================================
       SETTINGS POPOVERS
    ===================================================== */

    const SETTINGS_KEY_PREFIX =
        "alAleemSettings_";


    function getSettingsUserKey() {

        const user =
            getCurrentUser();


        if (!user) {

            return "default";

        }


        return (
            user.id ||
            user.email ||
            user.phone ||
            "default"
        );

    }


    function getSettingsStorageKey() {

        return (
            SETTINGS_KEY_PREFIX +
            getSettingsUserKey()
        );

    }


    function getDefaultSettings() {

        return {

            schoolInformation: {

                schoolName:
                    "Al-Aleem Group of Schools",

                schoolAddress:
                    "",

                schoolPhone:
                    "",

                schoolEmail:
                    "",

                schoolMotto:
                    "Learning to Serve"

            },

            notifications: {

                newMessages:
                    true,

                studentUpdates:
                    true,

                attendanceAlerts:
                    true,

                systemNotifications:
                    false

            },

            systemSettings: {

                compactSidebar:
                    false,

                autoSave:
                    true,

                confirmBeforeLogout:
                    true,

                dashboardRefresh:
                    false

            }

        };

    }


    function getSavedSettings() {

        const defaults =
            getDefaultSettings();


        try {

            const saved =
                localStorage.getItem(
                    getSettingsStorageKey()
                );


            if (!saved) {

                return defaults;

            }


            const parsed =
                JSON.parse(saved);


            return {

                schoolInformation: {

                    ...defaults.schoolInformation,
                    ...(parsed.schoolInformation || {})

                },

                notifications: {

                    ...defaults.notifications,
                    ...(parsed.notifications || {})

                },

                systemSettings: {

                    ...defaults.systemSettings,
                    ...(parsed.systemSettings || {})

                }

            };

        } catch (error) {

            console.error(
                "Could not load settings:",
                error
            );


            return defaults;

        }

    }


    function saveSettings(settings) {

        try {

            localStorage.setItem(
                getSettingsStorageKey(),
                JSON.stringify(
                    settings
                )
            );


            return true;

        } catch (error) {

            console.error(
                "Could not save settings:",
                error
            );


            return false;

        }

    }


    let savedSettings =
        getSavedSettings();



    /* =====================================================
       CLOSE POPOVER
    ===================================================== */

    function closeSettingsPopover(
        popover
    ) {

        if (!popover) {
            return;
        }


        popover.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }



    /* =====================================================
       CLOSE ALL POPOVERS
    ===================================================== */

    function closeAllSettingsPopovers() {

        document
            .querySelectorAll(
                ".settings-popover-overlay.active"
            )
            .forEach(
                function (popover) {

                    popover.classList.remove(
                        "active"
                    );

                }
            );


        document.body.style.overflow =
            "";

    }



    /* =====================================================
       OPEN SETTINGS POPOVER
    ===================================================== */

    function openSettingsPopover(
        popoverId
    ) {

        const popover =
            document.getElementById(
                popoverId
            );


        if (!popover) {
            return;
        }


        closeAllSettingsPopovers();


        savedSettings =
            getSavedSettings();


        loadPopoverData(
            popoverId
        );


        popover.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }



    /* =====================================================
       LOAD POPOVER DATA
    ===================================================== */

    function loadPopoverData(
        popoverId
    ) {


        /* =========================================
           SCHOOL INFORMATION
        ========================================= */

        if (
            popoverId ===
            "schoolInformationPopover"
        ) {

            const school =
                savedSettings.schoolInformation;


            const inputs =
                document.querySelectorAll(
                    "#schoolInformationPopover input"
                );


            if (inputs[0]) {

                inputs[0].value =
                    school.schoolName || "";

            }


            if (inputs[1]) {

                inputs[1].value =
                    school.schoolAddress || "";

            }


            if (inputs[2]) {

                inputs[2].value =
                    school.schoolPhone || "";

            }


            if (inputs[3]) {

                inputs[3].value =
                    school.schoolEmail || "";

            }


            if (inputs[4]) {

                inputs[4].value =
                    school.schoolMotto || "";

            }

        }



        /* =========================================
           NOTIFICATIONS
        ========================================= */

        if (
            popoverId ===
            "notificationsPopover"
        ) {

            const notificationSettings =
                savedSettings.notifications;


            const checkboxes =
                document.querySelectorAll(
                    "#notificationsPopover input[type='checkbox']"
                );


            if (checkboxes[0]) {

                checkboxes[0].checked =
                    notificationSettings.newMessages;

            }


            if (checkboxes[1]) {

                checkboxes[1].checked =
                    notificationSettings.studentUpdates;

            }


            if (checkboxes[2]) {

                checkboxes[2].checked =
                    notificationSettings.attendanceAlerts;

            }


            if (checkboxes[3]) {

                checkboxes[3].checked =
                    notificationSettings.systemNotifications;

            }

        }



        /* =========================================
           SYSTEM SETTINGS
        ========================================= */

        if (
            popoverId ===
            "systemSettingsPopover"
        ) {

            const systemSettings =
                savedSettings.systemSettings;


            const checkboxes =
                document.querySelectorAll(
                    "#systemSettingsPopover input[type='checkbox']"
                );


            if (checkboxes[0]) {

                checkboxes[0].checked =
                    systemSettings.compactSidebar;

            }


            if (checkboxes[1]) {

                checkboxes[1].checked =
                    systemSettings.autoSave;

            }


            if (checkboxes[2]) {

                checkboxes[2].checked =
                    systemSettings.confirmBeforeLogout;

            }


            if (checkboxes[3]) {

                checkboxes[3].checked =
                    systemSettings.dashboardRefresh;

            }

        }

    }



    /* =====================================================
       SAVE POPOVER DATA
    ===================================================== */

    function saveSettingsPopover(
        popoverId,
        popover
    ) {

        if (!popover) {
            return;
        }


        savedSettings =
            getSavedSettings();



        /* =========================================
           SCHOOL INFORMATION
        ========================================= */

        if (
            popoverId ===
            "schoolInformationPopover"
        ) {

            const inputs =
                popover.querySelectorAll(
                    "input"
                );


            savedSettings.schoolInformation = {

                schoolName:
                    inputs[0]
                        ? inputs[0].value.trim()
                        : "",

                schoolAddress:
                    inputs[1]
                        ? inputs[1].value.trim()
                        : "",

                schoolPhone:
                    inputs[2]
                        ? inputs[2].value.trim()
                        : "",

                schoolEmail:
                    inputs[3]
                        ? inputs[3].value.trim()
                        : "",

                schoolMotto:
                    inputs[4]
                        ? inputs[4].value.trim()
                        : ""

            };


            if (
                saveSettings(
                    savedSettings
                )
            ) {

                closeSettingsPopover(
                    popover
                );

            }


            return;

        }



        /* =========================================
           NOTIFICATIONS
        ========================================= */

        if (
            popoverId ===
            "notificationsPopover"
        ) {

            const checkboxes =
                popover.querySelectorAll(
                    "input[type='checkbox']"
                );


            savedSettings.notifications = {

                newMessages:
                    checkboxes[0]
                        ? checkboxes[0].checked
                        : true,

                studentUpdates:
                    checkboxes[1]
                        ? checkboxes[1].checked
                        : true,

                attendanceAlerts:
                    checkboxes[2]
                        ? checkboxes[2].checked
                        : true,

                systemNotifications:
                    checkboxes[3]
                        ? checkboxes[3].checked
                        : false

            };


            if (
                saveSettings(
                    savedSettings
                )
            ) {

                closeSettingsPopover(
                    popover
                );

            }


            return;

        }



        /* =========================================
           SYSTEM SETTINGS
        ========================================= */

        if (
            popoverId ===
            "systemSettingsPopover"
        ) {

            const checkboxes =
                popover.querySelectorAll(
                    "input[type='checkbox']"
                );


            savedSettings.systemSettings = {

                compactSidebar:
                    checkboxes[0]
                        ? checkboxes[0].checked
                        : false,

                autoSave:
                    checkboxes[1]
                        ? checkboxes[1].checked
                        : true,

                confirmBeforeLogout:
                    checkboxes[2]
                        ? checkboxes[2].checked
                        : true,

                dashboardRefresh:
                    checkboxes[3]
                        ? checkboxes[3].checked
                        : false

            };


            if (
                saveSettings(
                    savedSettings
                )
            ) {

                closeSettingsPopover(
                    popover
                );

            }


            return;

        }

    }



    /* =====================================================
       SETTINGS CLICK HANDLER
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {


            /* =========================================
               OPEN POPOVER
            ========================================= */

            const settingsMenu =
                event.target.closest(
                    ".settings-menu[data-popover]"
                );


            if (settingsMenu) {

                const popoverId =
                    settingsMenu.getAttribute(
                        "data-popover"
                    );


                openSettingsPopover(
                    popoverId
                );


                return;

            }



            /* =========================================
               CLOSE BUTTON
            ========================================= */

            const closeButton =
                event.target.closest(
                    ".popover-close"
                );


            if (closeButton) {

                const popover =
                    closeButton.closest(
                        ".settings-popover-overlay"
                    );


                closeSettingsPopover(
                    popover
                );


                return;

            }



            /* =========================================
               CANCEL BUTTON
            ========================================= */

            const cancelButton =
                event.target.closest(
                    ".popover-cancel"
                );


            if (cancelButton) {

                const popover =
                    cancelButton.closest(
                        ".settings-popover-overlay"
                    );


                closeSettingsPopover(
                    popover
                );


                return;

            }



            /* =========================================
               SAVE BUTTON
            ========================================= */

            const saveButton =
                event.target.closest(
                    ".popover-save"
                );


            if (saveButton) {

                const popover =
                    saveButton.closest(
                        ".settings-popover-overlay"
                    );


                if (!popover) {
                    return;
                }


                saveSettingsPopover(
                    popover.id,
                    popover
                );


                return;

            }



            /* =========================================
               CLICK OUTSIDE
            ========================================= */

            if (
                event.target.classList.contains(
                    "settings-popover-overlay"
                )
            ) {

                closeSettingsPopover(
                    event.target
                );

                return;

            }

        }
    );



    /* =====================================================
       ESCAPE TO CLOSE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            closeAllSettingsPopovers();

        }
    );



    /* =====================================================
       PROFILE INFORMATION
    ===================================================== */

    function loadProfileInformation() {

        const user =
            getCurrentUser();


        if (!user) {
            return;
        }


        const userName =
            user.name ||
            user.fullname ||
            "Administrator";


        const userEmail =
            user.email ||
            "";


        const userPhone =
            user.phone ||
            "";


        const userRole =
            user.role ||
            "Administrator";


        const profileName =
            document.getElementById(
                "profileName"
            );


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );


        const profilePhone =
            document.getElementById(
                "profilePhone"
            );


        const profileRole =
            document.getElementById(
                "profileRole"
            );


        const settingsProfileName =
            document.getElementById(
                "settingsProfileName"
            );


        const settingsProfileImage =
            document.getElementById(
                "settingsProfileImage"
            );


        const settingsProfileDefault =
            document.getElementById(
                "settingsProfileDefault"
            );


        if (profileName) {

            profileName.value =
                userName;

        }


        if (profileEmail) {

            profileEmail.value =
                userEmail;

        }


        if (profilePhone) {

            profilePhone.value =
                userPhone;

        }


        if (profileRole) {

            profileRole.value =
                userRole;

        }


        if (settingsProfileName) {

            settingsProfileName.textContent =
                userName;

        }


        if (
            user.profilePicture &&
            settingsProfileImage &&
            settingsProfileDefault
        ) {

            settingsProfileImage.src =
                user.profilePicture;

            settingsProfileImage.style.display =
                "block";

            settingsProfileDefault.style.display =
                "none";

        } else if (
            settingsProfileImage &&
            settingsProfileDefault
        ) {

            settingsProfileImage.src =
                "";

            settingsProfileImage.style.display =
                "none";

            settingsProfileDefault.style.display =
                "block";

        }

    }



    /* =====================================================
       SAVE USER TO USERS ARRAY
    ===================================================== */

    function updateUserInUsersArray(
        updatedUser
    ) {

        try {

            const users =
                JSON.parse(
                    localStorage.getItem(
                        USERS_KEY
                    )
                ) || [];


            const userIndex =
                users.findIndex(
                    function (user) {

                        if (
                            updatedUser.id &&
                            user.id
                        ) {

                            return (
                                user.id ===
                                updatedUser.id
                            );

                        }


                        if (
                            updatedUser.email &&
                            user.email
                        ) {

                            return (
                                user.email ===
                                updatedUser.email
                            );

                        }


                        return false;

                    }
                );


            if (userIndex !== -1) {

                users[userIndex] = {

                    ...users[userIndex],
                    ...updatedUser

                };


                localStorage.setItem(
                    USERS_KEY,
                    JSON.stringify(
                        users
                    )
                );

            }

        } catch (error) {

            console.error(
                "Could not update user:",
                error
            );

        }

    }



    /* =====================================================
       PROFILE SAVE
    ===================================================== */

    const saveProfileBtn =
        document.getElementById(
            "saveProfileBtn"
        );


    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            function () {

                const user =
                    getCurrentUser();


                if (!user) {
                    return;
                }


                const profileName =
                    document.getElementById(
                        "profileName"
                    );


                const profileEmail =
                    document.getElementById(
                        "profileEmail"
                    );


                const profilePhone =
                    document.getElementById(
                        "profilePhone"
                    );


                const profileRole =
                    document.getElementById(
                        "profileRole"
                    );


                if (profileName) {

                    user.name =
                        profileName.value.trim();

                }


                if (profileEmail) {

                    user.email =
                        profileEmail.value.trim();

                }


                if (profilePhone) {

                    user.phone =
                        profilePhone.value.trim();

                }


                if (profileRole) {

                    user.role =
                        profileRole.value;

                }


                localStorage.setItem(
                    CURRENT_USER_KEY,
                    JSON.stringify(
                        user
                    )
                );


                updateUserInUsersArray(
                    user
                );


                displayCurrentUser();


                loadProfileInformation();

            }
        );

    }



    /* =====================================================
       CANCEL PROFILE
    ===================================================== */

    const cancelProfileBtn =
        document.getElementById(
            "cancelProfileBtn"
        );


    if (cancelProfileBtn) {

        cancelProfileBtn.addEventListener(
            "click",
            function () {

                loadProfileInformation();

            }
        );

    }



    /* =====================================================
       PROFILE PICTURE
    ===================================================== */

    const changePictureBtn =
        document.getElementById(
            "changePictureBtn"
        );


    const profilePictureInput =
        document.getElementById(
            "profilePictureInput"
        );


    if (
        changePictureBtn &&
        profilePictureInput
    ) {

        changePictureBtn.addEventListener(
            "click",
            function () {

                profilePictureInput.click();

            }
        );

    }


    if (profilePictureInput) {

        profilePictureInput.addEventListener(
            "change",
            function () {

                const file =
                    profilePictureInput.files[0];


                if (!file) {
                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        const user =
                            getCurrentUser();


                        if (!user) {
                            return;
                        }


                        const imageData =
                            event.target.result;


                        user.profilePicture =
                            imageData;


                        localStorage.setItem(
                            CURRENT_USER_KEY,
                            JSON.stringify(
                                user
                            )
                        );


                        updateUserInUsersArray(
                            user
                        );


                        displayCurrentUser();


                        loadProfileInformation();

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }



    /* =====================================================
       LOAD PROFILE WHEN SETTINGS PAGE IS INSERTED
       DYNAMICALLY
    ===================================================== */

    setTimeout(
        function () {

            loadProfileInformation();

        },
        100
    );



    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    window.addEventListener(
        "storage",
        function () {

            savedSettings =
                getSavedSettings();

            loadProfileInformation();

            displayCurrentUser();

        }
    );

});

// =====================================================
// STAT CARD POPOVERS
// =====================================================


// STUDENTS
const studentStatCard = document.getElementById("studentStatCard");
const studentPopover = document.getElementById("studentPopover");
const closeStudentPopover = document.getElementById("closeStudentPopover");


// TEACHERS
const teacherStatCard = document.getElementById("teacherStatCard");
const teacherPopover = document.getElementById("teacherPopover");
const closeTeacherPopover = document.getElementById("closeTeacherPopover");


// COURSES
const courseStatCard = document.getElementById("courseStatCard");
const coursePopover = document.getElementById("coursePopover");
const closeCoursePopover = document.getElementById("closeCoursePopover");




// =====================================================
// CLOSE ALL POPOVERS
// =====================================================

function closeAllStatPopovers() {

    if (studentPopover) {
        studentPopover.classList.remove("show");
    }

    if (teacherPopover) {
        teacherPopover.classList.remove("show");
    }

    if (coursePopover) {
        coursePopover.classList.remove("show");
    }

}




// =====================================================
// STUDENT POPOVER
// =====================================================

if (studentStatCard && studentPopover) {

    studentStatCard.addEventListener("click", function (event) {

        event.stopPropagation();


        // Check if this popover is already open
        const isOpen = studentPopover.classList.contains("show");


        // Close every popover first
        closeAllStatPopovers();


        // Open this one only if it was closed
        if (!isOpen) {

            studentPopover.classList.add("show");

        }

    });


    // Prevent clicks inside popover from closing it
    studentPopover.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}




// CLOSE STUDENT POPOVER WITH X

if (closeStudentPopover) {

    closeStudentPopover.addEventListener("click", function (event) {

        event.stopPropagation();

        studentPopover.classList.remove("show");

    });

}




// =====================================================
// TEACHER POPOVER
// =====================================================

if (teacherStatCard && teacherPopover) {

    teacherStatCard.addEventListener("click", function (event) {

        event.stopPropagation();


        // Check if this popover is already open
        const isOpen = teacherPopover.classList.contains("show");


        // Close every popover first
        closeAllStatPopovers();


        // Open this one only if it was closed
        if (!isOpen) {

            teacherPopover.classList.add("show");

        }

    });


    // Prevent clicks inside popover from closing it
    teacherPopover.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}




// CLOSE TEACHER POPOVER WITH X

if (closeTeacherPopover) {

    closeTeacherPopover.addEventListener("click", function (event) {

        event.stopPropagation();

        teacherPopover.classList.remove("show");

    });

}




// =====================================================
// COURSE POPOVER
// =====================================================

if (courseStatCard && coursePopover) {

    courseStatCard.addEventListener("click", function (event) {

        event.stopPropagation();


        // Check if this popover is already open
        const isOpen = coursePopover.classList.contains("show");


        // Close every popover first
        closeAllStatPopovers();


        // Open this one only if it was closed
        if (!isOpen) {

            coursePopover.classList.add("show");

        }

    });


    // Prevent clicks inside popover from closing it
    coursePopover.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}




// CLOSE COURSE POPOVER WITH X

if (closeCoursePopover) {

    closeCoursePopover.addEventListener("click", function (event) {

        event.stopPropagation();

        coursePopover.classList.remove("show");

    });

}




// =====================================================
// CLICK ANYWHERE OUTSIDE TO CLOSE ALL POPOVERS
// =====================================================

document.addEventListener("click", function () {

    closeAllStatPopovers();

});



/* =====================================================
   ACADEMIC CALENDAR
===================================================== */

const calendarMonth = document.getElementById("calendarMonth");
const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");
const calendarDates = document.querySelector(".calendar-dates");


// GET TODAY'S REAL DATE
const today = new Date();


// START WITH CURRENT MONTH AND YEAR
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();


// MONTH NAMES
const monthNames = [
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



/* =====================================================
   CREATE CALENDAR
===================================================== */

function renderCalendar() {

    if (!calendarMonth || !calendarDates) {
        return;
    }


    // SHOW CURRENT MONTH AND YEAR
    calendarMonth.textContent =
        monthNames[currentMonth] + " " + currentYear;


    // UPDATE "May 2024" UNDER ACADEMIC CALENDAR
    const calendarCard = document.querySelector(".calendar-card");

    if (calendarCard) {

        const cardDate = calendarCard.querySelector(".card-heading p");

        if (cardDate) {

            cardDate.textContent =
                monthNames[currentMonth] + " " + currentYear;

        }

    }


    // REMOVE OLD DATES
    calendarDates.innerHTML = "";


    // FIRST DAY OF MONTH
    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    );


    // NUMBER OF DAYS IN CURRENT MONTH
    const daysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();


    // NUMBER OF DAYS IN PREVIOUS MONTH
    const daysInPreviousMonth = new Date(
        currentYear,
        currentMonth,
        0
    ).getDate();



    /* =================================================
       CALENDAR STARTS ON MONDAY
    ================================================= */

    let startingDay = firstDay.getDay();


    if (startingDay === 0) {

        startingDay = 6;

    } else {

        startingDay = startingDay - 1;

    }



    /* =================================================
       PREVIOUS MONTH DATES
    ================================================= */

    for (let i = startingDay; i > 0; i--) {

        const span = document.createElement("span");

        span.textContent =
            daysInPreviousMonth - i + 1;

        span.classList.add("other-month");

        calendarDates.appendChild(span);

    }



    /* =================================================
       CURRENT MONTH DATES
    ================================================= */

    for (let day = 1; day <= daysInMonth; day++) {

        const span = document.createElement("span");

        span.textContent = day;


        const thisDate = new Date(
            currentYear,
            currentMonth,
            day
        );



        /* =============================================
           HIGHLIGHT TODAY
        ============================================= */

        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {

            span.classList.add("today");

        }



        /* =============================================
           SUNDAY = HOLIDAY
        ============================================= */

        if (thisDate.getDay() === 0) {

            span.classList.add("holiday");

        }


        calendarDates.appendChild(span);

    }



    /* =================================================
       NEXT MONTH DATES
    ================================================= */

    const totalUsed =
        startingDay + daysInMonth;


    let totalCalendarCells;


    if (totalUsed <= 35) {

        totalCalendarCells = 35;

    } else {

        totalCalendarCells = 42;

    }


    const remaining =
        totalCalendarCells - totalUsed;


    for (let day = 1; day <= remaining; day++) {

        const span = document.createElement("span");

        span.textContent = day;

        span.classList.add("other-month");

        calendarDates.appendChild(span);

    }

}



/* =====================================================
   PREVIOUS MONTH BUTTON
===================================================== */

if (previousMonth) {

    previousMonth.addEventListener("click", function () {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

    });

}



/* =====================================================
   NEXT MONTH BUTTON
===================================================== */

if (nextMonth) {

    nextMonth.addEventListener("click", function () {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        renderCalendar();

    });

}



/* =====================================================
   SHOW CURRENT CALENDAR WHEN PAGE LOADS
===================================================== */

renderCalendar();


setInterval(function () {

    const now = new Date();

    // If the real date has changed
    if (
        now.getDate() !== today.getDate() ||
        now.getMonth() !== today.getMonth() ||
        now.getFullYear() !== today.getFullYear()
    ) {

        // Update today's stored date
        today.setTime(now.getTime());

        // Return calendar to the current real month
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();

        // Redraw calendar
        renderCalendar();

    }

}, 60000);





/* =====================================================
   PRIMARY TEACHERS POPOVER
===================================================== */

document.addEventListener("click", function (event) {

    const primaryTeacherCard =
        event.target.closest("#primaryTeacherCard");

    const primaryTeachersPopover =
        document.getElementById("primaryTeachersPopover");


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    const closeButton =
        event.target.closest("#closePrimaryTeachersPopover");


    if (closeButton) {

        event.preventDefault();
        event.stopPropagation();

        if (primaryTeachersPopover) {

            primaryTeachersPopover.classList.remove("show");

        }

        return;

    }


    /* =================================================
       CLICK INSIDE POPOVER
    ================================================= */

    if (
        event.target.closest("#primaryTeachersPopover")
    ) {

        event.stopPropagation();

        return;

    }


    /* =================================================
       CLICK PRIMARY TEACHER CARD
    ================================================= */

    if (primaryTeacherCard && primaryTeachersPopover) {

        event.stopPropagation();

        primaryTeachersPopover.classList.toggle("show");

        return;

    }


    /* =================================================
       CLICK ANYWHERE OUTSIDE
    ================================================= */

    if (primaryTeachersPopover) {

        primaryTeachersPopover.classList.remove("show");

    }

});



/* =====================================================
   SECONDARY TEACHERS POPOVER
===================================================== */

document.addEventListener("click", function (event) {

    const secondaryTeacherCard =
        event.target.closest("#secondaryTeacherCard");

    const secondaryTeachersPopover =
        document.getElementById("secondaryTeachersPopover");


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    const closeButton =
        event.target.closest("#closeSecondaryTeachersPopover");


    if (closeButton) {

        event.preventDefault();
        event.stopPropagation();

        if (secondaryTeachersPopover) {

            secondaryTeachersPopover.classList.remove("show");

        }

        return;

    }


    /* =================================================
       CLICK INSIDE POPOVER
    ================================================= */

    if (
        event.target.closest("#secondaryTeachersPopover")
    ) {

        event.stopPropagation();

        return;

    }


    /* =================================================
       CLICK SECONDARY TEACHER CARD
    ================================================= */

    if (secondaryTeacherCard && secondaryTeachersPopover) {

        event.stopPropagation();

        secondaryTeachersPopover.classList.toggle("show");

        return;

    }


    /* =================================================
       CLICK ANYWHERE OUTSIDE
    ================================================= */

    if (secondaryTeachersPopover) {

        secondaryTeachersPopover.classList.remove("show");

    }

});


/* =====================================================
   DEPARTMENT POPOVER
===================================================== */

document.addEventListener("click", function (event) {

    const departmentCard =
        event.target.closest(".department");

    const departmentPopover =
        document.querySelector(".department-popover");

    const closeButton =
        event.target.closest(".close-department-popover");


    /* CLOSE BUTTON */

    if (closeButton) {

        event.preventDefault();
        event.stopPropagation();

        if (departmentPopover) {
            departmentPopover.classList.remove("show");
        }

        return;
    }


    /* CLICK INSIDE POPOVER */

    if (event.target.closest(".department-popover")) {

        event.stopPropagation();

        return;
    }


    /* CLICK DEPARTMENT CARD */

    if (departmentCard && departmentPopover) {

        event.stopPropagation();

        departmentPopover.classList.toggle("show");

        return;
    }


    /* CLICK ANYWHERE OUTSIDE */

    if (departmentPopover) {

        departmentPopover.classList.remove("show");

    }

});
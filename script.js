// ================================
// DATA
// ================================

let balance =
    Number(localStorage.getItem("balance")) || 0;


let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


let settings =
    JSON.parse(localStorage.getItem("settings")) || {

        currency: "₹",

        deleteConfirmation: true,

        theme: "light"

    };


// ================================
// ELEMENTS
// ================================

const balanceElement =
    document.getElementById("balance");

const balanceBox =
    document.querySelector(".balance-box");

const balanceStatus =
    document.getElementById("balanceStatus");


const moneyForm =
    document.getElementById("moneyForm");

const expenseForm =
    document.getElementById("expenseForm");


const moneyInput =
    document.getElementById("moneyInput");

const expenseInput =
    document.getElementById("expenseInput");

const descriptionInput =
    document.getElementById("descriptionInput");


const transactionList =
    document.getElementById("transactionList");

const fullTransactionList =
    document.getElementById("fullTransactionList");


const homePage =
    document.getElementById("homePage");

const historyPage =
    document.getElementById("historyPage");

const settingsPage =
    document.getElementById("settingsPage");


const homeNavBtn =
    document.getElementById("homeNavBtn");

const historyNavBtn =
    document.getElementById("historyNavBtn");

const settingsNavBtn =
    document.getElementById("settingsNavBtn");


const currencySelect =
    document.getElementById("currencySelect");

const deleteConfirmToggle =
    document.getElementById("deleteConfirmToggle");


// ================================
// INITIAL LOAD
// ================================

applyTheme();

loadSettings();

showBalance();

showTransactions();


// ================================
// HOME NAVIGATION
// ================================

homeNavBtn.addEventListener("click", function () {

    showPage("home");

});


historyNavBtn.addEventListener("click", function () {

    showPage("history");

});


settingsNavBtn.addEventListener("click", function () {

    showPage("settings");

});


// ================================
// PAGE NAVIGATION
// ================================

function showPage(page) {

    homePage.classList.add("hidden");

    historyPage.classList.add("hidden");

    settingsPage.classList.add("hidden");


    homeNavBtn.classList.remove("active");

    historyNavBtn.classList.remove("active");

    settingsNavBtn.classList.remove("active");


    if (page === "home") {

        homePage.classList.remove("hidden");

        homeNavBtn.classList.add("active");

    }


    if (page === "history") {

        historyPage.classList.remove("hidden");

        historyNavBtn.classList.add("active");

        showFullHistory();

    }


    if (page === "settings") {

        settingsPage.classList.remove("hidden");

        settingsNavBtn.classList.add("active");

    }

}


// ================================
// HEADER MENU
// ================================

document
    .getElementById("menuBtn")
    .addEventListener("click", function () {

        showPage("settings");

    });


// ================================
// BACK BUTTONS
// ================================

document
    .getElementById("historyBackBtn")
    .addEventListener("click", function () {

        showPage("home");

    });


document
    .getElementById("settingsBackBtn")
    .addEventListener("click", function () {

        showPage("home");

    });


// ================================
// ADD MONEY FORM
// ================================

document
    .getElementById("addMoneyBtn")
    .addEventListener("click", function () {

        moneyForm.classList.toggle("show");

        expenseForm.classList.remove("show");

    });


// ================================
// EXPENSE FORM
// ================================

document
    .getElementById("addExpenseBtn")
    .addEventListener("click", function () {

        expenseForm.classList.toggle("show");

        moneyForm.classList.remove("show");

    });


// ================================
// SAVE MONEY
// ================================

document
    .getElementById("saveMoneyBtn")
    .addEventListener("click", function () {

        let money =
            Number(moneyInput.value);


        if (money <= 0) {

            alert("Please enter a valid amount.");

            return;

        }


        balance =
            balance + money;


        transactions.push({

            id: Date.now(),

            type: "income",

            amount: money,

            description: "Money Added",

            date: new Date().toISOString()

        });


        saveData();

        showBalance();

        showTransactions();


        moneyInput.value = "";

        moneyForm.classList.remove("show");

    });


// ================================
// SAVE EXPENSE
// ================================

document
    .getElementById("saveExpenseBtn")
    .addEventListener("click", function () {

        let expense =
            Number(expenseInput.value);


        let description =
            descriptionInput.value.trim();


        if (expense <= 0) {

            alert("Please enter a valid amount.");

            return;

        }


        if (description === "") {

            alert("Please enter what you spent on.");

            return;

        }


        // Expense is allowed to exceed balance

        balance =
            balance - expense;


        transactions.push({

            id: Date.now(),

            type: "expense",

            amount: expense,

            description: description,

            date: new Date().toISOString()

        });


        saveData();

        showBalance();

        showTransactions();


        expenseInput.value = "";

        descriptionInput.value = "";

        expenseForm.classList.remove("show");

    });


// ================================
// SHOW BALANCE
// ================================

function showBalance() {

    let amount =
        Math.abs(balance)
            .toLocaleString("en-IN");


    if (balance < 0) {

        balanceElement.innerText =
            "-" + settings.currency + amount;


        balanceBox.classList.add("negative");


        balanceStatus.innerText =
            "You have overspent";

    } else {

        balanceElement.innerText =
            settings.currency + amount;


        balanceBox.classList.remove("negative");


        balanceStatus.innerText =
            "Your current balance";

    }

}


// ================================
// DATE + TIME
// ================================

function formatDate(dateString) {

    let date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    )
    +
    " • "
    +
    date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ================================
// TRANSACTION HTML
// ================================

function createTransactionHTML(transaction, showDelete) {

    let amount =
        transaction.amount.toLocaleString("en-IN");


    let deleteButton = "";


    if (showDelete) {

        deleteButton = `
            <button
                class="delete-transaction-btn"
                data-id="${transaction.id}"
                title="Delete"
            >
                🗑
            </button>
        `;

    }


    if (transaction.type === "expense") {

        return `

            <div class="transaction">

                <div class="transaction-left">

                    <div class="transaction-icon expense">
                        −
                    </div>

                    <div class="transaction-info">

                        <p>${escapeHTML(transaction.description)}</p>

                        <small>
                            ${formatDate(transaction.date)}
                        </small>

                    </div>

                </div>


                <div>

                    <span class="transaction-amount expense">
                        -${settings.currency}${amount}
                    </span>

                    ${deleteButton}

                </div>

            </div>

        `;

    }


    return `

        <div class="transaction">

            <div class="transaction-left">

                <div class="transaction-icon income">
                    +
                </div>

                <div class="transaction-info">

                    <p>Money Added</p>

                    <small>
                        ${formatDate(transaction.date)}
                    </small>

                </div>

            </div>


            <div>

                <span class="transaction-amount income">
                    +${settings.currency}${amount}
                </span>

                ${deleteButton}

            </div>

        </div>

    `;

}


// ================================
// SHOW RECENT TRANSACTIONS
// ================================

function showTransactions() {

    transactionList.innerHTML = "";


    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <p class="empty-message">
                No transactions yet
            </p>

        `;

        return;

    }


    let recent =
        transactions
            .slice()
            .reverse()
            .slice(0, 5);


    recent.forEach(function (transaction) {

        transactionList.innerHTML +=
            createTransactionHTML(
                transaction,
                false
            );

    });

}


// ================================
// SHOW FULL HISTORY
// ================================

function showFullHistory() {

    fullTransactionList.innerHTML = "";


    if (transactions.length === 0) {

        fullTransactionList.innerHTML = `

            <p class="empty-message">
                No transactions yet
            </p>

        `;

        return;

    }


    transactions
        .slice()
        .reverse()
        .forEach(function (transaction) {

            fullTransactionList.innerHTML +=
                createTransactionHTML(
                    transaction,
                    true
                );

        });


    addDeleteListeners();

}


// ================================
// DELETE TRANSACTION
// ================================

function addDeleteListeners() {

    let buttons =
        document.querySelectorAll(
            ".delete-transaction-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                let id =
                    Number(
                        button.getAttribute("data-id")
                    );


                if (settings.deleteConfirmation) {

                    let confirmDelete =
                        confirm(
                            "Delete this transaction?"
                        );


                    if (!confirmDelete) {

                        return;

                    }

                }


                let transaction =
                    transactions.find(
                        function (item) {

                            return item.id === id;

                        }
                    );


                if (!transaction) {

                    return;

                }


                // Reverse transaction effect

                if (transaction.type === "expense") {

                    balance =
                        balance + transaction.amount;

                } else {

                    balance =
                        balance - transaction.amount;

                }


                transactions =
                    transactions.filter(
                        function (item) {

                            return item.id !== id;

                        }
                    );


                saveData();

                showBalance();

                showTransactions();

                showFullHistory();

            }
        );

    });

}


// ================================
// CLEAR ALL HISTORY
// ================================

document
    .getElementById("clearHistoryBtn")
    .addEventListener("click", function () {

        if (transactions.length === 0) {

            alert("There is no history to clear.");

            return;

        }


        let confirmClear =
            confirm(
                "Clear all transaction history?"
            );


        if (!confirmClear) {

            return;

        }


        transactions = [];


        saveData();

        showTransactions();

        showFullHistory();

    });


// ================================
// RESET BALANCE
// ================================

document
    .getElementById("resetBalanceBtn")
    .addEventListener("click", function () {

        let confirmReset =
            confirm(
                "Reset balance to ₹0?\n\nYour transaction history will remain."
            );


        if (!confirmReset) {

            return;

        }


        balance = 0;


        saveData();

        showBalance();

        showPage("home");

    });


// ================================
// SETTINGS
// ================================


// Currency

currencySelect.addEventListener(
    "change",
    function () {

        settings.currency =
            currencySelect.value;


        saveSettings();

        showBalance();

        showTransactions();

    }
);


// Delete Confirmation

deleteConfirmToggle.addEventListener(
    "change",
    function () {

        settings.deleteConfirmation =
            deleteConfirmToggle.checked;


        saveSettings();

    }
);


// ================================
// THEME
// ================================

document
    .querySelectorAll(".theme-btn")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                let theme =
                    button.getAttribute("data-theme");


                settings.theme = theme;


                saveSettings();

                applyTheme();

            }
        );

    });


// ================================
// APPLY THEME
// ================================

function applyTheme() {

    document.body.classList.remove("dark");


    if (settings.theme === "dark") {

        document.body.classList.add("dark");

    }


    if (settings.theme === "system") {

        if (
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {

            document.body.classList.add("dark");

        }

    }


    updateThemeButtons();

}


// ================================
// THEME BUTTON ACTIVE STATE
// ================================

function updateThemeButtons() {

    document
        .querySelectorAll(".theme-btn")
        .forEach(function (button) {

            button.classList.remove("active");


            if (
                button.getAttribute("data-theme")
                ===
                settings.theme
            ) {

                button.classList.add("active");

            }

        });

}


// ================================
// LOAD SETTINGS
// ================================

function loadSettings() {

    currencySelect.value =
        settings.currency;


    deleteConfirmToggle.checked =
        settings.deleteConfirmation;

}


// ================================
// RESET COMPLETE APP
// ================================

document
    .getElementById("resetAppBtn")
    .addEventListener("click", function () {

        let confirmReset =
            confirm(
                "Reset everything?\n\nThis will delete your balance and all transaction history."
            );


        if (!confirmReset) {

            return;

        }


        balance = 0;

        transactions = [];


        localStorage.removeItem("balance");

        localStorage.removeItem("transactions");


        saveData();

        showBalance();

        showTransactions();

        showPage("home");


        alert("App data has been reset.");

    });


// ================================
// SAVE DATA
// ================================

function saveData() {

    localStorage.setItem(
        "balance",
        balance
    );


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ================================
// SAVE SETTINGS
// ================================

function saveSettings() {

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );

}


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    let div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ================================
// SYSTEM THEME CHANGE
// ================================

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function () {

        if (settings.theme === "system") {

            applyTheme();

        }

    });
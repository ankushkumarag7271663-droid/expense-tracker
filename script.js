// =====================================================
// MY MONEY - MULTIPLE KHATA SYSTEM
// =====================================================


// ================= DATA =================

let khatas = JSON.parse(localStorage.getItem("khatas")) || [];

let selectedKhataId =
    localStorage.getItem("selectedKhataId") || null;

let settings =
    JSON.parse(localStorage.getItem("settings")) || {
        currency: "₹",
        deleteConfirmation: true,
        theme: "light"
    };


// ================= OLD DATA MIGRATION =================

function migrateOldData() {

    const oldBalance = localStorage.getItem("balance");
    const oldTransactions = localStorage.getItem("transactions");

    if (
        khatas.length === 0 &&
        (oldBalance !== null || oldTransactions !== null)
    ) {

        let transactions = [];

        try {
            transactions = JSON.parse(oldTransactions) || [];
        } catch {
            transactions = [];
        }

        const balance = Number(oldBalance) || 0;

        const newKhata = {
            id: Date.now().toString(),
            name: "My Khata",
            balance: balance,
            transactions: transactions
        };

        khatas.push(newKhata);

        selectedKhataId = newKhata.id;

        saveKhatas();

        localStorage.setItem(
            "selectedKhataId",
            selectedKhataId
        );

        localStorage.removeItem("balance");
        localStorage.removeItem("transactions");
    }
}

migrateOldData();


// ================= ELEMENTS =================

const khataPage =
    document.getElementById("khataPage");

const homePage =
    document.getElementById("homePage");

const historyPage =
    document.getElementById("historyPage");

const settingsPage =
    document.getElementById("settingsPage");

const khataList =
    document.getElementById("khataList");

const selectedKhataName =
    document.getElementById("selectedKhataName");

const balanceElement =
    document.getElementById("balance");

const balanceBox =
    document.getElementById("balanceBox");

const balanceStatus =
    document.getElementById("balanceStatus");

const transactionList =
    document.getElementById("transactionList");

const fullTransactionList =
    document.getElementById("fullTransactionList");

const historyKhataName =
    document.getElementById("historyKhataName");

const moneyForm =
    document.getElementById("moneyForm");

const expenseForm =
    document.getElementById("expenseForm");

const moneyInput =
    document.getElementById("moneyInput");

const moneyDescriptionInput =
    document.getElementById("moneyDescriptionInput");

const expenseInput =
    document.getElementById("expenseInput");

const descriptionInput =
    document.getElementById("descriptionInput");

const currencySelect =
    document.getElementById("currencySelect");

const deleteConfirmToggle =
    document.getElementById("deleteConfirmToggle");

const khataModal =
    document.getElementById("khataModal");

const khataModalTitle =
    document.getElementById("khataModalTitle");

const khataNameInput =
    document.getElementById("khataNameInput");

const startingBalanceInput =
    document.getElementById("startingBalanceInput");

const saveKhataBtn =
    document.getElementById("saveKhataBtn");

const khataActionsModal =
    document.getElementById("khataActionsModal");

const actionKhataName =
    document.getElementById("actionKhataName");


let editingKhataId = null;
let actionKhataId = null;


// ================= STORAGE =================

function saveKhatas() {

    localStorage.setItem(
        "khatas",
        JSON.stringify(khatas)
    );
}


function saveSettings() {

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );
}


// ================= HELPERS =================

function getSelectedKhata() {

    return khatas.find(
        khata =>
            String(khata.id) ===
            String(selectedKhataId)
    ) || null;
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function formatMoney(amount) {

    const value =
        Math.abs(Number(amount)).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    if (Number(amount) < 0) {
        return "-" + settings.currency + value;
    }

    return settings.currency + value;
}


function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }) + " • " +
    date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ================= INITIAL LOAD =================

loadSettings();
applyTheme();

if (
    selectedKhataId &&
    getSelectedKhata()
) {
    openKhata(selectedKhataId);
} else {
    showKhataList();
}


// ================= NAVIGATION =================

document
    .getElementById("homeNavBtn")
    .addEventListener("click", () => {

        if (getSelectedKhata()) {
            showPage("home");
        } else {
            showKhataList();
        }
    });


document
    .getElementById("historyNavBtn")
    .addEventListener("click", () => {

        if (!getSelectedKhata()) {

            showKhataList();

            alert("Please select a khata first.");

            return;
        }

        showPage("history");
    });


document
    .getElementById("settingsNavBtn")
    .addEventListener("click", () => {

        showPage("settings");
    });


document
    .getElementById("menuBtn")
    .addEventListener("click", () => {

        showPage("settings");
    });


document
    .getElementById("historyBackBtn")
    .addEventListener("click", () => {

        showPage("home");
    });


document
    .getElementById("settingsBackBtn")
    .addEventListener("click", () => {

        if (getSelectedKhata()) {
            showPage("home");
        } else {
            showKhataList();
        }
    });


document
    .getElementById("khataBackBtn")
    .addEventListener("click", () => {

        showKhataList();
    });


function showPage(page) {

    khataPage.classList.add("hidden");
    homePage.classList.add("hidden");
    historyPage.classList.add("hidden");
    settingsPage.classList.add("hidden");

    document
        .getElementById("homeNavBtn")
        .classList.remove("active");

    document
        .getElementById("historyNavBtn")
        .classList.remove("active");

    document
        .getElementById("settingsNavBtn")
        .classList.remove("active");


    if (page === "home") {

        if (!getSelectedKhata()) {

            showKhataList();

            return;
        }

        homePage.classList.remove("hidden");

        document
            .getElementById("homeNavBtn")
            .classList.add("active");

        renderSelectedKhata();
    }


    if (page === "history") {

        if (!getSelectedKhata()) {

            showKhataList();

            alert("Please select a khata first.");

            return;
        }

        historyPage.classList.remove("hidden");

        document
            .getElementById("historyNavBtn")
            .classList.add("active");

        showFullHistory();
    }


    if (page === "settings") {

        settingsPage.classList.remove("hidden");

        document
            .getElementById("settingsNavBtn")
            .classList.add("active");

        loadSettings();
    }
}


// ================= KHATA LIST =================

function showKhataList() {

    selectedKhataId = null;

    localStorage.removeItem(
        "selectedKhataId"
    );

    khataPage.classList.remove("hidden");
    homePage.classList.add("hidden");
    historyPage.classList.add("hidden");
    settingsPage.classList.add("hidden");

    document
        .getElementById("homeNavBtn")
        .classList.add("active");

    document
        .getElementById("historyNavBtn")
        .classList.remove("active");

    document
        .getElementById("settingsNavBtn")
        .classList.remove("active");

    showKhatas();
}


function showKhatas() {

    khataList.innerHTML = "";

    if (khatas.length === 0) {

        khataList.innerHTML = `
            <div class="empty-khata">

                <div>📒</div>

                <h3>No Khata Yet</h3>

                <p>
                    Create your first khata to
                    start tracking money.
                </p>

            </div>
        `;

        return;
    }


    khatas.forEach(khata => {

        const card =
            document.createElement("div");

        card.className = "khata-card";

        card.innerHTML = `

            <button
                class="khata-card-main"
                data-id="${khata.id}"
            >

                <div class="khata-icon">
                    📒
                </div>

                <div class="khata-card-info">

                    <strong>
                        ${escapeHTML(khata.name)}
                    </strong>

                    <small>
                        ${khata.transactions.length}
                        transaction${khata.transactions.length === 1 ? "" : "s"}
                    </small>

                </div>

                <div class="khata-card-balance ${
                    khata.balance < 0
                        ? "negative-text"
                        : ""
                }">

                    ${formatMoney(khata.balance)}

                </div>

            </button>


            <button
                class="khata-more-btn"
                data-id="${khata.id}"
            >
                ⋮
            </button>
        `;

        khataList.appendChild(card);
    });


    document
        .querySelectorAll(".khata-card-main")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => openKhata(button.dataset.id)
            );
        });


    document
        .querySelectorAll(".khata-more-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openKhataActions(
                        button.dataset.id
                    );
                }
            );
        });
}


// ================= OPEN KHATA =================

function openKhata(id) {

    selectedKhataId = String(id);

    localStorage.setItem(
        "selectedKhataId",
        selectedKhataId
    );

    showPage("home");
}


// ================= KHATA CREATE =================

document
    .getElementById("addKhataBtn")
    .addEventListener(
        "click",
        openCreateKhata
    );


document
    .getElementById("createKhataMainBtn")
    .addEventListener(
        "click",
        openCreateKhata
    );


function openCreateKhata() {

    editingKhataId = null;

    khataModalTitle.textContent =
        "Add New Khata";

    saveKhataBtn.textContent =
        "Create Khata";

    khataNameInput.value = "";

    startingBalanceInput.value = "";

    startingBalanceInput.style.display =
        "block";

    khataModal.classList.remove("hidden");

    setTimeout(
        () => khataNameInput.focus(),
        100
    );
}


// ================= SAVE KHATA =================

saveKhataBtn.addEventListener(
    "click",
    saveKhata
);


function saveKhata() {

    const name =
        khataNameInput.value.trim();


    if (!name) {

        alert("Please enter a khata name.");

        return;
    }


    // EDIT
    if (editingKhataId) {

        const khata =
            khatas.find(
                item =>
                    String(item.id) ===
                    String(editingKhataId)
            );

        if (khata) {

            khata.name = name;

            saveKhatas();

            closeKhataModal();

            if (
                String(selectedKhataId) ===
                String(khata.id)
            ) {
                renderSelectedKhata();
            } else {
                showKhatas();
            }
        }

        return;
    }


    // CREATE
    let startingBalance =
        Number(startingBalanceInput.value) || 0;


    if (startingBalance < 0) {

        alert(
            "Starting balance cannot be negative."
        );

        return;
    }


    const newKhata = {

        id: Date.now().toString(),

        name: name,

        balance: startingBalance,

        transactions: []
    };


    if (startingBalance > 0) {

        newKhata.transactions.push({

            id:
                Date.now().toString() +
                "-start",

            type: "income",

            amount: startingBalance,

            description:
                "Starting Balance",

            date:
                new Date().toISOString()
        });
    }


    khatas.push(newKhata);

    saveKhatas();

    closeKhataModal();

    openKhata(newKhata.id);
}


// ================= CLOSE KHATA MODAL =================

document
    .getElementById("closeKhataModal")
    .addEventListener(
        "click",
        closeKhataModal
    );


function closeKhataModal() {

    khataModal.classList.add("hidden");

    editingKhataId = null;

    startingBalanceInput.style.display =
        "block";
}


// ================= KHATA ACTIONS =================

document
    .getElementById("khataMenuBtn")
    .addEventListener(
        "click",
        () => {

            const khata =
                getSelectedKhata();

            if (khata) {
                openKhataActions(khata.id);
            }
        }
    );


function openKhataActions(id) {

    const khata =
        khatas.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!khata) return;

    actionKhataId =
        String(id);

    actionKhataName.textContent =
        khata.name;

    khataActionsModal.classList.remove(
        "hidden"
    );
}


// CLOSE ACTION MODAL

document
    .getElementById("closeActionsModal")
    .addEventListener(
        "click",
        closeKhataActions
    );


function closeKhataActions() {

    khataActionsModal.classList.add(
        "hidden"
    );

    actionKhataId = null;
}


// EDIT KHATA

document
    .getElementById("editKhataBtn")
    .addEventListener(
        "click",
        () => {

            if (!actionKhataId) return;

            const id =
                actionKhataId;

            closeKhataActions();

            openEditKhata(id);
        }
    );


function openEditKhata(id) {

    const khata =
        khatas.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!khata) return;

    editingKhataId =
        String(id);

    khataModalTitle.textContent =
        "Edit Khata";

    saveKhataBtn.textContent =
        "Save Changes";

    khataNameInput.value =
        khata.name;

    startingBalanceInput.style.display =
        "none";

    khataModal.classList.remove(
        "hidden"
    );

    setTimeout(
        () => khataNameInput.focus(),
        100
    );
}


// DELETE KHATA

document
    .getElementById("deleteKhataBtn")
    .addEventListener(
        "click",
        deleteKhata
    );


function deleteKhata() {

    if (!actionKhataId) return;

    const khata =
        khatas.find(
            item =>
                String(item.id) ===
                String(actionKhataId)
        );

    if (!khata) return;


    const confirmed =
        confirm(
            `Delete "${khata.name}"?\n\n` +
            `This will permanently delete ` +
            `this khata and all its transactions.`
        );


    if (!confirmed) return;


    khatas =
        khatas.filter(
            item =>
                String(item.id) !==
                String(actionKhataId)
        );


    saveKhatas();

    closeKhataActions();

    selectedKhataId = null;

    localStorage.removeItem(
        "selectedKhataId"
    );

    showKhataList();
}


// ================= SELECTED KHATA =================

function renderSelectedKhata() {

    const khata =
        getSelectedKhata();

    if (!khata) {

        showKhataList();

        return;
    }


    selectedKhataName.textContent =
        khata.name;

    showBalance();

    showTransactions();
}


// ================= ADD MONEY FORM =================

document
    .getElementById("addMoneyBtn")
    .addEventListener(
        "click",
        () => {

            moneyForm.classList.toggle(
                "hidden"
            );

            expenseForm.classList.add(
                "hidden"
            );

            if (
                !moneyForm.classList.contains(
                    "hidden"
                )
            ) {
                moneyInput.focus();
            }
        }
    );


document
    .getElementById("cancelMoneyBtn")
    .addEventListener(
        "click",
        () => {

            moneyForm.classList.add(
                "hidden"
            );

            moneyInput.value = "";

            moneyDescriptionInput.value = "";
        }
    );


// ================= ADD MONEY =================

document
    .getElementById("saveMoneyBtn")
    .addEventListener(
        "click",
        addMoney
    );


function addMoney() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    const amount =
        Number(moneyInput.value);


    if (
        !amount ||
        amount <= 0
    ) {

        alert("Please enter a valid amount.");

        return;
    }


    const description =
        moneyDescriptionInput
            .value
            .trim();


    khata.balance += amount;


    khata.transactions.push({

        id:
            Date.now().toString(),

        type:
            "income",

        amount:
            amount,

        description:
            description ||
            "Money Added",

        date:
            new Date().toISOString()
    });


    saveKhatas();

    moneyInput.value = "";

    moneyDescriptionInput.value = "";

    moneyForm.classList.add(
        "hidden"
    );

    renderSelectedKhata();

    showKhatas();
}


// ================= EXPENSE FORM =================

document
    .getElementById("addExpenseBtn")
    .addEventListener(
        "click",
        () => {

            expenseForm.classList.toggle(
                "hidden"
            );

            moneyForm.classList.add(
                "hidden"
            );

            if (
                !expenseForm.classList.contains(
                    "hidden"
                )
            ) {
                expenseInput.focus();
            }
        }
    );


document
    .getElementById("cancelExpenseBtn")
    .addEventListener(
        "click",
        () => {

            expenseForm.classList.add(
                "hidden"
            );

            expenseInput.value = "";

            descriptionInput.value = "";
        }
    );


// ================= ADD EXPENSE =================

document
    .getElementById("saveExpenseBtn")
    .addEventListener(
        "click",
        addExpense
    );


function addExpense() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    const amount =
        Number(expenseInput.value);


    if (
        !amount ||
        amount <= 0
    ) {

        alert("Please enter a valid amount.");

        return;
    }


    const description =
        descriptionInput
            .value
            .trim();


    if (!description) {

        alert(
            "Please enter what you spent on."
        );

        return;
    }


    // Negative balance is allowed
    khata.balance -= amount;


    khata.transactions.push({

        id:
            Date.now().toString(),

        type:
            "expense",

        amount:
            amount,

        description:
            description,

        date:
            new Date().toISOString()
    });


    saveKhatas();

    expenseInput.value = "";

    descriptionInput.value = "";

    expenseForm.classList.add(
        "hidden"
    );

    renderSelectedKhata();

    showKhatas();
}


// ================= BALANCE =================

function showBalance() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    balanceElement.textContent =
        formatMoney(khata.balance);


    if (khata.balance < 0) {

        balanceBox.classList.add(
            "negative"
        );

        balanceStatus.textContent =
            "You have overspent";

    } else {

        balanceBox.classList.remove(
            "negative"
        );

        balanceStatus.textContent =
            "Your current balance";
    }
}


// ================= TRANSACTION HTML =================

function createTransactionHTML(
    transaction,
    showDelete
) {

    const isIncome =
        transaction.type === "income";


    return `

        <div class="transaction">

            <div class="transaction-left">

                <div class="
                    transaction-icon
                    ${isIncome ? "income" : "expense"}
                ">

                    ${isIncome ? "+" : "−"}

                </div>


                <div class="transaction-info">

                    <p>
                        ${escapeHTML(
                            transaction.description ||
                            (isIncome
                                ? "Money Added"
                                : "Expense")
                        )}
                    </p>

                    <small>
                        ${formatDate(
                            transaction.date
                        )}
                    </small>

                </div>

            </div>


            <div class="transaction-right">

                <span class="
                    transaction-amount
                    ${isIncome ? "income" : "expense"}
                ">

                    ${isIncome ? "+" : "-"}
                    ${formatMoney(transaction.amount)}

                </span>


                ${
                    showDelete
                        ? `
                        <button
                            class="delete-transaction-btn"
                            data-id="${transaction.id}"
                        >
                            🗑
                        </button>
                        `
                        : ""
                }

            </div>

        </div>
    `;
}


// ================= RECENT TRANSACTIONS =================

function showTransactions() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    transactionList.innerHTML = "";


    const transactions =
        [...khata.transactions]
            .reverse()
            .slice(0, 5);


    if (transactions.length === 0) {

        transactionList.innerHTML =
            `<p class="empty-message">
                No transactions yet
            </p>`;

        return;
    }


    transactions.forEach(
        transaction => {

            transactionList.innerHTML +=
                createTransactionHTML(
                    transaction,
                    false
                );
        }
    );
}


// ================= FULL HISTORY =================

document
    .getElementById("viewHistoryBtn")
    .addEventListener(
        "click",
        () => showPage("history")
    );


function showFullHistory() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    historyKhataName.textContent =
        khata.name;


    fullTransactionList.innerHTML = "";


    const transactions =
        [...khata.transactions]
            .reverse();


    if (transactions.length === 0) {

        fullTransactionList.innerHTML =
            `<p class="empty-message">
                No transactions yet
            </p>`;

        return;
    }


    transactions.forEach(
        transaction => {

            fullTransactionList.innerHTML +=
                createTransactionHTML(
                    transaction,
                    true
                );
        }
    );


    addDeleteListeners();
}


// ================= DELETE TRANSACTION =================

function addDeleteListeners() {

    document
        .querySelectorAll(
            ".delete-transaction-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteTransaction(
                        button.dataset.id
                    );
                }
            );
        });
}


function deleteTransaction(id) {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    const transaction =
        khata.transactions.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!transaction) return;


    if (
        settings.deleteConfirmation
    ) {

        const confirmed =
            confirm(
                "Delete this transaction?"
            );

        if (!confirmed) return;
    }


    if (
        transaction.type === "income"
    ) {

        khata.balance -=
            transaction.amount;

    } else {

        khata.balance +=
            transaction.amount;
    }


    khata.transactions =
        khata.transactions.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveKhatas();

    showBalance();

    showTransactions();

    showFullHistory();

    showKhatas();
}


// ================= CLEAR HISTORY =================

document
    .getElementById("clearHistoryBtn")
    .addEventListener(
        "click",
        clearHistory
    );


function clearHistory() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    if (
        khata.transactions.length === 0
    ) {

        alert(
            "There is no history to clear."
        );

        return;
    }


    const confirmed =
        confirm(
            `Clear all history from "${khata.name}"?\n\n` +
            `Your current balance will NOT change.`
        );


    if (!confirmed) return;


    khata.transactions = [];

    saveKhatas();

    showTransactions();

    showFullHistory();

    showKhatas();
}


// ================= RESET BALANCE =================

document
    .getElementById("resetBalanceBtn")
    .addEventListener(
        "click",
        resetBalance
    );


function resetBalance() {

    const khata =
        getSelectedKhata();

    if (!khata) return;


    const confirmed =
        confirm(
            `Reset "${khata.name}" balance to ${settings.currency}0?\n\n` +
            `Transaction history will remain.`
        );


    if (!confirmed) return;


    khata.balance = 0;

    saveKhatas();

    showBalance();

    showTransactions();

    showKhatas();
}


// ================= SETTINGS =================

function loadSettings() {

    currencySelect.value =
        settings.currency;

    deleteConfirmToggle.checked =
        settings.deleteConfirmation;

    updateThemeButtons();
}


currencySelect.addEventListener(
    "change",
    () => {

        settings.currency =
            currencySelect.value;

        saveSettings();

        renderSelectedKhata();

        showKhatas();

        if (
            !historyPage.classList.contains(
                "hidden"
            )
        ) {
            showFullHistory();
        }
    }
);


deleteConfirmToggle.addEventListener(
    "change",
    () => {

        settings.deleteConfirmation =
            deleteConfirmToggle.checked;

        saveSettings();
    }
);


// ================= THEME =================

document
    .querySelectorAll(".theme-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                settings.theme =
                    button.dataset.theme;

                saveSettings();

                applyTheme();
            }
        );
    });


function applyTheme() {

    document.body.classList.remove(
        "dark"
    );


    if (
        settings.theme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );
    }


    if (
        settings.theme === "system" &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {

        document.body.classList.add(
            "dark"
        );
    }


    updateThemeButtons();
}


function updateThemeButtons() {

    document
        .querySelectorAll(".theme-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.theme ===
                settings.theme
            );
        });
}


window
    .matchMedia(
        "(prefers-color-scheme: dark)"
    )
    .addEventListener(
        "change",
        () => {

            if (
                settings.theme ===
                "system"
            ) {
                applyTheme();
            }
        }
    );


// ================= RESET APP =================

document
    .getElementById("resetAppBtn")
    .addEventListener(
        "click",
        resetApp
    );


function resetApp() {

    const confirmed =
        confirm(
            "Reset everything?\n\n" +
            "This will delete ALL Khatas, " +
            "balances and transactions."
        );


    if (!confirmed) return;


    khatas = [];

    selectedKhataId = null;


    localStorage.removeItem(
        "khatas"
    );

    localStorage.removeItem(
        "selectedKhataId"
    );

    localStorage.removeItem(
        "balance"
    );

    localStorage.removeItem(
        "transactions"
    );


    showKhataList();


    alert(
        "App data has been reset."
    );
}


// ================= MODAL OUTSIDE CLICK =================

khataModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            khataModal
        ) {
            closeKhataModal();
        }
    }
);


khataActionsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            khataActionsModal
        ) {
            closeKhataActions();
        }
    }
);


// ================= ENTER KEY =================

khataNameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {
            saveKhata();
        }
    }
);
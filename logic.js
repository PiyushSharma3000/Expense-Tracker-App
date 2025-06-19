// =====================
// STEP 1: Grab HTML elements
// =====================
const categoryselect = document.getElementById("categoryselect");
const amountinput = document.getElementById("amountinput");
const dateinput = document.getElementById("dateinput");
const addbtn = document.getElementById("addbtn");
const expensetablebody = document.getElementById("expensetablebody");
const totalamountcell = document.getElementById("totalamount");

// =====================
// STEP 2: Setup variables
// =====================
let expenses = []; // List of all expense objects
let totalamount = 0; // Running total

// =====================
// STEP 3: Load existing expenses from localStorage
// =====================
const savedExpenses = localStorage.getItem("expenses");
if (savedExpenses) {
    expenses = JSON.parse(savedExpenses); // Convert from string to array
    expenses.forEach(expense => {
        totalamount += expense.amount;
        showExpenseInTable(expense); // Show each one in the table
    });
    totalamountcell.textContent = totalamount.toFixed(2); // Show total
}

// =====================
// STEP 4: Function to update localStorage
// =====================
function updateLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// =====================
// STEP 5: Add button click handler
// =====================
addbtn.addEventListener("click", () => {
    // Get the text shown in the dropdown (like "Rent", not "rent")
    const category = categoryselect.options[categoryselect.selectedIndex].text;
    const amount = parseFloat(amountinput.value); // convert to number
    const date = dateinput.value;

    // === VALIDATIONS ===
    if (!categoryselect.value) return alert("Please Select a Category");
    if (isNaN(amount) || amount <= 0) return alert("Please Enter a Valid Amount");
    if (!date) return alert("Please Select a Date");

    const today = new Date();
    const selecteddate = new Date(date);

    // Remove time part
    today.setHours(0, 0, 0, 0);
    selecteddate.setHours(0, 0, 0, 0);

    if (selecteddate > today) return alert("Date Cannot be in the Future");

    // === CREATE NEW EXPENSE OBJECT ===
    const expense = {
        id: Date.now(), // Unique ID using timestamp
        category,
        amount,
        date
    };

    // Add to array, update total, save
    expenses.push(expense);
    totalamount += amount;
    totalamountcell.textContent = totalamount.toFixed(2);
    updateLocalStorage();
    showExpenseInTable(expense);

    // Clear fields
    resetInputs();
});

function resetInputs() {
    categoryselect.value = "";
    amountinput.value = "";
    dateinput.value = "";
}

// =====================
// STEP 6: Show expense in table
// =====================
function showExpenseInTable(expense) {
    const newrow = expensetablebody.insertRow();

    const categorycell = newrow.insertCell();
    const amountcell = newrow.insertCell();
    const datecell = newrow.insertCell();
    const deletecell = newrow.insertCell();

    categorycell.textContent = expense.category;
    amountcell.textContent = expense.amount.toFixed(2);
    datecell.textContent = expense.date;

    // Delete Button
    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.classList.add("deletebtn");

    // Delete Logic
    deletebtn.addEventListener("click", () => {
        expenses = expenses.filter(e => e.id !== expense.id); // remove from array
        totalamount -= expense.amount;
        totalamountcell.textContent = totalamount.toFixed(2);
        expensetablebody.removeChild(newrow); // remove row
        updateLocalStorage(); // update localStorage
    });

    deletecell.appendChild(deletebtn);
}

// =====================
// STEP 7: Add expense on Enter key
// =====================
document.addEventListener("keypress", (e) => {
    const isInputField =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "SELECT";

    if (e.key === "Enter" && isInputField) {
        e.preventDefault(); // Stop date picker or form submit
        addbtn.click(); // Trigger Add button click
    }
});

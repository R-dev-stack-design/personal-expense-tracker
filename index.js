const transactionForm = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transactionList");
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpensesElement = document.getElementById("totalExpenses");
const totalBalanceElement = document.getElementById("totalBalance");
const totalSavingsElement = document.getElementById("totalSavings");
const transactionCountElement = document.getElementById("transactionCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const cancelEditButton = document.getElementById("cancelEditButton");


let transactions = []
let editingTransactionId = null;

const savedTransactions = localStorage.getItem("transactions");

if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

transactionForm.addEventListener("submit", function(event){
 event.preventDefault();
 const description = descriptionInput.value;
 const amount = Number(amountInput.value);
 const type = typeInput.value;
 const category = categoryInput.value;
 const date = dateInput.value;

 const transaction = {
    id: editingTransactionId !== null ? editingTransactionId : Date.now(),
    description: description,
    amount: amount,
    type:type,
    category: category,
    date: date
};

if (editingTransactionId === null) {
    transactions.push(transaction);
} else {
    transactions = transactions.map(function(item) {
        if (item.id === editingTransactionId) {
            return transaction;
        }
        return item;
    });

    editingTransactionId = null;
    document.getElementById("addTransactionButton").textContent = "Add Transaction";
    cancelEditButton.style.display = "none";
}

localStorage.setItem("transactions", JSON.stringify(transactions));

displayTransactions();
calculateIncome();
calculateExpenses();
calculateBalance();
calculateSavings();
transactionForm.reset();
});
function displayTransactions(transactionArray = transactions) {
    transactionList.innerHTML = "";
    transactionCountElement.textContent = `(${transactionArray.length})`;

    transactionArray.forEach(function(transaction){
        const transactionItem = document.createElement("div");
        if (transaction.type === "income"){
            console.log("This is an income");
        }else {
            console.log("This is an expense");
        }
    
    transactionItem.innerHTML = `
    <h3>${transaction.description}</h3>
    <p>₹${transaction.amount}</p>
    <p>Type: ${transaction.type}</p>
    <p>${transaction.category}</p>
    <p>${transaction.date}</p>
    <button class="edit-button">Edit</button>
    <button class="delete-button">Delete</button>
`;
        transactionList.appendChild(transactionItem);

    const editButton = transactionItem.querySelector(".edit-button");

    editButton.addEventListener("click", function() {
    editingTransactionId = transaction.id;

    document.getElementById("addTransactionButton").textContent = "Update Transaction";
    cancelEditButton.style.display = "block";
    
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;
});
    const deletebutton = transactionItem.querySelector(".delete-button");
    deletebutton.addEventListener("click", function(){
    transactions = transactions.filter(function(item){
    return item.id !== transaction.id;
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    displayTransactions();
    calculateIncome();
    calculateExpenses();
    calculateBalance();
    calculateSavings();
       });
    
    });
}
displayTransactions();

cancelEditButton.addEventListener("click", function() {
    editingTransactionId = null;

    transactionForm.reset();

    document.getElementById("addTransactionButton").textContent = "Add Transaction";

    cancelEditButton.style.display = "none";
});

searchInput.addEventListener("input", function() {
    filterAndSortTransactions();
});

categoryFilter.addEventListener("change", function() {
    filterAndSortTransactions();
});

sortFilter.addEventListener("change", function() {
    filterAndSortTransactions();
});

function filterAndSortTransactions() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filteredTransactions = transactions.filter(function(transaction) {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
    filteredTransactions.sort(function(a, b) {
    if (sortFilter.value === "newest") {
        return new Date(b.date) - new Date(a.date);
    } else {
        return new Date(a.date) - new Date(b.date);
    }
});

    displayTransactions(filteredTransactions);
}

function calculateIncome(){
let totalIncome = 0;
transactions.forEach(function(transaction){
if(transaction.type ==="income"){
totalIncome = totalIncome + transaction.amount
 }
});
totalIncomeElement.textContent = `₹${totalIncome}`;
}

function calculateExpenses(){
    let totalExpenses  = 0;
    transactions.forEach(function(transaction){
    if(transaction.type ==="expense"){
        totalExpenses = totalExpenses+transaction.amount
        
    }
});
totalExpensesElement.textContent = `₹${totalExpenses}`;
}
function calculateBalance (){
let totalIncome = 0;
let totalExpenses = 0;

transactions.forEach(function(transaction){
if (transaction.type ==="income"){
    totalIncome = totalIncome + transaction.amount;
}else{
    totalExpenses = totalExpenses + transaction.amount;
}
});
const balance = totalIncome - totalExpenses;
totalBalanceElement.textContent = `₹${balance}`;
}
function calculateSavings(){
    let totalIncome = 0;
    let totalExpenses = 0;
 transactions.forEach(function(transaction){
    if (transaction.type ==="income"){
totalIncome = totalIncome + transaction.amount;
}else{
        totalExpenses = totalExpenses + transaction.amount;
    }
 });
 const savings = totalIncome - totalExpenses;
totalSavingsElement.textContent = `₹${savings}`;
}
displayTransactions();
calculateIncome();
calculateExpenses();
calculateBalance();
calculateSavings()
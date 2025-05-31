// Set username
document.getElementById("username").textContent = "Wasim Akram";

// Navigation
function navigate(action) {
  switch (action) {
    case "add":
      openModal();
      break;
    case "view":
      window.location.href = "view.html";
      break;
    case "visualization":
      window.location.href = "visualization.html";
      break;
    case "report":
      window.location.href = "report.html";
      break;
  }
}


// Modal controls
function openModal() {
  document.getElementById("transactionModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("transactionModal").style.display = "none";
}

// Close modal on outside click
window.onclick = function (event) {
  const modal = document.getElementById("transactionModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Form submit handler
function submitTransaction(e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const paymentMode = document.getElementById("paymentMode").value;

  if (!date || !description || isNaN(amount) || !type || !paymentMode) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const newTransaction = { date, description, amount, type, paymentMode };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions();     // Show latest list with delete buttons
  updateSummary();           // Refresh totals

  const message = document.getElementById("successMessage");
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
  }, 3000);

  closeModal();
  document.getElementById("transactionForm").reset();
}

// Utility to update totals
function updateSummary() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let income = 0, expense = 0;

  transactions.forEach(tx => {
    if (tx.type === "income") income += tx.amount;
    if (tx.type === "expense") expense += tx.amount;
  });

  document.getElementById("income").textContent = income.toFixed(2);
  document.getElementById("expense").textContent = expense.toFixed(2);
  document.getElementById("balance").textContent = (income - expense).toFixed(2);
}

// Display transaction list with delete buttons (on home)
function displayTransactions() {
  const listContainer = document.getElementById("transactions");
  if (!listContainer) return; // Prevent error if not defined

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  listContainer.innerHTML = "";

  transactions.forEach((tx, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${tx.date} | ${tx.description} | ₹${tx.amount.toFixed(2)} | ${tx.type} | ${tx.paymentMode}
      <button onclick="deleteTransaction(${index})" style="margin-left:10px;">Delete</button>
    `;
    listContainer.appendChild(li);
  });
}

// Delete a transaction and update totals
function deleteTransaction(index) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  if (index >= 0 && index < transactions.length) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
    updateSummary();
  }
}

// Initial load
displayTransactions();
updateSummary();

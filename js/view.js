
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function renderTransactions() {
      const search = document.getElementById("searchInput").value.toLowerCase();
      const type = document.getElementById("typeFilter").value;
      const payment = document.getElementById("paymentFilter").value;
      const sort = document.getElementById("sortBy").value;

      let filtered = transactions.filter(tx =>
        (!type || tx.type === type) &&
        (!payment || tx.paymentMode === payment) &&
        (!search || tx.description.toLowerCase().includes(search))
      );

      // Sorting
      if (sort === "dateAsc") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (sort === "dateDesc") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sort === "month") {
        filtered.sort((a, b) =>
          new Date(a.date).getMonth() - new Date(b.date).getMonth()
        );
      }

      const tableBody = document.getElementById("transactionTableBody");
      tableBody.innerHTML = "";

      filtered.forEach((tx, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tx.date}</td>
          <td>${tx.description}</td>
          <td>₹${tx.amount.toFixed(2)}</td>
          <td>${tx.type}</td>
          <td>${tx.paymentMode}</td>
          <td>
            <button class="btn-edit" onclick="editTransaction(${index})">Edit</button>
            <button class="btn-delete" onclick="deleteTransaction(${index})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }

    function editTransaction(index) {
      const tx = transactions[index];
      const newDate = prompt("Edit Date:", tx.date);
      if (!newDate) return;

      const newDesc = prompt("Edit Description:", tx.description);
      if (!newDesc) return;

      const newAmount = parseFloat(prompt("Edit Amount:", tx.amount));
      if (isNaN(newAmount)) return;

      const newType = prompt("Edit Type (income/expense):", tx.type);
      if (!["income", "expense"].includes(newType)) return;

      const newPayment = prompt("Edit Payment Mode (cash/online/card):", tx.paymentMode);
      if (!["cash", "online", "card"].includes(newPayment)) return;

      transactions[index] = {
        date: newDate,
        description: newDesc,
        amount: newAmount,
        type: newType,
        paymentMode: newPayment
      };

      localStorage.setItem("transactions", JSON.stringify(transactions));
      renderTransactions();
    }

    function deleteTransaction(index) {
      if (confirm("Are you sure you want to delete this transaction?")) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
      }
    }

    renderTransactions();

    function editTransaction(index) {
  const tx = transactions[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("editDate").value = tx.date;
  document.getElementById("editDescription").value = tx.description;
  document.getElementById("editAmount").value = tx.amount;
  document.getElementById("editType").value = tx.type;
  document.getElementById("editPayment").value = tx.paymentMode;

  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function updateTransaction(e) {
  e.preventDefault();

  const index = parseInt(document.getElementById("editIndex").value);
  const updated = {
    date: document.getElementById("editDate").value,
    description: document.getElementById("editDescription").value,
    amount: parseFloat(document.getElementById("editAmount").value),
    type: document.getElementById("editType").value,
    paymentMode: document.getElementById("editPayment").value
  };

  transactions[index] = updated;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  closeEditModal();
  renderTransactions();
}

// Optional: Close modal on outside click
window.onclick = function(e) {
  if (e.target.id === "editModal") {
    closeEditModal();
  }
};


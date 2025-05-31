
function generateReport() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const preset = document.getElementById("preset").value;
  const paymentFilter = document.getElementById("paymentFilter").value;
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let startDate, endDate;

  if (preset) {
    const now = new Date();
    if (preset === "weekly") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
    } else if (preset === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }
  } else if (start && end) {
    startDate = new Date(start);
    endDate = new Date(end);
  } else {
    alert("Please select either a preset or both start and end dates.");
    return;
  }

  let income = 0, expense = 0;

  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    const withinRange = txDate >= startDate && txDate <= endDate;
    const matchesPayment = !paymentFilter || tx.paymentMode === paymentFilter;

    if (withinRange && matchesPayment) {
      if (tx.type === "income") income += tx.amount;
      else if (tx.type === "expense") expense += tx.amount;
    }
  });

  document.getElementById("reportIncome").textContent = income.toFixed(2);
  document.getElementById("reportExpense").textContent = expense.toFixed(2);
  document.getElementById("reportBalance").textContent = (income - expense).toFixed(2);
}

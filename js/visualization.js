
let chartInstance = null;
Chart.defaults.font.size = 14;

function renderChart() {
  const ctx = document.getElementById("chartCanvas").getContext("2d");
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const chartType = document.getElementById("chartType").value;
  const timeFilter = document.getElementById("timeFilter").value;

  const now = new Date();
  let filtered = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    if (timeFilter === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return txDate >= weekAgo && txDate <= now;
    } else if (timeFilter === "monthly") {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    } else if (timeFilter === "yearly") {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true; // all time
  });

  if (chartInstance) chartInstance.destroy();

  
if (chartType === "pie-desc") {
  const descriptionTotals = {};
  filtered.forEach(tx => {
    if (tx.type === "expense") {
      if (!descriptionTotals[tx.description]) {
        descriptionTotals[tx.description] = 0;
      }
      descriptionTotals[tx.description] += tx.amount;
    }
  });

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(descriptionTotals),
      datasets: [{
        data: Object.values(descriptionTotals),
        backgroundColor: Object.keys(descriptionTotals).map((_, i) =>
          `hsl(${(i * 360) / Object.keys(descriptionTotals).length}, 70%, 60%)`
        )
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Expenses by Description"
        }
      }
    }
  });
}
else if (chartType === "pie") {
    const summary = { cash: 0, online: 0, card: 0 };
    filtered.forEach(tx => {
      if (tx.type === "expense") summary[tx.paymentMode] += tx.amount;
    });

    chartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Cash", "Online", "Card"],
        datasets: [{
          data: [summary.cash, summary.online, summary.card],
          backgroundColor: ["#dc3545", "#007bff", "#ffc107"]
        }]
      }
    });

  } 
else if (chartType === "bar-desc") {
  const descTotals = {};
  filtered.forEach(tx => {
    if (tx.type === "expense") {
      if (!descTotals[tx.description]) {
        descTotals[tx.description] = 0;
      }
      descTotals[tx.description] += tx.amount;
    }
  });

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(descTotals),
      datasets: [{
        label: "Expense Amount",
        data: Object.values(descTotals),
        backgroundColor: "#ff6f61"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Amount vs Description"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
else if (chartType === "bar") {
    const income = new Array(12).fill(0);
    const expense = new Array(12).fill(0);

    filtered.forEach(tx => {
      const month = new Date(tx.date).getMonth();
      if (tx.type === 'income') income[month] += tx.amount;
      else if (tx.type === 'expense') expense[month] += tx.amount;
    });

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          { label: "Income", data: income, backgroundColor: "#28a745" },
          { label: "Expense", data: expense, backgroundColor: "#dc3545" }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

else if (chartType === "bar-desc") {
  const descTotals = {};
  filtered.forEach(tx => {
    if (tx.type === "expense") {
      if (!descTotals[tx.description]) {
        descTotals[tx.description] = 0;
      }
      descTotals[tx.description] += tx.amount;
    }
  });

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(descTotals),
      datasets: [{
        label: "Expense Amount",
        data: Object.values(descTotals),
        backgroundColor: "#ff6f61"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Amount vs Description"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
}

window.onload = renderChart;

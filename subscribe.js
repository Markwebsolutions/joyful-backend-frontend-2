const subscribeUrl = "http://localhost:8080/subscription";

window.onload = () => {
  loadSubscriptions();
};
function formatDate(dateStr) {
  const isoString = dateStr.replace(" ", "T");
  const date = new Date(isoString);
  if (isNaN(date)) return "Invalid Date";
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadSubscriptions() {
  const res = await fetch(subscribeUrl);
  const data = await res.json();
  const tableBody = document.getElementById("subscribeTableBody");
  tableBody.innerHTML = "";
  document.getElementById(
    "generalEnquiryCount"
  ).textContent = `Total Subscription: ${data.length}`;

  data.forEach((s) => {
    const row = document.createElement("div");
    row.classList.add("grid-row");
    row.setAttribute("data-id", s.subid);
    row.innerHTML = `
      <div>${s.email}</div>
      <div>${formatDate(s.date)}</div>
      <div>
        <button class="delete-btn" onclick="deleteSubscription(${
          s.subid
        })">Delete</button>
      </div>
    `;
    tableBody.appendChild(row);
  });
}

async function deleteSubscription(id) {
  if (!confirm("Delete this subscription?")) return;
  const res = await fetch(
    `http://localhost:8080/deletesubscription?subid=${id}`,
    {
      method: "DELETE",
    }
  );
  if (res.ok) loadSubscriptions();
  else alert("Failed to delete");
}

async function deleteAllSubscriptions() {
  if (!confirm("Delete all subscriptions?")) return;
  const res = await fetch(`http://localhost:8080/deleteAllSubscription`, {
    method: "DELETE",
  });
  if (res.ok) loadSubscriptions();
  else alert("Failed to delete all");
}

function searchSubscribe() {
  const input = document
    .getElementById("searchSubscribeInput")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#subscribeTableBody .grid-row");

  rows.forEach((row) => {
    const email = row.children[0].textContent.toLowerCase();
    row.style.display = email.includes(input) ? "grid" : "none";
  });
}

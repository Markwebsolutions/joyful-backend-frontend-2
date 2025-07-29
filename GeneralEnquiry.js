const enquiryUrl = "https://joyfulbackend-production.up.railway.app/all-query";

window.onload = () => {
  getAllGeneralEnquiries();
};

let allEnquiries = [];

async function getAllGeneralEnquiries() {
  try {
    const res = await fetch(enquiryUrl);
    allEnquiries = await res.json();

    document.getElementById(
      "generalEnquiryCount"
    ).textContent = `Total General Enquiries: ${allEnquiries.length}`;

    renderEnquiries(allEnquiries);
  } catch (err) {
    console.error("Error loading general enquiries:", err);
    alert("Failed to load general enquiries.");
  }
}

function renderEnquiries(enquiries) {
  const tbody = document.getElementById("enquiryTableBody");
  tbody.innerHTML = "";

  enquiries.forEach((enquiry) => {
    const row = document.createElement("div");
    row.className = "table-row";

    row.innerHTML = `
      <div>${enquiry.firstname}</div>
      <div>${enquiry.lastname}</div>
      <div>${enquiry.email}</div>
      <div>${enquiry.phone || "-"}</div>
      <div>${enquiry.querytype || "-"}</div>
      <div>${enquiry.message}</div>
      <div>
        <button onclick="deleteEnquiry(${enquiry.contactid})">Delete</button>
      </div>
    `;

    tbody.appendChild(row);
  });
}

function filterEnquiries() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allEnquiries.filter((enquiry) => {
    return (
      enquiry.firstname.toLowerCase().includes(query) ||
      enquiry.lastname.toLowerCase().includes(query) ||
      enquiry.email.toLowerCase().includes(query) ||
      (enquiry.message && enquiry.message.toLowerCase().includes(query))
    );
  });

  renderEnquiries(filtered);
}

async function deleteAllGeneralEnquiries() {
  const confirmDelete = confirm(
    "Are you sure you want to delete all enquiries?"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch("https://joyfulbackend-production.up.railway.app/deleteAllGeneralEnquiry", {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete all");

    alert("All general enquiries deleted successfully.");
    getAllGeneralEnquiries();
  } catch (err) {
    console.error("Error deleting all:", err);
    alert("Failed to delete all enquiries.");
  }
}

async function deleteEnquiry(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this enquiry?"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(`https://joyfulbackend-production.up.railway.app/delete-query/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("Deleted successfully.");
    getAllGeneralEnquiries();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete enquiry.");
  }
}

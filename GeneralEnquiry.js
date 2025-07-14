const enquiryUrl =
  "https://joyful-backend-backend-final-4-production.up.railway.app/all-query";

window.onload = () => {
  getAllGeneralEnquiries();
};

async function getAllGeneralEnquiries() {
  try {
    const res = await fetch(enquiryUrl);
    const enquiries = await res.json();

    document.getElementById(
      "generalEnquiryCount"
    ).textContent = `Total Enquiries: ${enquiries.length}`;

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
  } catch (err) {
    console.error("Error loading general enquiries:", err);
    alert("Failed to load general enquiries.");
  }
}

async function deleteEnquiry(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this enquiry?"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `https://joyful-backend-backend-final-4-production.up.railway.app/delete-query/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Delete failed");

    alert("Deleted successfully.");
    getAllGeneralEnquiries();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete enquiry.");
  }
}

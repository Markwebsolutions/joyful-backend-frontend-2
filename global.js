const categoryUrl =
  "https://joyfulbackend-production.up.railway.app/categories";
const subcategoryUrl =
  "https://joyfulbackend-production.up.railway.app/subcategories";
const productUrl =
  "https://joyfulbackend-production.up.railway.app/products";
const enquiryUrl =
  "https://joyfulbackend-production.up.railway.app/enquiries";

const generalEnquiryUrl =
  "https://joyfulbackend-production.up.railway.app/all-query";
async function loadCategoryCount() {
  try {
    const res = await fetch(categoryUrl);
    const data = await res.json();
    document.getElementById(
      "categoryCount"
    ).textContent = `Categories: ${data.length}`;
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

async function loadSubcategoryCount() {
  try {
    const res = await fetch(subcategoryUrl);
    const data = await res.json();
    document.getElementById(
      "subcategoryCount"
    ).textContent = `Subcategories: ${data.length}`;
  } catch (error) {
    console.error("Failed to load subcategories:", error);
  }
}

async function loadProductCount() {
  try {
    const res = await fetch(productUrl);
    const data = await res.json();
    document.getElementById(
      "productCount"
    ).textContent = `Products: ${data.length}`;
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

async function loadEnquiryCount() {
  try {
    const res = await fetch(enquiryUrl);
    const json = await res.json();

    console.log("Enquiry JSON response:", json); // 👈 Add this

    if (!json.success) throw new Error(json.message);

    const enquiries = json.data;
    console.log("Enquiries array:", enquiries); // 👈 See what you get

    document.getElementById(
      "enquiryCount"
    ).textContent = `Product Enquiry: ${enquiries.length}`;
  } catch (error) {
    console.error("Failed to load enquiries:", error);
  }
}

async function loadGeneralEnquiryCount() {
  try {
    const res = await fetch(generalEnquiryUrl);
    const data = await res.json();
    document.getElementById(
      "generalEnquiryCount"
    ).textContent = `General Enquiry: ${data.length}`;
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

loadCategoryCount();
loadSubcategoryCount();
loadProductCount();
loadEnquiryCount();
loadGeneralEnquiryCount();

function searchCategory() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const tableBody = document.getElementById("categoryTableBody");
  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const nameCell = rows[i].getElementsByTagName("td")[0]; // Assuming first column is 'Name'
    const nameText = nameCell?.textContent.toLowerCase() || "";

    if (nameText.includes(input)) {
      rows[i].style.display = ""; // Show matching row
    } else {
      rows[i].style.display = "none"; // Hide non-matching row
    }
  }
}
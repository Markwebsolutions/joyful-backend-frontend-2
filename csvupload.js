function submitBulkData() {
  const fileInput = document.getElementById("csvInput");
  const file = fileInput.files[0];

  if (!file || !file.name.endsWith(".csv")) {
    alert("Please select a valid .csv file.");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const rows = results.data;

      if (!validateCSVFields(rows)) return;

      fetch(
        "https://joyful-backend-backend-final-4-production.up.railway.app/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert(`✅ Import Success: ${data.message}`);
          } else {
            alert(`⚠️ Import Failed: ${data.message}`);
          }
        })
        .catch((error) => {
          console.error("Error during upload:", error);
          alert("❌ Upload failed. Check console or server logs.");
        });
    },
  });
}

// Utility function to validate required fields
function validateCSVFields(rows) {
  const requiredFields = [
    "category_name",
    "category_description",
    "category_searchkeywords",
    "category_imagelink",
    "category_seotitle",
    "category_seokeywords",
    "category_seodescription",
    "category_ispublished",
    "subcategory_name",
    "subcategory_imagepath",
    "subcategory_metatitle",
    "subcategory_ispublished",
    "subcategory_description",
    "subcategory_metadescription",
    "subcategory_seokeywords",
    "product_name",
    "product_description",
    "product_mainimage",
    "product_hoverimage",
    "product_producttags",
    "product_filter",
    "product_metatitle",
    "product_metadescription",
    "product_pagekeywords",
    "product_ispublished",
    "product_newarrival",
    "product_variantsMap",
  ];

  const missingFields = requiredFields.filter(
    (field) => !Object.keys(rows[0]).includes(field)
  );

  if (missingFields.length > 0) {
    alert("❌ Missing required fields in CSV: " + missingFields.join(", "));
    return false;
  }

  return true;
}
function handleSubmit() {
  const fileInput = document.getElementById("csvInput");
  const file = fileInput.files[0];
  const status = document.getElementById("status");
  const table = document.getElementById("previewTable");
  const tbody = document.getElementById("previewBody");

  if (!file || !file.name.endsWith(".csv")) {
    status.innerHTML =
      '<span style="color: var(--danger-color)"> Please select a valid .csv file.</span>';
    return;
  }

  status.innerHTML =
    '<span style="color: var(--warning-color)"> Reading file...</span>';

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const rows = results.data;

      // Show preview table
      tbody.innerHTML = "";
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row["category_name"] || "-"}</td>
          <td>${row["subcategory_name"] || "-"}</td>
          <td>${row["product_name"] || "-"}</td>
        `;
        tbody.appendChild(tr);
      });

      table.style.display = "table";
      status.innerHTML =
        '<span style="color: var(--accent-primary)"> Uploading...</span>';

      // Submit to backend
      fetch("http://localhost:8080/api/csv/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            status.innerHTML = `<span style="color: var(--success-color)"> ${data.message}</span>`;
          } else {
            status.innerHTML = `<span style="color: var(--danger-color)"> ${data.message}</span>`;
          }
        })
        .catch((err) => {
          console.error(err);
          status.innerHTML =
            '<span style="color: var(--danger-color)">🚫 Upload failed. Check server.</span>';
        });
    },
  });
}
function displayFileName() {
  const input = document.getElementById("csvInput");
  const fileNameSpan = document.getElementById("fileName");
  if (input.files.length > 0) {
    fileNameSpan.textContent = `Selected File: ${input.files[0].name}`;
  } else {
    fileNameSpan.textContent = "";
  }
}

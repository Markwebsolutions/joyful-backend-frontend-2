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
        "http://localhost:8080/api/csv/import",
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

      // Reset Table
      tbody.innerHTML = "";
      table.style.display = "table";

      status.innerHTML =
        '<span style="color: var(--accent-primary)"> Uploading...</span>';

      // Send to backend
      fetch(
        "http://localhost:8080/api/csv/import",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rows),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const failedRows = data.failedRows || [];
          const failedIndices = failedRows.map((r) => r.rowIndex);

          // Reset table
          tbody.innerHTML = "";
          table.style.display = "table";

          rows.forEach((row, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
      <td>${row["category_name"] || "-"}</td>
      <td>${row["subcategory_name"] || "-"}</td>
      <td>${row["product_name"] || "-"}</td>
    `;

            const failedRow = failedRows.find((f) => f.rowIndex === index);
            if (failedRow) {
              tr.style.backgroundColor = "#ffd6d6"; // 🔴 red for failed row

              const errorTd = document.createElement("td");
              errorTd.colSpan = 3;
              errorTd.style.color = "red";
              errorTd.style.fontSize = "0.85rem";
              errorTd.textContent = `⚠️ Error: ${failedRow.error}`;

              const errorRow = document.createElement("tr");
              errorRow.appendChild(errorTd);
              tbody.appendChild(errorRow);
            }

            tbody.appendChild(tr);
          });

          const successCount = rows.length - failedIndices.length;

          if (failedIndices.length === 0) {
            status.innerHTML = `<span style="color: var(--success-color)">✅ ${successCount} rows imported successfully.</span>`;
          } else {
            status.innerHTML = `<span style="color: var(--warning-color)">⚠️ ${successCount} rows succeeded, ${failedIndices.length} failed.</span>`;
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

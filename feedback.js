const feedbackUrl = "https://joyfulbackend-production.up.railway.app/feedbacks";

window.onload = () => {
  loadFeedbacks();
};

async function loadFeedbacks() {
  const res = await fetch(feedbackUrl);
  const data = await res.json();
  const tableBody = document.getElementById("feedbackTableBody");
  tableBody.innerHTML = "";
  document.getElementById(
    "feedbackCount"
  ).textContent = `Total Feedbacks: ${data.length}`;

  data.forEach((fb) => {
    const row = document.createElement("div");
    row.classList.add("grid-row");
    row.setAttribute("data-id", fb.feedbackid);

    row.innerHTML = `
      <div>${fb.name}</div>
      <div>${fb.heading}</div>
      <div>${fb.description}</div>
      <div>
        <img src="${
          fb.image || "https://dummyimage.com/80x60/cccccc/000000&text=No+Image"
        }" 
             alt="img" class="feedback-img"/>
      </div>
      <div>${fb.star || 0}</div>
      <div>
       <button class="edit-btn">Edit</button>
        <button class="delete-btn" onclick="deleteFeedback(${
          fb.feedbackid
        })">Delete</button>
       
      </div>
    `;

    row.querySelector(".edit-btn").addEventListener("click", () => {
      openFeedbackModal(fb);
    });

    tableBody.appendChild(row);
  });
}

function openFeedbackModal(feedback = null) {
  document.getElementById("feedbackModal").style.display = "block";
  document.getElementById("feedbackModalTitle").textContent = feedback
    ? "Edit Review"
    : "Add Review";

  document.getElementById("feedbackid").value = feedback?.feedbackid || "";
  document.getElementById("name").value = feedback?.name || "";
  document.getElementById("heading").value = feedback?.heading || "";
  document.getElementById("description").value = feedback?.description || "";
  document.getElementById("star").value = feedback?.star || "";
  document.getElementById("image").value = feedback?.image || "";

  const preview = document.getElementById("feedbackImagePreview");
  preview.src = feedback?.image || "";
  preview.style.display = feedback?.image ? "block" : "none";
}

function closeFeedbackModal() {
  document.getElementById("feedbackModal").style.display = "none";
}

document
  .getElementById("feedbackForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const starValue = parseInt(document.getElementById("star").value);
    if (isNaN(starValue) || starValue < 1 || starValue > 5) {
      alert("Star rating must be between 1 and 5.");
      return;
    }

    const payload = {
      feedbackid: document.getElementById("feedbackid").value || null,
      name: document.getElementById("name").value,
      heading: document.getElementById("heading").value,
      description: document.getElementById("description").value,
      image: document.getElementById("image").value.trim(),
      star: starValue,
    };

    const res = await fetch("https://joyfulbackend-production.up.railway.app/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      closeFeedbackModal();
      loadFeedbacks();
    } else {
      alert("Something went wrong. Check server logs.");
    }
  });

async function deleteFeedback(id) {
  if (!confirm("Delete this feedback?")) return;

  const res = await fetch(`https://joyfulbackend-production.up.railway.app/deletefeedback?id=${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    loadFeedbacks();
  } else {
    alert("Failed to delete");
  }
}

async function deleteAllFeedback() {
  if (!confirm("Delete all feedbacks?")) return;

  const res = await fetch(`https://joyfulbackend-production.up.railway.app/deleteAllFeedback`, {
    method: "DELETE",
  });

  if (res.ok) {
    loadFeedbacks();
  } else {
    alert("Failed to delete all");
  }
}

function searchFeedback() {
  const input = document
    .getElementById("searchFeedbackInput")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#feedbackTableBody .grid-row");

  rows.forEach((row) => {
    const name = row.children[0].textContent.toLowerCase();
    row.style.display = name.includes(input) ? "grid" : "none";
  });
}

function previewFeedbackImage() {
  const url = document.getElementById("image").value.trim();
  const preview = document.getElementById("feedbackImagePreview");

  if (url) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

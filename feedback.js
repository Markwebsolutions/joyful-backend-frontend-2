const feedbackUrl = "http://localhost:8080/feedbacks";

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
        <button class="delete-btn" onclick="deleteFeedback(${
          fb.feedbackid
        })">Delete</button>
        <button class="edit-btn">Edit</button>
      </div>
    `;

    // ✅ Add working edit button handler with correct data
    row.querySelector(".edit-btn").addEventListener("click", () => {
      openFeedbackModal(fb);
    });

    tableBody.appendChild(row);
  });
}

function openFeedbackModal(feedback = null) {
  document.getElementById("feedbackModal").style.display = "block";
  document.getElementById("feedbackModalTitle").textContent = feedback
    ? "Edit Feedback"
    : "Add Feedback";

  document.getElementById("feedbackid").value = feedback?.feedbackid || "";
  document.getElementById("name").value = feedback?.name || "";
  document.getElementById("heading").value = feedback?.heading || "";
  document.getElementById("description").value = feedback?.description || "";
  document.getElementById("image").value = feedback?.image || "";
  document.getElementById("star").value = feedback?.star || "";
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
      image: document.getElementById("image").value,
      star: starValue,
    };

    const method = payload.feedbackid ? "PUT" : "POST";
    const url = payload.feedbackid
      ? `${feedbackUrl}/update`
      : `http://localhost:8080/feedback`; // POST endpoint

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      closeFeedbackModal();
      loadFeedbacks();
    } else {
      alert("Something went wrong");
    }
  });

async function deleteFeedback(id) {
  if (!confirm("Delete this feedback?")) return;

  const res = await fetch(`http://localhost:8080/deletefeedback?id=${id}`, {
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

  const res = await fetch(`http://localhost:8080/deleteAllFeedback`, {
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
  const url = document.getElementById("image").value;
  const preview = document.getElementById("feedbackImagePreview");
  if (url) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
}

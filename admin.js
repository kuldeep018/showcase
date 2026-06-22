const STORAGE_KEY = "akDevelopersProjects";
const ADMIN_KEY = "akDevelopersAdmin";
const PASSWORD = "akdevelopers";
const PLACEHOLDER = "assets/images/project-placeholder.svg";

const $ = (selector) => document.querySelector(selector);
let projects = loadProjects();
let adminQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem(ADMIN_KEY) === "true") showDashboard();
  $("#loginForm").addEventListener("submit", login);
  $("#logout").addEventListener("click", logout);
  $("#projectForm").addEventListener("submit", saveProject);
  $("#resetForm").addEventListener("click", resetForm);
  $("#seedData").addEventListener("click", restoreSeeds);
  $("#adminSearch").addEventListener("input", (event) => {
    adminQuery = event.target.value.toLowerCase();
    renderList();
  });
});

function login(event) {
  event.preventDefault();
  if ($("#password").value.trim() !== PASSWORD) {
    alert("Wrong password.");
    return;
  }
  sessionStorage.setItem(ADMIN_KEY, "true");
  showDashboard();
}

function logout() {
  sessionStorage.removeItem(ADMIN_KEY);
  location.reload();
}

function showDashboard() {
  $("#loginPanel").hidden = true;
  $("#dashboard").hidden = false;
  renderList();
}

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

async function saveProject(event) {
  event.preventDefault();
  const id = Number($("#projectId").value) || Date.now();
  const existing = projects.find((project) => project.id === id);
  const upload = $("#imageUpload").files[0];
  const image = upload ? await fileToDataUrl(upload) : existing?.image || PLACEHOLDER;
  const nextProject = {
    id,
    title: $("#title").value.trim(),
    category: $("#category").value.trim(),
    description: $("#description").value.trim(),
    image,
    technologies: splitList($("#technologies").value),
    demo: $("#demo").value.trim(),
    github: $("#github").value.trim(),
    featured: $("#featured").checked,
    status: $("#status").value.trim(),
    views: existing?.views || 0,
    likes: existing?.likes || 0,
    date: $("#date").value,
    version: $("#version").value.trim(),
    difficulty: $("#difficulty").value.trim(),
    time: $("#time").value.trim(),
    features: $("#features").value.split("\n").map((item) => item.trim()).filter(Boolean),
    challenges: $("#challenges").value.trim(),
    learned: $("#learned").value.trim()
  };
  projects = existing ? projects.map((project) => project.id === id ? nextProject : project) : [nextProject, ...projects];
  persist();
  resetForm();
  renderList();
}

function renderList() {
  const filtered = projects.filter((project) => [project.title, project.category, project.technologies?.join(" ")].join(" ").toLowerCase().includes(adminQuery));
  $("#projectList").innerHTML = filtered.map((project) => `
    <article class="project-row">
      <img src="${project.image || PLACEHOLDER}" alt="${project.title}">
      <div>
        <h3>${project.title}</h3>
        <p>${project.category} / ${project.status} / v${project.version}</p>
        <p>${project.description}</p>
      </div>
      <div class="row-actions">
        <button type="button" onclick="editProject(${project.id})">Edit</button>
        <button class="danger" type="button" onclick="deleteProject(${project.id})">Delete</button>
      </div>
    </article>
  `).join("") || "<p>No projects found.</p>";
}

function editProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  $("#formTitle").textContent = "Edit Project";
  $("#projectId").value = project.id;
  $("#title").value = project.title;
  $("#category").value = project.category;
  $("#demo").value = project.demo;
  $("#github").value = project.github;
  $("#version").value = project.version;
  $("#status").value = project.status;
  $("#date").value = project.date;
  $("#difficulty").value = project.difficulty || "";
  $("#time").value = project.time || "";
  $("#technologies").value = project.technologies.join(", ");
  $("#description").value = project.description;
  $("#features").value = (project.features || []).join("\n");
  $("#challenges").value = project.challenges || "";
  $("#learned").value = project.learned || "";
  $("#featured").checked = Boolean(project.featured);
  scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProject(id) {
  if (!confirm("Delete this project?")) return;
  projects = projects.filter((project) => project.id !== id);
  persist();
  renderList();
}

function resetForm() {
  $("#projectForm").reset();
  $("#projectId").value = "";
  $("#formTitle").textContent = "Add New Project";
}

function restoreSeeds() {
  if (!confirm("Restore example projects? This replaces the current local project list.")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.href = "index.html";
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

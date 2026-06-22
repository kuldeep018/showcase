const STORAGE_KEY = "akDevelopersProjects";
const LIKED_KEY = "akDevelopersLiked";
const FAVORITES_KEY = "akDevelopersFavorites";

const skills = ["HTML", "CSS", "JavaScript", "Python", "Node.js", "Firebase", "Git", "GitHub", "Responsive Design", "REST APIs", "Express.js", "MongoDB", "Firestore"];
const filters = ["All", "HTML", "CSS", "JavaScript", "Python", "Node.js", "Firebase", "AI", "Business", "Utilities", "Games", "API", "Tools"];

const defaultProjects = [
  project(1, "AI Resume Analyzer", "AI", "Upload a resume and get smart improvement suggestions.", ["HTML", "CSS", "JavaScript", "AI"], true, "Completed", "2026-01-18", "2.1.0", "Advanced", "26 hrs"),
  project(2, "Business Landing Page", "Business", "Premium startup landing page with lead capture sections.", ["HTML", "CSS", "JavaScript"], true, "Completed", "2025-12-05", "1.4.0", "Medium", "14 hrs"),
  project(3, "Firebase Chat App", "Firebase", "Realtime private chat interface with clean mobile UX.", ["JavaScript", "Firebase", "Firestore"], true, "Completed", "2026-02-12", "1.8.2", "Advanced", "31 hrs"),
  project(4, "Expense Tracker", "Utilities", "Track spending, categories, budgets, and monthly summaries.", ["HTML", "CSS", "JavaScript"], false, "Completed", "2025-11-20", "1.2.0", "Medium", "16 hrs"),
  project(5, "Weather API Dashboard", "API", "Search weather with forecast cards and saved locations.", ["JavaScript", "REST APIs"], false, "Completed", "2025-10-03", "1.1.0", "Medium", "12 hrs"),
  project(6, "Portfolio CMS", "Tools", "Local admin project manager with editable showcase data.", ["JavaScript", "Local Storage"], false, "Beta", "2026-03-02", "0.9.0", "Advanced", "22 hrs"),
  project(7, "Python Automation Kit", "Python", "Useful scripts for files, reports, and daily workflows.", ["Python"], false, "Completed", "2025-08-18", "1.0.1", "Medium", "18 hrs"),
  project(8, "Node API Starter", "Node.js", "Express and MongoDB starter API for business apps.", ["Node.js", "Express.js", "MongoDB"], false, "Completed", "2026-01-28", "1.3.3", "Advanced", "28 hrs"),
  project(9, "TaskFlow Board", "Business", "Kanban task board for teams and solo productivity.", ["HTML", "CSS", "JavaScript"], false, "Completed", "2025-09-14", "1.5.0", "Medium", "20 hrs"),
  project(10, "Mini Game Arcade", "Games", "Collection of polished browser games with score saving.", ["HTML", "CSS", "JavaScript"], false, "Completed", "2026-04-11", "1.0.0", "Medium", "24 hrs"),
  project(11, "Restaurant Website", "Business", "Responsive restaurant site with menu and reservation CTA.", ["HTML", "CSS"], false, "Completed", "2025-07-22", "1.2.4", "Easy", "10 hrs"),
  project(12, "GitHub Profile Finder", "API", "Search GitHub users and show repositories in seconds.", ["JavaScript", "REST APIs"], false, "Completed", "2025-08-30", "1.0.3", "Easy", "8 hrs"),
  project(13, "AI Prompt Vault", "AI", "Organize reusable prompts by category, rating, and tags.", ["HTML", "CSS", "JavaScript", "AI"], false, "Beta", "2026-03-19", "0.8.5", "Medium", "17 hrs"),
  project(14, "Inventory Manager", "Tools", "Small business inventory tracker with local persistence.", ["JavaScript", "Business"], false, "Completed", "2026-05-01", "1.1.1", "Medium", "19 hrs"),
  project(15, "Firestore Notes", "Firebase", "Cloud notes app with tags, search, and pinning.", ["Firebase", "Firestore", "JavaScript"], false, "Completed", "2026-05-25", "1.6.0", "Advanced", "30 hrs")
];

function project(id, title, category, description, technologies, featured, status, date, version, difficulty, time) {
  return {
    id, title, category, description, technologies, featured, status, date, version, difficulty, time,
    image: "assets/images/project-placeholder.svg",
    demo: `https://example.com/demo/${id}`,
    github: `https://github.com/example/project-${id}`,
    views: 120 + id * 79,
    likes: 20 + id * 11,
    features: ["Responsive interface", "Fast loading assets", "Clean reusable code", "Mobile first layout"],
    challenges: "Balancing speed, polish, and simple maintainable code.",
    learned: "Improved component planning, state handling, and user-focused interaction design."
  };
}

const state = { projects: loadProjects(), filter: "All", search: "" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", init);

function init() {
  document.body.classList.add("loaded");
  $("#year").textContent = new Date().getFullYear();
  renderSkills();
  renderFilters();
  renderProjects();
  bindEvents();
  setupReveal();
  animateTyping();
  animateCounters();
  applySavedTheme();
}

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }
  try { return JSON.parse(saved); } catch { return defaultProjects; }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
}

function renderSkills() {
  $("#skills").innerHTML = skills.map((skill) => `<span>${skill}</span>`).join("");
}

function renderFilters() {
  $("#filters").innerHTML = filters.map((filter) => `<button type="button" class="${filter === state.filter ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("");
}

function renderProjects() {
  const projects = getFilteredProjects();
  $("#featuredProjects").innerHTML = state.projects.filter((item) => item.featured).slice(0, 3).map(projectCard).join("");
  $("#projectGrid").innerHTML = projects.map(projectCard).join("");
  $("#emptyState").hidden = projects.length > 0;
  renderFilters();
}

function getFilteredProjects() {
  const query = state.search.trim().toLowerCase();
  return state.projects.filter((item) => {
    const matchesFilter = state.filter === "All" || item.category === state.filter || item.technologies.includes(state.filter);
    const haystack = [item.title, item.category, item.description, item.technologies.join(" ")].join(" ").toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });
}

function projectCard(item) {
  return `
    <article class="project-card reveal" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title} preview" loading="lazy">
      <div class="content">
        <span class="tag">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="chips">${item.technologies.map((tech) => `<span>${tech}</span>`).join("")}</div>
        <div class="meta">
          <span>Status: ${item.status}</span><span>Date: ${formatDate(item.date)}</span>
          <span>Version: ${item.version}</span><span>Level: ${item.difficulty}</span>
          <span>Time: ${item.time}</span><span>${item.views} views</span>
          <span>${item.likes} likes</span><span>${item.featured ? "Featured" : "Project"}</span>
        </div>
        <div class="card-actions">
          <a class="btn primary" href="${item.demo}" target="_blank" rel="noopener" data-open="${item.id}">Live Demo</a>
          <a class="btn secondary" href="${item.github}" target="_blank" rel="noopener">GitHub</a>
        </div>
        <div class="icon-row">
          <button type="button" data-details="${item.id}">Details</button>
          <button type="button" data-like="${item.id}">Like</button>
          <button type="button" data-favorite="${item.id}">Favorite</button>
          <button type="button" data-share="${item.id}">Share</button>
        </div>
      </div>
    </article>`;
}

function bindEvents() {
  $("#projectSearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProjects();
    setupReveal();
  });
  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("mousemove", (event) => {
    $(".cursor-glow").style.left = `${event.clientX}px`;
    $(".cursor-glow").style.top = `${event.clientY}px`;
  });
  $(".close-modal").addEventListener("click", () => $("#projectModal").close());
  $("#projectModal").addEventListener("click", (event) => {
    if (event.target.id === "projectModal") $("#projectModal").close();
  });
  $(".theme-toggle").addEventListener("click", toggleTheme);
  $(".to-top").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  $("#copyEmail").addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(event.currentTarget.dataset.email);
    event.currentTarget.textContent = "Email Copied";
    setTimeout(() => event.currentTarget.textContent = "Copy Email", 1600);
  });
  $$(".btn").forEach(addRipple);
}

function handleDocumentClick(event) {
  const filter = event.target.closest("[data-filter]");
  const details = event.target.closest("[data-details]");
  const like = event.target.closest("[data-like]");
  const favorite = event.target.closest("[data-favorite]");
  const share = event.target.closest("[data-share]");
  const open = event.target.closest("[data-open]");
  if (filter) {
    state.filter = filter.dataset.filter;
    renderProjects();
    setupReveal();
  }
  if (details) openModal(Number(details.dataset.details));
  if (like) likeProject(Number(like.dataset.like));
  if (favorite) favoriteProject(Number(favorite.dataset.favorite));
  if (share) shareProject(Number(share.dataset.share));
  if (open) countView(Number(open.dataset.open));
  const card = event.target.closest(".project-card");
  if (card && !event.target.closest("a, button")) openModal(Number(card.dataset.id));
  if (event.target.classList.contains("btn")) addRipple(event.target)(event);
}

function openModal(id) {
  const item = state.projects.find((projectItem) => projectItem.id === id);
  if (!item) return;
  countView(id, false);
  $("#modalImage").src = item.image;
  $("#modalImage").alt = `${item.title} preview`;
  $("#modalCategory").textContent = item.category;
  $("#modalTitle").textContent = item.title;
  $("#modalDescription").textContent = item.description;
  $("#modalFeatures").innerHTML = item.features.map((feature) => `<li>${feature}</li>`).join("");
  $("#modalTech").innerHTML = item.technologies.map((tech) => `<span>${tech}</span>`).join("");
  $("#modalChallenges").textContent = item.challenges;
  $("#modalLearned").textContent = item.learned;
  $("#modalDemo").href = item.demo;
  $("#modalGithub").href = item.github;
  $("#projectModal").showModal();
}

function countView(id, rerender = true) {
  const item = state.projects.find((projectItem) => projectItem.id === id);
  if (item) item.views += 1;
  saveProjects();
  if (rerender) renderProjects();
}

function likeProject(id) {
  const liked = new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]"));
  if (liked.has(id)) return;
  liked.add(id);
  const item = state.projects.find((projectItem) => projectItem.id === id);
  if (item) item.likes += 1;
  localStorage.setItem(LIKED_KEY, JSON.stringify([...liked]));
  saveProjects();
  renderProjects();
}

function favoriteProject(id) {
  const favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

async function shareProject(id) {
  const item = state.projects.find((projectItem) => projectItem.id === id);
  const url = `${location.href.split("#")[0]}#project-${id}`;
  if (navigator.share) {
    await navigator.share({ title: item.title, text: item.description, url });
  } else {
    await navigator.clipboard.writeText(url);
    alert("Project link copied.");
  }
}

function handleScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $(".progress").style.width = `${(scrollY / max) * 100}%`;
  $(".to-top").classList.toggle("show", scrollY > 500);
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal:not(.visible)").forEach((item) => observer.observe(item));
}

function animateCounters() {
  const counters = $$("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 80));
      const tick = () => {
        current = Math.min(target, current + step);
        entry.target.textContent = current.toLocaleString();
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      observer.unobserve(entry.target);
    });
  });
  counters.forEach((counter) => observer.observe(counter));
}

function animateTyping() {
  const element = $(".typing");
  const text = element.dataset.typing;
  let index = 0;
  const tick = () => {
    element.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) setTimeout(tick, 35);
  };
  tick();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("akTheme", next);
  $(".theme-toggle").textContent = next === "light" ? "L" : "D";
}

function applySavedTheme() {
  const saved = localStorage.getItem("akTheme") || "dark";
  document.documentElement.dataset.theme = saved;
  $(".theme-toggle").textContent = saved === "light" ? "L" : "D";
}

function addRipple(button) {
  return function ripple(event) {
    if (!event || !button.getBoundingClientRect) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--rx", `${event.clientX - rect.left}px`);
    button.style.setProperty("--ry", `${event.clientY - rect.top}px`);
    button.classList.remove("ripple");
    void button.offsetWidth;
    button.classList.add("ripple");
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(date));
}

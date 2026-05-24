const BLOG_FIELDS = [
  { key: "title", label: "כותרת", type: "text", required: true },
  { key: "description", label: "תיאור SEO", type: "textarea", required: true },
  { key: "date", label: "תאריך", type: "date", required: true },
  { key: "updatedDate", label: "עודכן", type: "date" },
  { key: "category", label: "קטגוריה", type: "select", options: ["tech", "sport", "human-nature"], required: true },
  { key: "tags", label: "תגיות", type: "tags" },
  { key: "draft", label: "טיוטה", type: "checkbox" },
];

const PROJECT_FIELDS = [
  { key: "title", label: "כותרת", type: "text", required: true },
  { key: "description", label: "תיאור", type: "textarea", required: true },
  { key: "category", label: "קטגוריה", type: "select", options: ["ai", "trading", "edtech", "academic"], required: true },
  { key: "status", label: "סטטוס", type: "select", options: ["active", "in-progress", "shipped", "ongoing"], required: true },
  { key: "techStack", label: "טכנולוגיות", type: "tags", required: true },
  { key: "order", label: "סדר", type: "number" },
  { key: "externalUrl", label: "קישור", type: "text" },
];

type Tab = "blog" | "projects" | "copy" | "about" | "now";
type Locale = "en" | "he";

let activeTab: Tab = "blog";
let contentKind: "blog" | "projects" = "blog";
let items: Array<{ path: string; title: string; locale: string; slug: string }> = [];
let currentPath: string | null = null;
let siteCopy: Record<Locale, Record<string, string>> = { en: {}, he: {} };
let siteSections: Array<{ title: string; fields: Array<{ key: string; label: string; hint?: string; multiline?: boolean }> }> = [];
let copyLocale: Locale = "he";
let aboutContent: Record<Locale, { metaDescription: string; paragraphs: string[] }> = { en: { metaDescription: "", paragraphs: [] }, he: { metaDescription: "", paragraphs: [] } };
let nowContent: Record<Locale, { metaDescription: string; lastUpdated: string; building: Array<{ title: string; text: string }>; studying: Array<{ title: string; text: string }>; thinking: string[] }> = {
  en: { metaDescription: "", lastUpdated: "", building: [], studying: [], thinking: [] },
  he: { metaDescription: "", lastUpdated: "", building: [], studying: [], thinking: [] },
};
let aboutLocale: Locale = "he";
let nowLocale: Locale = "he";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

function showStatus(el: HTMLElement | null, text: string, ok: boolean) {
  if (!el) return;
  el.hidden = false;
  el.textContent = text;
  el.className = `admin-status ${ok ? "admin-status-success" : "admin-status-error"}`;
}

function formatTags(v: unknown) {
  return Array.isArray(v) ? v.join(", ") : String(v ?? "");
}

function formatDate(v: unknown) {
  if (!v) return "";
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString().slice(0, 10);
}

function renderField(field: (typeof BLOG_FIELDS)[0], value: unknown) {
  const wrap = document.createElement("label");
  wrap.className = "admin-field";
  wrap.innerHTML = `<span>${field.label}</span>`;
  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

  if (field.type === "textarea") {
    input = document.createElement("textarea");
    input.rows = 2;
    input.value = String(value ?? "");
  } else if (field.type === "select") {
    input = document.createElement("select");
    for (const o of field.options ?? []) {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o;
      input.appendChild(opt);
    }
    input.value = String(value ?? field.options?.[0] ?? "");
  } else if (field.type === "checkbox") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(value);
  } else if (field.type === "tags") {
    input = document.createElement("input");
    input.type = "text";
    input.value = formatTags(value);
  } else if (field.type === "date") {
    input = document.createElement("input");
    input.type = "date";
    input.value = formatDate(value);
  } else if (field.type === "number") {
    input = document.createElement("input");
    input.type = "number";
    input.value = String(value ?? 0);
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.value = String(value ?? "");
  }
  if (field.required) input.required = true;
  input.name = field.key;
  wrap.appendChild(input);
  return wrap;
}

function collectMdData() {
  const fields = contentKind === "blog" ? BLOG_FIELDS : PROJECT_FIELDS;
  const data: Record<string, unknown> = {};
  const container = $("frontmatter-fields");
  for (const field of fields) {
    const el = container?.querySelector(`[name="${field.key}"]`) as HTMLInputElement | null;
    if (!el) continue;
    if (field.type === "checkbox") data[field.key] = el.checked;
    else if (field.type === "tags") data[field.key] = el.value.split(",").map((t) => t.trim()).filter(Boolean);
    else if (field.type === "number") data[field.key] = el.value === "" ? 0 : Number(el.value);
    else data[field.key] = el.value;
  }
  return data;
}

function switchTab(tab: Tab) {
  activeTab = tab;
  document.querySelectorAll(".admin-tab").forEach((b) => b.classList.toggle("is-active", (b as HTMLElement).dataset.tab === tab));

  const isMd = tab === "blog" || tab === "projects";
  $("panel-list")?.classList.toggle("admin-hidden", !isMd);
  $("panel-md-main")?.classList.toggle("admin-hidden", !isMd);
  $("panel-copy-main")?.classList.toggle("admin-hidden", tab !== "copy");
  $("panel-about-main")?.classList.toggle("admin-hidden", tab !== "about");
  $("panel-now-main")?.classList.toggle("admin-hidden", tab !== "now");

  if (tab === "blog" || tab === "projects") {
    contentKind = tab;
    $("new-item-btn")!.textContent = tab === "blog" ? "+ פוסט חדש" : "+ פרויקט חדש";
    loadItems().catch(console.error);
  }
  if (tab === "copy" && !siteSections.length) loadSiteCopy().catch(console.error);
  if (tab === "about" && !aboutContent.he.paragraphs.length) loadAbout().catch(console.error);
  if (tab === "now" && !nowContent.he.building.length && !nowContent.he.thinking.length) loadNow().catch(console.error);
}

function renderList() {
  const list = $("content-list");
  const loc = ($("filter-locale") as HTMLSelectElement)?.value ?? "";
  if (!list) return;
  list.innerHTML = "";
  for (const item of items.filter((i) => !loc || i.locale === loc)) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "admin-list-item" + (item.path === currentPath ? " is-active" : "");
    btn.innerHTML = `<span class="admin-list-title">${item.title}</span><span class="admin-list-meta">${item.locale.toUpperCase()} · ${item.slug}</span>`;
    btn.onclick = () => loadItem(item.path);
    li.appendChild(btn);
    list.appendChild(li);
  }
}

async function loadItems() {
  const res = await fetch(`/api/admin/content?kind=${contentKind}`);
  items = ((await res.json()).items ?? []) as typeof items;
  renderList();
}

async function loadItem(path: string) {
  const res = await fetch(`/api/admin/content?path=${encodeURIComponent(path)}`);
  if (!res.ok) return alert("שגיאת טעינה");
  const data = await res.json();
  currentPath = data.path;
  $("editor-empty")?.setAttribute("hidden", "");
  $("editor-form")?.removeAttribute("hidden");
  $("delete-item-btn")?.removeAttribute("hidden");
  $("editor-breadcrumb")!.textContent = `${data.locale} / ${data.slug}`;
  $("editor-title")!.textContent = data.data?.title ?? data.slug;
  const fields = contentKind === "blog" ? BLOG_FIELDS : PROJECT_FIELDS;
  const container = $("frontmatter-fields")!;
  container.innerHTML = "";
  for (const f of fields) container.appendChild(renderField(f, data.data?.[f.key]));
  ($("editor-body") as HTMLTextAreaElement).value = data.body ?? "";
  renderList();
}

function clearEditor() {
  currentPath = null;
  $("editor-form")?.setAttribute("hidden", "");
  $("delete-item-btn")?.setAttribute("hidden", "");
  $("editor-empty")?.removeAttribute("hidden");
}

// Site copy
function renderSiteCopyForm() {
  const c = $("site-copy-fields");
  if (!c) return;
  c.innerHTML = "";
  for (const section of siteSections) {
    const sec = document.createElement("section");
    sec.className = "admin-copy-section";
    sec.innerHTML = `<h3 class="admin-copy-section-title">${section.title}</h3>`;
    const grid = document.createElement("div");
    grid.className = "admin-fields";
    for (const f of section.fields) {
      const label = document.createElement("label");
      label.className = "admin-field admin-field-full";
      label.innerHTML = `<span>${f.label}</span>`;
      const input = f.multiline ? document.createElement("textarea") : document.createElement("input");
      if (f.multiline) (input as HTMLTextAreaElement).rows = 3;
      input.name = f.key;
      (input as HTMLInputElement | HTMLTextAreaElement).value = siteCopy[copyLocale]?.[f.key] ?? "";
      label.appendChild(input);
      grid.appendChild(label);
    }
    sec.appendChild(grid);
    c.appendChild(sec);
  }
}

async function loadSiteCopy() {
  const res = await fetch("/api/admin/site-copy");
  const data = await res.json();
  siteCopy = data.copy;
  siteSections = data.sections;
  renderSiteCopyForm();
}

// About
function renderAboutForm() {
  const c = aboutContent[aboutLocale];
  ($("about-form")!.elements.namedItem("metaDescription") as HTMLTextAreaElement).value = c.metaDescription;
  const box = $("about-paragraphs")!;
  box.innerHTML = "";
  c.paragraphs.forEach((p, i) => {
    const label = document.createElement("label");
    label.className = "admin-field admin-field-full";
    label.innerHTML = `<span>פסקה ${i + 1}</span>`;
    const ta = document.createElement("textarea");
    ta.name = `paragraph-${i}`;
    ta.rows = 4;
    ta.value = p;
    label.appendChild(ta);
    box.appendChild(label);
  });
}

async function loadAbout() {
  const res = await fetch("/api/admin/pages/about");
  aboutContent = (await res.json()).content;
  renderAboutForm();
}

// Now
function nowItemRow(item: { title: string; text: string }, index: number, section: string) {
  const div = document.createElement("div");
  div.className = "admin-now-item";
  div.innerHTML = `
    <label class="admin-field"><span>כותרת</span><input type="text" data-field="title" value="${item.title.replace(/"/g, "&quot;")}" /></label>
    <label class="admin-field admin-field-full"><span>תיאור</span><textarea data-field="text" rows="2">${item.text}</textarea></label>
    <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm remove-now-item">הסר</button>
  `;
  div.dataset.section = section;
  div.dataset.index = String(index);
  div.querySelector(".remove-now-item")!.addEventListener("click", () => {
    div.remove();
  });
  return div;
}

function renderNowForm() {
  const c = nowContent[nowLocale];
  const form = $("now-form")!;
  (form.elements.namedItem("metaDescription") as HTMLTextAreaElement).value = c.metaDescription;
  (form.elements.namedItem("lastUpdated") as HTMLInputElement).value = c.lastUpdated;

  const fill = (id: string, section: "building" | "studying", list: Array<{ title: string; text: string }>) => {
    const box = $(id)!;
    box.innerHTML = "";
    list.forEach((item, i) => box.appendChild(nowItemRow(item, i, section)));
  };
  fill("now-building", "building", c.building);
  fill("now-studying", "studying", c.studying);

  const think = $("now-thinking")!;
  think.innerHTML = "";
  c.thinking.forEach((t, i) => {
    const label = document.createElement("label");
    label.className = "admin-field admin-field-full";
    label.innerHTML = `<span>שורה ${i + 1}</span>`;
    const input = document.createElement("input");
    input.type = "text";
    input.name = `thinking-${i}`;
    input.value = t;
    label.appendChild(input);
    think.appendChild(label);
  });
}

function collectNowSection(section: "building" | "studying") {
  const box = section === "building" ? $("now-building")! : $("now-studying")!;
  return [...box.querySelectorAll(".admin-now-item")].map((row) => ({
    title: (row.querySelector('[data-field="title"]') as HTMLInputElement).value,
    text: (row.querySelector('[data-field="text"]') as HTMLTextAreaElement).value,
  }));
}

async function loadNow() {
  const res = await fetch("/api/admin/pages/now");
  nowContent = (await res.json()).content;
  renderNowForm();
}

function init() {
  // Login form must be wired BEFORE the auth gate so unauthenticated users can log in
  const loginForm = $("login-form");
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const el = $("login-error");
      if (el) { el.textContent = err.error ?? "שגיאה"; el.removeAttribute("hidden"); }
      return;
    }
    window.location.replace("/admin");
  });

  if ($("app")?.dataset.authed !== "true") return;

  fetch("/api/admin/me")
    .then((r) => r.json())
    .then((me) => {
      $("storage-badge")!.textContent = me.storageMode === "github" ? "שמירה: GitHub" : "שמירה: מקומי";
    });

  $("logout-btn")?.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  });

  document.querySelectorAll(".admin-tab").forEach((b) =>
    b.addEventListener("click", () => switchTab((b as HTMLElement).dataset.tab as Tab)),
  );

  $("filter-locale")?.addEventListener("change", renderList);

  $("new-item-btn")?.addEventListener("click", () => {
    $("new-item-modal-title")!.textContent = contentKind === "blog" ? "פוסט חדש" : "פרויקט חדש";
    $("new-item-modal")?.removeAttribute("hidden");
  });
  $("cancel-new-item")?.addEventListener("click", () => $("new-item-modal")?.setAttribute("hidden", ""));

  $("new-item-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: contentKind,
        locale: fd.get("locale"),
        slug: fd.get("slug"),
        title: fd.get("title"),
        body: contentKind === "blog" ? "תוכן הפוסט כאן.\n" : "תיאור הפרויקט כאן.\n",
      }),
    });
    if (!res.ok) {
      showStatus($("new-item-status"), (await res.json().catch(() => ({}))).error ?? "שגיאה", false);
      return;
    }
    const data = await res.json();
    $("new-item-modal")?.setAttribute("hidden", "");
    (e.target as HTMLFormElement).reset();
    await loadItems();
    await loadItem(data.path);
  });

  $("editor-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentPath) return;
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: currentPath, data: collectMdData(), body: ($("editor-body") as HTMLTextAreaElement).value }),
    });
    showStatus($("save-status"), res.ok ? "נשמר" : (await res.json().catch(() => ({}))).error ?? "שגיאה", res.ok);
    if (res.ok) await loadItems();
  });

  $("delete-item-btn")?.addEventListener("click", async () => {
    if (!currentPath || !confirm("למחוק?")) return;
    const res = await fetch(`/api/admin/content?path=${encodeURIComponent(currentPath)}`, { method: "DELETE" });
    if (!res.ok) return alert("שגיאת מחיקה");
    clearEditor();
    await loadItems();
  });

  document.querySelector("[data-copy-tabs]")?.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-locale]");
    if (!btn) return;
    copyLocale = btn.getAttribute("data-locale") as Locale;
    document.querySelectorAll("[data-copy-tabs] [data-locale]").forEach((b) => b.classList.toggle("is-active", b === btn));
    renderSiteCopyForm();
  });

  $("site-copy-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    for (const [k, v] of fd.entries()) if (typeof v === "string") siteCopy[copyLocale][k] = v;
    const res = await fetch("/api/admin/site-copy", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ copy: siteCopy }) });
    showStatus($("copy-save-status"), res.ok ? "נשמר — יופיע אחרי deploy" : "שגיאה", res.ok);
  });

  document.querySelector("[data-about-tabs]")?.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-locale]");
    if (!btn) return;
    aboutLocale = btn.getAttribute("data-locale") as Locale;
    document.querySelectorAll("[data-about-tabs] [data-locale]").forEach((b) => b.classList.toggle("is-active", b === btn));
    renderAboutForm();
  });

  $("add-about-paragraph")?.addEventListener("click", () => {
    aboutContent[aboutLocale].paragraphs.push("");
    renderAboutForm();
  });

  $("about-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    aboutContent[aboutLocale].metaDescription = String(fd.get("metaDescription") ?? "");
    aboutContent[aboutLocale].paragraphs = [...fd.entries()]
      .filter(([k]) => k.startsWith("paragraph-"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => String(v));
    const res = await fetch("/api/admin/pages/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: aboutContent }) });
    showStatus($("about-save-status"), res.ok ? "נשמר" : "שגיאה", res.ok);
  });

  document.querySelector("[data-now-tabs]")?.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-locale]");
    if (!btn) return;
    nowLocale = btn.getAttribute("data-locale") as Locale;
    document.querySelectorAll("[data-now-tabs] [data-locale]").forEach((b) => b.classList.toggle("is-active", b === btn));
    renderNowForm();
  });

  document.querySelectorAll(".add-now-item").forEach((btn) =>
    btn.addEventListener("click", () => {
      const section = (btn as HTMLElement).dataset.section as "building" | "studying";
      const box = section === "building" ? $("now-building")! : $("now-studying")!;
      box.appendChild(nowItemRow({ title: "", text: "" }, box.children.length, section));
    }),
  );

  $("add-now-thinking")?.addEventListener("click", () => {
    nowContent[nowLocale].thinking.push("");
    renderNowForm();
  });

  $("now-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    nowContent[nowLocale].metaDescription = String(fd.get("metaDescription") ?? "");
    nowContent[nowLocale].lastUpdated = String(fd.get("lastUpdated") ?? "");
    nowContent[nowLocale].building = collectNowSection("building");
    nowContent[nowLocale].studying = collectNowSection("studying");
    nowContent[nowLocale].thinking = [...fd.entries()]
      .filter(([k]) => k.startsWith("thinking-"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => String(v))
      .filter(Boolean);
    const res = await fetch("/api/admin/pages/now", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: nowContent }) });
    showStatus($("now-save-status"), res.ok ? "נשמר" : "שגיאה", res.ok);
  });

  switchTab("blog");
}

if (typeof document !== "undefined") init();

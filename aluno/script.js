if (window.lucide) lucide.createIcons();

const app = document.getElementById("app");
const logo = document.getElementById("brandLogo");
const logoFallback = document.getElementById("brandFallback");
const drawer = document.getElementById("sideMenu");
const backdrop = document.getElementById("menuBackdrop");
const openMenuButton = document.getElementById("openMenu");
const closeMenuButton = document.getElementById("closeMenu");
const mainContent = document.getElementById("mainContent");
const searchInput = document.getElementById("equipmentSearch");
const equipmentItems = [...document.querySelectorAll("[data-search-item]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const navItems = [...document.querySelectorAll("[data-nav-target]")];
const drawerLinks = [...document.querySelectorAll("[data-drawer-target]")];
let activeFilter = "all";

function showLogoFallback() {
    logo.hidden = true;
    logoFallback.style.display = "inline-flex";
}

logo.addEventListener("error", showLogoFallback);
if (logo.complete && logo.naturalWidth === 0) showLogoFallback();

function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    openMenuButton.setAttribute("aria-expanded", String(open));
    app.style.overflow = open ? "hidden" : "";

    if (open) {
        closeMenuButton.focus();
    } else if (document.activeElement === closeMenuButton) {
        openMenuButton.focus();
    }
}

openMenuButton.addEventListener("click", () => setDrawer(true));
closeMenuButton.addEventListener("click", () => setDrawer(false));
backdrop.addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false);
});

function normalizeText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function updateEquipmentResults() {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    equipmentItems.forEach((item) => {
        const searchableText = normalizeText([
            item.dataset.name,
            item.dataset.code,
            item.dataset.category
        ].join(" "));
        const matchesSearch = searchableText.includes(query);
        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "available" && item.dataset.available === "true") ||
            item.dataset.category === activeFilter;
        const visible = matchesSearch && matchesFilter;

        item.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
    resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "item" : "itens"}`;
}

searchInput.addEventListener("input", updateEquipmentResults);
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((item) => {
            item.setAttribute("aria-pressed", String(item === button));
        });
        updateEquipmentResults();
    });
});

function navigateTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetTop = ["inicio", "perfil"].includes(targetId)
        ? 0
        : target.offsetTop - mainContent.offsetTop;
    mainContent.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    navItems.forEach((item) => {
        if (item.dataset.navTarget === targetId) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });
}

navItems.forEach((item) => {
    item.addEventListener("click", () => navigateTo(item.dataset.navTarget));
});

drawerLinks.forEach((item) => {
    item.addEventListener("click", () => {
        drawerLinks.forEach((link) => link.classList.toggle("is-active", link === item));
        setDrawer(false);
        navigateTo(item.dataset.drawerTarget);
    });
});

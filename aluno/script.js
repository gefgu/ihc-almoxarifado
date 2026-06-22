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
const statusMessage = document.getElementById("statusMessage");
const toast = document.getElementById("toast");
const reserveButtons = [...document.querySelectorAll("[data-reserve-button]")];
const reservationPanel = document.getElementById("reservationPanel");
const reservationName = document.getElementById("reservationName");
const reservationCode = document.getElementById("reservationCode");
const reservationAvailability = document.getElementById("reservationAvailability");
const confirmReservation = document.getElementById("confirmReservation");
const cancelReservation = document.getElementById("cancelReservation");
const closeReservation = document.getElementById("closeReservation");
const newLoanButton = document.getElementById("newLoanButton");
const notificationButton = document.getElementById("notificationButton");
const helpButton = document.getElementById("helpButton");
const loanList = document.querySelector(".loan-list");
let activeFilter = "all";
let selectedEquipment = null;
let lastFocus = null;
let toastTimer;
let lastCreatedLoan = null;

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
    if (event.key === "Escape" && reservationPanel && !reservationPanel.hidden) closeReservationPanel();
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
    statusMessage.textContent = visibleCount === 0
        ? "Nenhum equipamento encontrado. Tente outro termo ou remova o filtro selecionado."
        : `${visibleCount} ${visibleCount === 1 ? "equipamento encontrado" : "equipamentos encontrados"} para reserva.`;
}

searchInput.addEventListener("input", updateEquipmentResults);
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((item) => {
            item.setAttribute("aria-pressed", String(item === button));
        });
        updateEquipmentResults();
        showToast(`Filtro aplicado: ${button.textContent.trim()}.`);
    });
});

function showToast(message, actionLabel, action) {
    clearTimeout(toastTimer);
    toast.innerHTML = "";
    const text = document.createElement("span");
    text.textContent = message;
    toast.append(text);

    if (actionLabel && action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = actionLabel;
        button.addEventListener("click", () => {
            action();
            toast.classList.remove("show");
        });
        toast.append(button);
    }

    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

function getEquipmentData(card) {
    const availability = card.querySelector(".availability")?.textContent.trim() || "Disponibilidade não informada";
    return {
        name: card.dataset.name,
        code: card.dataset.code,
        category: card.dataset.category,
        available: card.dataset.available === "true",
        availability
    };
}

function openReservationPanel(equipment, trigger) {
    if (!equipment.available) {
        showToast("Este equipamento está indisponível no momento. Escolha outro item disponível.");
        return;
    }

    selectedEquipment = equipment;
    lastFocus = trigger || document.activeElement;
    reservationName.textContent = equipment.name;
    reservationCode.textContent = equipment.code;
    reservationAvailability.textContent = equipment.availability;
    reservationPanel.hidden = false;
    reservationPanel.setAttribute("aria-hidden", "false");
    app.style.overflow = "hidden";
    confirmReservation.focus();
}

function closeReservationPanel() {
    reservationPanel.hidden = true;
    reservationPanel.setAttribute("aria-hidden", "true");
    selectedEquipment = null;
    app.style.overflow = drawer.classList.contains("is-open") ? "hidden" : "";
    if (lastFocus) lastFocus.focus();
}

function addPendingLoan(equipment) {
    const item = document.createElement("article");
    item.className = "loan-row pending-loan";
    item.dataset.loanItem = "";
    item.innerHTML = `
        <div class="loan-item">
            <div class="loan-icon"><i data-lucide="hourglass" class="h-5 w-5" aria-hidden="true"></i></div>
            <div class="min-w-0">
                <p class="loan-title m-0">${equipment.name}</p>
                <p class="loan-date mb-0">${equipment.code} · limite de 6 horas após retirada</p>
            </div>
        </div>
        <span class="status-badge pending">Pendente</span>
    `;
    loanList.prepend(item);
    if (window.lucide) lucide.createIcons();
    return item;
}

function undoLastReservation() {
    if (!lastCreatedLoan) return;
    lastCreatedLoan.remove();
    lastCreatedLoan = null;
    statusMessage.textContent = "Reserva desfeita. Nenhuma solicitação foi enviada ao técnico.";
    showToast("Reserva desfeita.");
}

reserveButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest("[data-search-item]");
        openReservationPanel(getEquipmentData(card), button);
    });
});

confirmReservation.addEventListener("click", () => {
    if (!selectedEquipment) {
        showToast("Escolha um equipamento antes de confirmar a reserva.");
        return;
    }

    const reservedEquipment = selectedEquipment;
    lastCreatedLoan = addPendingLoan(reservedEquipment);
    closeReservationPanel();
    navigateTo("emprestimos");
    statusMessage.textContent = `Reserva de ${reservedEquipment.name} enviada. Status: pendente de análise.`;
    showToast(`Reserva de ${reservedEquipment.name} enviada ao técnico.`, "Desfazer", undoLastReservation);
});

cancelReservation.addEventListener("click", closeReservationPanel);
closeReservation.addEventListener("click", closeReservationPanel);

newLoanButton.addEventListener("click", () => {
    navigateTo("equipamentos");
    searchInput.focus();
    showToast("Pesquise ou escolha um equipamento disponível para iniciar a reserva.");
});

notificationButton.addEventListener("click", () => {
    showToast("Você não tem novas notificações do almoxarifado.");
});

helpButton.addEventListener("click", () => {
    showToast("Para reservar: escolha o item, confira os dados e devolva em até 6 horas após a retirada.");
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

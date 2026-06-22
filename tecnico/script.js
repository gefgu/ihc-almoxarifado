if (window.lucide) lucide.createIcons();

const requests = {
    1: { name: "João Martins", ra: "20231234", course: "Engenharia Elétrica", email: "joao.martins@aluno.utfpr.br", item: "Osciloscópio Digital", code: "PAT-25012", available: "14 unidades", date: "16/05/2025 09:24", loans: 3, icon: "monitor-speaker", reason: "Necessário para realização de ensaios e captura de sinais no projeto de laboratório." },
    2: { name: "Maria Souza", ra: "20224567", course: "Engenharia Eletrônica", email: "maria.souza@aluno.utfpr.br", item: "Multímetro Digital", code: "PAT-18045", available: "8 unidades", date: "16/05/2025 09:02", loans: 5, icon: "gauge", reason: "Uso em medições do projeto integrador da disciplina de circuitos." },
    3: { name: "Pedro Lima", ra: "20239876", course: "Engenharia de Computação", email: "pedro.lima@aluno.utfpr.br", item: "Fonte DC Regulável", code: "PAT-22410", available: "6 unidades", date: "16/05/2025 08:41", loans: 2, icon: "battery-charging", reason: "Alimentação controlada para testes de um protótipo eletrônico." },
    4: { name: "Ana Pereira", ra: "20231011", course: "Engenharia Elétrica", email: "ana.pereira@aluno.utfpr.br", item: "Gerador de Função", code: "PAT-19008", available: "4 unidades", date: "15/05/2025 16:18", loans: 4, icon: "audio-waveform", reason: "Geração de sinais para a validação de filtros analógicos em laboratório." }
};

const dashboard = document.getElementById("dashboard");
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const collapseSidebar = document.getElementById("collapseSidebar");
const sideLinks = [...document.querySelectorAll("[data-section]")];
const requestRows = [...document.querySelectorAll(".request-row")];
const searchableItems = [...document.querySelectorAll("[data-searchable]")];
const globalSearch = document.getElementById("globalSearch");
const requestEmpty = document.getElementById("requestEmpty");
const approveButton = document.getElementById("approveRequest");
const rejectButton = document.getElementById("rejectRequest");
const rejectionReason = document.getElementById("rejectionReason");
const reasonCount = document.getElementById("reasonCount");
const reasonError = document.getElementById("reasonError");
const toast = document.getElementById("toast");
const searchFeedback = document.getElementById("searchFeedback");
const helpButton = document.getElementById("helpButton");
const helpPanel = document.getElementById("helpPanel");
const closeHelp = document.getElementById("closeHelp");
const confirmPanel = document.getElementById("confirmPanel");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmStudent = document.getElementById("confirmStudent");
const confirmItem = document.getElementById("confirmItem");
const confirmConsequence = document.getElementById("confirmConsequence");
const confirmDecision = document.getElementById("confirmDecision");
const cancelDecision = document.getElementById("cancelDecision");
let selectedRequestId = 1;
let toastTimer;
let pendingDecision = null;
let lastFocus = null;
let lastDecision = null;

function setSidebar(open) {
    sidebar.classList.toggle("open", open);
    sidebarBackdrop.classList.toggle("open", open);
    sidebar.setAttribute("aria-hidden", String(!open && window.innerWidth <= 900));
    openSidebar.setAttribute("aria-expanded", String(open));
}

openSidebar.addEventListener("click", () => setSidebar(true));
closeSidebar.addEventListener("click", () => setSidebar(false));
sidebarBackdrop.addEventListener("click", () => setSidebar(false));
collapseSidebar.addEventListener("click", () => dashboard.classList.toggle("sidebar-collapsed"));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && confirmPanel && !confirmPanel.hidden) closeConfirmPanel();
    if (event.key === "Escape") setSidebar(false);
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        globalSearch.focus();
    }
});

sideLinks.forEach((link) => {
    link.addEventListener("click", () => {
        sideLinks.forEach((item) => item.classList.toggle("active", item === link));
        document.getElementById("pageTitle").textContent = link.dataset.section;
        setSidebar(false);
    });
});

function refreshIcons() {
    if (window.lucide) lucide.createIcons();
}

function selectRequest(id) {
    const request = requests[id];
    if (!request) return;
    selectedRequestId = Number(id);
    requestRows.forEach((row) => row.classList.toggle("selected", row.dataset.requestId === String(id)));
    document.getElementById("detailName").textContent = request.name;
    document.getElementById("detailRa").textContent = `RA: ${request.ra}`;
    document.getElementById("detailCourse").textContent = request.course;
    document.getElementById("detailEmail").textContent = request.email;
    document.getElementById("detailLoans").textContent = request.loans;
    document.getElementById("detailItem").textContent = request.item;
    document.getElementById("detailCode").textContent = request.code;
    document.getElementById("detailAvailable").textContent = request.available;
    document.getElementById("detailDate").textContent = request.date;
    document.getElementById("detailReason").textContent = request.reason;
    const icon = document.getElementById("detailIcon");
    icon.setAttribute("data-lucide", request.icon);
    const row = document.querySelector(`[data-request-id="${id}"]`);
    const status = row.querySelector(".badge").textContent;
    document.getElementById("detailStatus").textContent = status === "Pendente" ? "Aguardando análise" : `Solicitação ${status.toLowerCase()}`;
    const resolved = status !== "Pendente";
    approveButton.disabled = resolved;
    rejectButton.disabled = resolved;
    rejectionReason.disabled = resolved;
    rejectionReason.value = "";
    rejectionReason.setAttribute("aria-invalid", "false");
    reasonError.hidden = true;
    reasonCount.textContent = "0";
    refreshIcons();
}

requestRows.forEach((row) => {
    row.addEventListener("click", () => selectRequest(row.dataset.requestId));
    row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectRequest(row.dataset.requestId);
        }
    });
});

function normalize(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function applySearch() {
    const query = normalize(globalSearch.value);
    let visibleCount = 0;
    searchableItems.forEach((item) => {
        const visible = normalize(item.dataset.searchable).includes(query);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
    });
    requestEmpty.hidden = requestRows.some((row) => !row.hidden);
    searchFeedback.textContent = query
        ? `${visibleCount} ${visibleCount === 1 ? "registro encontrado" : "registros encontrados"} para "${globalSearch.value.trim()}".`
        : "Mostrando todos os registros do painel.";
}

globalSearch.addEventListener("input", applySearch);

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
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4800);
}

function updatePendingCount() {
    const pendingCount = requestRows.filter((row) => row.querySelector(".badge").textContent === "Pendente").length;
    document.getElementById("pendingMetric").textContent = pendingCount;
    document.getElementById("pendingBadge").textContent = pendingCount;
    document.getElementById("sidebarPending").textContent = pendingCount;
}

function addActivity(message, type, icon) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="activity-icon ${type}"><i data-lucide="${icon}"></i></span><p>${message}</p><time>agora</time>`;
    document.getElementById("activityList").prepend(item);
    refreshIcons();
    return item;
}

function resolveRequest(status) {
    const row = document.querySelector(`[data-request-id="${selectedRequestId}"]`);
    const request = requests[selectedRequestId];
    const badge = row.querySelector(".badge");
    if (badge.textContent !== "Pendente") return;

    const previous = {
        row,
        badgeText: badge.textContent,
        badgeClass: badge.className,
        detailStatus: document.getElementById("detailStatus").textContent,
        activeLoans: document.getElementById("activeLoansMetric").textContent
    };
    badge.textContent = status;
    badge.className = `badge ${status === "Aprovada" ? "approved" : "rejected"}`;
    document.getElementById("detailStatus").textContent = `Solicitação ${status.toLowerCase()}`;
    approveButton.disabled = true;
    rejectButton.disabled = true;
    rejectionReason.disabled = true;
    updatePendingCount();

    const approved = status === "Aprovada";
    if (approved) {
        const activeLoansMetric = document.getElementById("activeLoansMetric");
        activeLoansMetric.textContent = Number(activeLoansMetric.textContent) + 1;
    }
    const activityItem = addActivity(
        `Solicitação ${approved ? "aprovada" : "recusada"} · ${request.name} · ${request.item}`,
        approved ? "success" : "alert",
        approved ? "check" : "x"
    );
    lastDecision = { previous, activityItem, requestId: selectedRequestId };
    showToast(
        `Solicitação de ${request.name} ${approved ? "aprovada" : "recusada"}. Métricas e histórico foram atualizados.`,
        "Desfazer",
        undoLastDecision
    );
}

function openConfirmPanel(status, trigger) {
    const request = requests[selectedRequestId];
    const approved = status === "Aprovada";
    pendingDecision = status;
    lastFocus = trigger || document.activeElement;
    confirmTitle.textContent = approved ? "Aprovar solicitação?" : "Recusar solicitação?";
    confirmMessage.textContent = approved
        ? "O aluno será autorizado a retirar este equipamento no almoxarifado."
        : "O aluno verá a recusa junto com o motivo informado.";
    confirmStudent.textContent = `${request.name} · RA ${request.ra}`;
    confirmItem.textContent = `${request.item} · ${request.code}`;
    confirmConsequence.textContent = approved
        ? "Status muda para Aprovada e Empréstimos ativos aumenta em 1."
        : "Status muda para Recusada e a solicitação sai das pendentes.";
    confirmDecision.className = `decision ${approved ? "approve" : "reject"}`;
    confirmDecision.textContent = approved ? "Confirmar aprovação" : "Confirmar recusa";
    confirmPanel.hidden = false;
    confirmPanel.setAttribute("aria-hidden", "false");
    confirmDecision.focus();
}

function closeConfirmPanel() {
    confirmPanel.hidden = true;
    confirmPanel.setAttribute("aria-hidden", "true");
    pendingDecision = null;
    if (lastFocus) lastFocus.focus();
}

function undoLastDecision() {
    if (!lastDecision) return;
    const { previous, activityItem, requestId } = lastDecision;
    const badge = previous.row.querySelector(".badge");
    badge.textContent = previous.badgeText;
    badge.className = previous.badgeClass;
    document.getElementById("activeLoansMetric").textContent = previous.activeLoans;
    if (activityItem) activityItem.remove();
    updatePendingCount();
    selectRequest(requestId);
    document.getElementById("detailStatus").textContent = previous.detailStatus;
    lastDecision = null;
    showToast("Decisão desfeita. A solicitação voltou para Pendente.");
}

approveButton.addEventListener("click", () => openConfirmPanel("Aprovada", approveButton));
rejectButton.addEventListener("click", () => {
    if (!rejectionReason.value.trim()) {
        rejectionReason.focus();
        rejectionReason.setAttribute("aria-invalid", "true");
        reasonError.hidden = false;
        showToast("Informe o motivo antes de recusar a solicitação.");
        return;
    }
    openConfirmPanel("Recusada", rejectButton);
});

rejectionReason.addEventListener("input", () => {
    reasonCount.textContent = rejectionReason.value.length;
    if (rejectionReason.value.trim()) {
        rejectionReason.setAttribute("aria-invalid", "false");
        reasonError.hidden = true;
    }
});

confirmDecision.addEventListener("click", () => {
    if (!pendingDecision) return;
    const status = pendingDecision;
    closeConfirmPanel();
    resolveRequest(status);
});

cancelDecision.addEventListener("click", closeConfirmPanel);

helpButton.addEventListener("click", () => {
    helpPanel.hidden = false;
    closeHelp.focus();
});

closeHelp.addEventListener("click", () => {
    helpPanel.hidden = true;
    helpButton.focus();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        sidebar.setAttribute("aria-hidden", "false");
        setSidebar(false);
    }
});

if (window.innerWidth <= 900) sidebar.setAttribute("aria-hidden", "true");
selectRequest(1);

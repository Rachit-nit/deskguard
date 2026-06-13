// Pre-loaded realistic scenario data for hackathon judges
const deskState = {
    101: { id: 101, status: 'OCCUPIED', awayTimeLeft: null, sessionTimeLeft: 8, graceTimeLeft: null }, // Will prompt verification in 8s!
    102: { id: 102, status: 'AWAY', awayTimeLeft: 15, sessionTimeLeft: null, graceTimeLeft: null },      // Live active tracking loop
    103: { id: 103, status: 'FREE', awayTimeLeft: null, sessionTimeLeft: null, graceTimeLeft: null },
    104: { id: 104, status: 'FREE', awayTimeLeft: null, sessionTimeLeft: null, graceTimeLeft: null }
};

let selectedDeskId = null;
let activePromptDeskId = null;
let totalAutoFreedCount = 3; // Initialized metrics metrics

// DOM Cache Selectors
const mapEl = document.getElementById('library-map');
const noSelectionPanel = document.getElementById('no-selection');
const activePanel = document.getElementById('active-panel');
const panelTitle = document.getElementById('panel-desk-title');
const panelStatus = document.getElementById('panel-status');
const timerContainer = document.getElementById('timer-container');
const clockDisplay = document.getElementById('countdown-clock');
const progressFill = document.getElementById('timer-progress');
const modalOverlay = document.getElementById('prompt-modal');
const modalCountdown = document.getElementById('modal-countdown');
const kpiAvailable = document.getElementById('kpi-available');
const kpiHoarded = document.getElementById('kpi-hoarded');

const btnConfirmPresence = document.getElementById('btn-confirm-presence');
const btnCheckIn = document.getElementById('btn-checkin');
const btnAway = document.getElementById('btn-away');
const btnReturn = document.getElementById('btn-return');
const btnCheckOut = document.getElementById('btn-checkout');

// Toast Notification DOM Elements
const toastEl = document.getElementById('toast-notification');
const toastMsg = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

function init() {
    updateVisualMapColors();
    setupMapClickHandlers();
    setupActionButtons();
    updateKPIDisplays();
    setInterval(backendServerSweepSimulation, 1000);
}

function showLiveToast(message, icon = '🛡️') {
    toastIcon.innerText = icon;
    toastMsg.innerText = message;
    toastEl.classList.remove('hidden');
    setTimeout(() => { toastEl.classList.add('hidden'); }, 4000);
}

function setupMapClickHandlers() {
    const desks = mapEl.querySelectorAll('.desk');
    desks.forEach(desk => {
        desk.addEventListener('click', () => {
            desks.forEach(d => d.classList.remove('selected'));
            selectedDeskId = parseInt(desk.getAttribute('data-id'));
            desk.classList.add('selected');
            renderControlPanel();
        });
    });
}

function updateVisualMapColors() {
    Object.keys(deskState).forEach(id => {
        const deskGroup = mapEl.querySelector(`.desk[data-id="${id}"]`);
        if (deskGroup) {
            deskGroup.classList.remove('state-free', 'state-occupied', 'state-away');
            deskGroup.classList.add('state-' + deskState[id].status.toLowerCase());
        }
    });
}

function updateKPIDisplays() {
    let freeCount = 0;
    Object.keys(deskState).forEach(id => {
        if (deskState[id].status === 'FREE') freeCount++;
    });
    kpiAvailable.innerText = freeCount;
    kpiHoarded.innerText = totalAutoFreedCount;
}

function renderControlPanel() {
    if (!selectedDeskId) return;
    
    noSelectionPanel.classList.add('hidden');
    activePanel.classList.remove('hidden');
    
    const currentDesk = deskState[selectedDeskId];
    panelTitle.innerText = `Workstation #${selectedDeskId}`;
    panelStatus.innerText = currentDesk.status;
    panelStatus.className = 'status-badge status-' + currentDesk.status.toLowerCase();

    btnCheckIn.classList.add('hidden');
    btnAway.classList.add('hidden');
    btnReturn.classList.add('hidden');
    btnCheckOut.classList.add('hidden');
    timerContainer.classList.add('hidden');

    if (currentDesk.status === 'FREE') {
        btnCheckIn.classList.remove('hidden');
    } else if (currentDesk.status === 'OCCUPIED') {
        btnAway.classList.remove('hidden'); 
        btnCheckOut.classList.remove('hidden');
    } else if (currentDesk.status === 'AWAY') {
        btnReturn.classList.remove('hidden'); 
        btnCheckOut.classList.remove('hidden');
        timerContainer.classList.remove('hidden');
        updateClockDisplay(currentDesk.awayTimeLeft, 20);
    }
}

function setupActionButtons() {
    btnCheckIn.addEventListener('click', () => {
        if (!selectedDeskId) return;
        deskState[selectedDeskId].status = 'OCCUPIED';
        deskState[selectedDeskId].sessionTimeLeft = 10; 
        deskState[selectedDeskId].graceTimeLeft = null;
        updateVisualMapColors(); renderControlPanel(); updateKPIDisplays();
    });

    btnAway.addEventListener('click', () => {
        if (!selectedDeskId) return;
        deskState[selectedDeskId].status = 'AWAY';
        deskState[selectedDeskId].awayTimeLeft = 20; 
        deskState[selectedDeskId].sessionTimeLeft = null;
        updateVisualMapColors(); renderControlPanel(); updateKPIDisplays();
    });

    btnReturn.addEventListener('click', () => {
        if (!selectedDeskId) return;
        deskState[selectedDeskId].status = 'OCCUPIED';
        deskState[selectedDeskId].awayTimeLeft = null; 
        deskState[selectedDeskId].sessionTimeLeft = 10;
        updateVisualMapColors(); renderControlPanel(); updateKPIDisplays();
    });

    btnCheckOut.addEventListener('click', () => { 
        if (selectedDeskId) resetDeskState(selectedDeskId); 
    });

    btnConfirmPresence.addEventListener('click', () => {
        if (activePromptDeskId) {
            const desk = deskState[activePromptDeskId];
            desk.status = 'OCCUPIED'; 
            desk.sessionTimeLeft = 10; 
            desk.graceTimeLeft = null;
            modalOverlay.classList.add('hidden'); 
            activePromptDeskId = null;
            updateVisualMapColors(); renderControlPanel(); updateKPIDisplays();
            showLiveToast(`Workstation session verified for Desk #${desk.id}!`, '✅');
        }
    });

    // Admin Clearing Button Overrides
    document.getElementById('btn-admin-clear').addEventListener('click', () => {
        if (selectedDeskId) {
            resetDeskState(selectedDeskId);
            showLiveToast(`Librarian cleared Workstation #${selectedDeskId} manually.`, '🧹');
        } else {
            showLiveToast("Please select a desk block to clean up.", '❌');
        }
    });
}

function resetDeskState(id) {
    deskState[id] = { id: id, status: 'FREE', awayTimeLeft: null, sessionTimeLeft: null, graceTimeLeft: null };
    if (activePromptDeskId === id) { modalOverlay.classList.add('hidden'); activePromptDeskId = null; }
    updateVisualMapColors(); renderControlPanel(); updateKPIDisplays();
}

function updateClockDisplay(secs, maxDuration) {
    clockDisplay.innerText = `00:${secs.toString().padStart(2, '0')}`;
    const pct = (secs / maxDuration) * 100;
    progressFill.style.width = `${pct}%`;
}

function backendServerSweepSimulation() {
    let changed = false;

    Object.keys(deskState).forEach(id => {
        const desk = deskState[id];

        if (desk.status === 'AWAY' && desk.awayTimeLeft !== null) {
            desk.awayTimeLeft--;
            if (desk.awayTimeLeft <= 0) { 
                totalAutoFreedCount++;
                resetDeskState(id); 
                changed = true; 
                showLiveToast(`Desk ${id} auto-released. Away token expired!`, '⏳');
            } else if (selectedDeskId === parseInt(id)) {
                updateClockDisplay(desk.awayTimeLeft, 20);
            }
        }

        if (desk.status === 'OCCUPIED' && desk.sessionTimeLeft !== null) {
            desk.sessionTimeLeft--;
            if (desk.sessionTimeLeft <= 0) {
                desk.sessionTimeLeft = null; 
                desk.graceTimeLeft = 5; 
                activePromptDeskId = parseInt(id);
                modalCountdown.innerText = 5; 
                modalOverlay.classList.remove('hidden');
            }
        }

        if (desk.graceTimeLeft !== null && activePromptDeskId === parseInt(id)) {
            desk.graceTimeLeft--;
            modalCountdown.innerText = desk.graceTimeLeft;
            if (desk.graceTimeLeft <= 0) { 
                totalAutoFreedCount++;
                resetDeskState(id); 
                changed = true; 
                showLiveToast(`Desk ${id} reclaimed due to inactive validation timeout!`, '🚨');
            }
        }
    });

    if (changed) { 
        updateVisualMapColors(); renderControlPanel(); updateKPIDisplays(); 
    }
}

init();

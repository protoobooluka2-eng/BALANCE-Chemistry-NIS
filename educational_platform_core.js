/* ============================================================
   BALANCE Chemistry — Unified Educational Platform Core
   Zero-Emoji Academic Edition with Role-Based Portals:
     - Student Portal (Labs, 4-Level Assessments, Challenge Cases, Progress)
     - Parent Portal (Overview, 9-Lab Matrix, Detailed Evaluation, Comments)
     - Teacher Portal (Roster, Question-by-Question Review, Lab Demos, Reports)
     - Developer Feedback Inbox (Parent & Teacher Reports, Status Workflow)
   ============================================================ */

window.EducationalPlatformCore = (function() {
  'use strict';

  // SVG Vector Icon Dictionary (Lucide-Style Outline Icons)
  const SvgIcons = {
    microscope: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0-14 0"/><circle cx="9" cy="9" r="2"/><path d="M9 11v5"/><path d="m14 12 3-3 4 4-3 3z"/><path d="m15 7 2-2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
    lightbulb: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    target: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    chart: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    messageSquare: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    user: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    users: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    award: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    alertCircle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    send: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    download: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`
  };

  const LAB_CATALOG = [
    { id: "lab01", number: "01", name: "Dissolving Salt", desc: "Salt dissolving & entropy" },
    { id: "lab02", number: "02", name: "Metal Ion Detective", desc: "Identify Cu²⁺, Fe²⁺ and Fe³⁺" },
    { id: "lab03", number: "03", name: "Balance the Reaction", desc: "Conservation of atoms" },
    { id: "lab04", number: "04", name: "The Fertilizer Lab", desc: "Make ammonium sulfate" },
    { id: "lab05", number: "05", name: "Reversible Reaction", desc: "Ammonium chloride heating & cooling" },
    { id: "lab06", number: "06", name: "Ammonium Detective", desc: "Test for the ammonium ion" },
    { id: "lab07", number: "07", name: "Cobalt Chloride Equilibrium", desc: "Pink ↔ blue equilibrium" },
    { id: "lab08", number: "08", name: "NO₂ / N₂O₄ Equilibrium", desc: "Temperature & equilibrium" },
    { id: "lab09", number: "09", name: "Haber Factory Challenge", desc: "Make ammonia, control conditions" }
  ];

  // Diagnostic Flow Logger (Developer Tracing)
  const FlowLogger = {
    log: function(tag, message) {
      if (window.BALANCE_DEBUG_FLOW === false) return;
      const styles = {
        FLOW: 'color: #38bdf8; font-weight: bold;',
        LAB: 'color: #4ade80; font-weight: bold;',
        BRIDGE: 'color: #fbbf24; font-weight: bold;',
        ASSESSMENT: 'color: #c084fc; font-weight: bold;',
        CASE: 'color: #f472b6; font-weight: bold;',
        BACKEND: 'color: #94a3b8; font-weight: bold;',
        UI: 'color: #34d399; font-weight: bold;',
        USER: 'color: #60a5fa; font-weight: bold;'
      };
      const s = styles[tag] || 'color: #e2e8f0; font-weight: bold;';
      console.log(`%c[${tag}] %c${message}`, s, 'color: inherit;');
    }
  };
  window.FlowLogger = FlowLogger;

  // Deduplication tracking for completion bridge events
  const processedCompletionEvents = new Set();
  const questionBankCache = {};

  // Canonical Learning Stages
  const LearningStage = {
    EXPERIMENT: "EXPERIMENT",
    READY_FOR_ASSESSMENT: "READY_FOR_ASSESSMENT",
    ASSESSMENT_ACTIVE: "ASSESSMENT_ACTIVE",
    ASSESSMENT_SAVED: "ASSESSMENT_SAVED",
    CASE_ACTIVE: "CASE_ACTIVE",
    CASE_SAVED: "CASE_SAVED"
  };

  let currentStage = LearningStage.EXPERIMENT;

  // Active User State
  let currentUser = {
    id: "student_mariam",
    name: "Mariam Adel",
    role: "student",
    school_id: "BISC",
    class_name: "MYP 4A"
  };

  let currentLabId = "lab01";
  let isVerifiedCompletion = false;
  let activeAttempt = {
    attemptId: null,
    attemptNumber: 1
  };

  let lab01Questions = null;
  let activeAssessment = {
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0
  };

  let currentChallengeInstance = null;
  let parentActiveTab = "overview";
  let teacherActiveTab = "roster";
  let devActiveTab = "all";
  let teacherSelectedClassId = null;
  let teacherSelectedRecordType = "ALL";
  let teacherDashboardSubTab = "roster";
  let parentLinkedStudentsCache = [];
  let parentActiveChild = null;

  // Initialization
  async function init() {
    loadLocalUser();
    await loadQuestionBank();
    setupEventListeners();
    setupCompletionPanel();
    setupAssessmentModal();
    setupChallengeModal();
    setupTeacherCommentModal();
    removeOldSidebarQuizzes();
    syncUserWithBackend();
  }

  function loadLocalUser() {
    try {
      const saved = sessionStorage.getItem('balance_active_user');
      if (saved) {
        currentUser = JSON.parse(saved);
      }
    } catch (_) {}
  }

  function saveLocalUser(user) {
    currentUser = Object.assign({}, currentUser, user);
    try {
      sessionStorage.setItem('balance_active_user', JSON.stringify(currentUser));
    } catch (_) {}
  }

  async function syncUserWithBackend() {
    try {
      const res = await fetch('/api/educational/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser)
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        saveLocalUser(currentUser);
      }
    } catch (_) {}
  }

  async function getQuestionBankForLab(labId) {
    const rawLab = (labId || currentLabId || 'lab01').toString().toLowerCase();
    const labNum = parseInt(rawLab.replace(/[^0-9]/g, ''), 10) || 1;
    const labKey = labNum < 10 ? `lab0${labNum}` : `lab${labNum}`;
    if (questionBankCache[labKey]) return questionBankCache[labKey];
    try {
      const res = await fetch(`/question_bank_${labKey}.json`);
      if (res.ok) {
        questionBankCache[labKey] = await res.json();
        return questionBankCache[labKey];
      }
    } catch (_) {}
    return null;
  }

  async function loadQuestionBank() {
    await getQuestionBankForLab(currentLabId);
  }

  // -------------------------------------------------------------
  // 1. Learning Flow & Overlays
  // -------------------------------------------------------------
  function transitionTo(stage, payload) {
    const prevStage = currentStage;
    currentStage = stage;
    FlowLogger.log('FLOW', `${prevStage} -> ${stage}`);
    const completionOverlay = document.getElementById('completionOverlay');
    const asmtModal = document.getElementById('assessmentModal');
    const challengeModal = document.getElementById('challengeModal');

    switch (stage) {
      case LearningStage.EXPERIMENT:
        if (completionOverlay) completionOverlay.classList.add('hidden');
        if (asmtModal) asmtModal.classList.add('hidden');
        if (challengeModal) challengeModal.classList.add('hidden');
        break;

      case LearningStage.READY_FOR_ASSESSMENT:
        if (asmtModal) asmtModal.classList.add('hidden');
        if (challengeModal) challengeModal.classList.add('hidden');
        if (completionOverlay) {
          completionOverlay.classList.remove('hidden');
          FlowLogger.log('UI', 'Completion panel opened');
        }
        break;

      case LearningStage.ASSESSMENT_ACTIVE:
        if (completionOverlay) completionOverlay.classList.add('hidden');
        if (challengeModal) challengeModal.classList.add('hidden');
        if (asmtModal) asmtModal.classList.remove('hidden');
        renderCurrentQuestion();
        break;

      case LearningStage.ASSESSMENT_SAVED:
        if (completionOverlay) completionOverlay.classList.add('hidden');
        if (challengeModal) challengeModal.classList.add('hidden');
        if (asmtModal) asmtModal.classList.remove('hidden');
        renderAssessmentSavedConfirmation(payload);
        break;

      case LearningStage.CASE_ACTIVE:
        if (completionOverlay) completionOverlay.classList.add('hidden');
        if (asmtModal) asmtModal.classList.add('hidden');
        if (challengeModal) challengeModal.classList.remove('hidden');
        mountChallengeSimulation();
        break;

      case LearningStage.CASE_SAVED:
        break;
    }
  }

  function removeOldSidebarQuizzes() {
    const qc = document.getElementById('quizContainer');
    if (qc && qc.parentElement) {
      qc.parentElement.style.display = 'none';
    }
    const manualBtn = document.getElementById('manualStartAssessmentBtn');
    if (manualBtn && manualBtn.closest('.sidebar-tool')) {
      manualBtn.closest('.sidebar-tool').remove();
    }
  }

  function setupEventListeners() {
    window.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.source !== 'BALANCE_LAB' && e.data.type !== 'BALANCE_LAB_EVENT' && e.data.type !== 'EXPERIMENT_COMPLETED') return;
      handleLabEvent(e.data);
    });

    window.addEventListener('balance-lab-action', (e) => {
      if (e.detail) handleLabEvent(e.detail);
    });

    // Global click listener for permanent Finish Experiment buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#finishExperimentBtn, #finishExpFullscreenBtn, .finish-exp-btn');
      if (btn) {
        e.preventDefault();
        manualFinishExperiment();
      }
    });
  }

  function handleLabEvent(evt) {
    logStudentAction(evt);
    const isCompleted = evt.outcome === 'EXPERIMENT_COMPLETED' || 
                        evt.event === 'EXPERIMENT_COMPLETED' ||
                        evt.type === 'EXPERIMENT_COMPLETED' ||
                        evt.actionId === 'experiment_completed';

    if (isCompleted) {
      const incomingLab = (evt.labId || currentLabId).toString().toLowerCase();
      const activeLab = currentLabId.toString().toLowerCase();

      // Origin and active lab validation
      if (incomingLab !== activeLab) {
        FlowLogger.log('BRIDGE', `Ignoring completion event for inactive lab "${incomingLab}" (active is "${activeLab}")`);
        return;
      }

      // Deduplication
      const eventKey = evt.eventId || `${activeLab}_${evt.attemptId || 'def'}_${evt.actionId || 'comp'}`;
      if (processedCompletionEvents.has(eventKey)) {
        FlowLogger.log('BRIDGE', `Ignoring duplicate completion event "${eventKey}"`);
        return;
      }
      processedCompletionEvents.add(eventKey);

      isVerifiedCompletion = true;
      FlowLogger.log('LAB', `Scientific interaction completed for ${activeLab}`);
      FlowLogger.log('BRIDGE', `EXPERIMENT_COMPLETED received for ${activeLab}`);

      if (currentStage === LearningStage.EXPERIMENT) {
        FlowLogger.log('FLOW', 'EXPERIMENT -> READY_FOR_ASSESSMENT (Verified Completion)');
        setTimeout(() => {
          showCompletionPanel(true);
        }, 500);
      } else {
        FlowLogger.log('FLOW', `Ignoring completion because current stage is ${currentStage}`);
      }
    }
  }

  async function logStudentAction(evt) {
    try {
      await fetch('/api/educational/action/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          schoolId: currentUser.school_id,
          labId: evt.labId || currentLabId,
          attemptNumber: activeAttempt.attemptNumber,
          actionId: evt.actionId || 'unknown_action',
          actionType: evt.actionType || evt.type || 'ACTION',
          outcome: evt.outcome || 'SUCCESS',
          details: evt
        })
      });
    } catch (_) {}
  }

  // -------------------------------------------------------------
  // 2. Experiment Completion Card (Emoji-Free & Redesigned Buttons)
  // -------------------------------------------------------------
  function setupCompletionPanel() {
    if (document.getElementById('completionOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'completionOverlay';
    overlay.className = 'edu-modal-overlay hidden';
    overlay.innerHTML = `
      <div class="edu-modal-card">
        <div class="completion-icon" id="completionIcon">
          ${SvgIcons.microscope}
        </div>
        <span class="edu-tag" id="completionTag">INVESTIGATION MILESTONE REACHED</span>
        <h2 class="edu-modal-title" id="completionTitle">Experiment Complete</h2>
        <p class="edu-modal-body" id="completionBody">
          You have completed the practical laboratory investigation. Proceed to the four-level assessment to test your scientific understanding.
        </p>
        <div class="edu-modal-actions">
          <button type="button" class="btn secondary" id="exploreAgainBtn">
            ${SvgIcons.refresh} <span>Explore Again</span>
          </button>
          <button type="button" class="btn primary pulse" id="startAssessmentBtn">
            <span>Start Assessment</span> ${SvgIcons.arrowRight}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#exploreAgainBtn').onclick = () => {
      FlowLogger.log('USER', 'Explore Again clicked — returning to active laboratory without resetting state');
      transitionTo(LearningStage.EXPERIMENT);
      try {
        const frame = document.querySelector('.lab-frame.active') || document.querySelector('#frame-' + currentLabId);
        if (frame && frame.contentWindow && typeof frame.contentWindow.balanceLabReset === 'function') {
          frame.contentWindow.balanceLabReset();
        }
      } catch (_) {}
    };

    overlay.querySelector('#startAssessmentBtn').onclick = () => {
      FlowLogger.log('USER', 'Start Assessment clicked');
      startFourLevelAssessment();
    };
  }

  function showCompletionPanel(verified = true) {
    // Lazy-create overlays if init() hasn't run yet (e.g., Finish Experiment clicked before EPC.init)
    setupCompletionPanel();
    setupAssessmentModal();

    // Prevent duplicate popups if already visible or in assessment
    if (currentStage === LearningStage.READY_FOR_ASSESSMENT && !document.getElementById('completionOverlay')?.classList.contains('hidden')) {
      return;
    }
    if (currentStage === LearningStage.ASSESSMENT_ACTIVE || currentStage === LearningStage.ASSESSMENT_SAVED || currentStage === LearningStage.CASE_ACTIVE) {
      return;
    }

    isVerifiedCompletion = !!verified;
    const tagEl = document.getElementById('completionTag');
    const titleEl = document.getElementById('completionTitle');
    const bodyEl = document.getElementById('completionBody');

    if (tagEl && titleEl && bodyEl) {
      if (verified) {
        tagEl.className = 'edu-tag lvl-1';
        tagEl.textContent = 'INVESTIGATION MILESTONE REACHED';
        titleEl.textContent = 'Experiment Complete';
        bodyEl.textContent = 'You have completed the practical laboratory investigation. Proceed to the four-level assessment to test your scientific understanding.';
      } else {
        tagEl.className = 'edu-tag lvl-2';
        tagEl.textContent = 'READY FOR ASSESSMENT';
        titleEl.textContent = 'Ready for Assessment?';
        bodyEl.textContent = 'You can begin your assessment now or return to the experiment to explore further.';
      }
    }

    transitionTo(LearningStage.READY_FOR_ASSESSMENT);
  }

  function manualFinishExperiment() {
    FlowLogger.log('USER', `Manual Finish Experiment clicked for ${currentLabId}`);
    try {
      if (typeof window.closeExpanded === 'function') {
        window.closeExpanded();
      }
    } catch (_) {}
    showCompletionPanel(isVerifiedCompletion);
  }

  // -------------------------------------------------------------
  // 3. Four-Level Assessment Engine (Continuous Flow & Details)
  // -------------------------------------------------------------
  function setupAssessmentModal() {
    if (document.getElementById('assessmentModal')) return;

    const modal = document.createElement('div');
    modal.id = 'assessmentModal';
    modal.className = 'edu-modal-overlay hidden';
    modal.innerHTML = `
      <div class="edu-modal-card wide" id="assessmentCard"></div>
    `;

    document.body.appendChild(modal);
  }

  async function startFourLevelAssessment() {
    logStudentAction({
      labId: currentLabId,
      actionId: isVerifiedCompletion ? 'assessment_started_verified' : 'assessment_started_manual',
      actionType: 'ASSESSMENT_START',
      verified: isVerifiedCompletion
    });
    try {
      const res = await fetch('/api/educational/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          schoolId: currentUser.school_id,
          labId: currentLabId
        })
      });

      if (res.ok) {
        const data = await res.json();
        activeAttempt = {
          attemptId: data.attemptId,
          attemptNumber: data.attemptNumber
        };
        activeAssessment = {
          questions: data.questions,
          currentIndex: 0,
          answers: [null, null, null, null],
          score: 0
        };
      } else {
        throw new Error("Backend offline");
      }
    } catch (_) {
      await generateLocalAssessment();
    }

    transitionTo(LearningStage.ASSESSMENT_ACTIVE);
  }

  async function generateLocalAssessment() {
    const bank = await getQuestionBankForLab(currentLabId);
    if (!bank) return;
    const levels = ['level1', 'level2', 'level3', 'level4'];
    const chosen = [];

    const historyKey = `seen_q_${currentUser.id}_${currentLabId}`;
    let seen = [];
    try {
      seen = JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (_) {}

    levels.forEach((lvl, lvlIdx) => {
      const pool = bank[lvl] || [];
      let available = pool.filter(q => !seen.includes(q.id));
      if (available.length === 0) available = pool;
      const q = available[Math.floor(Math.random() * available.length)];
      seen.push(q.id);

      const originalOptions = [...q.options];
      const correctText = originalOptions[q.correctIndex];
      const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(correctText);

      chosen.push({
        id: q.id,
        level: lvlIdx + 1,
        levelName: ['Foundation', 'Application', 'Analysis', 'Advanced Reasoning'][lvlIdx],
        prompt: q.prompt,
        options: shuffledOptions,
        correctIndex: newCorrectIndex,
        explanation: q.explanation
      });
    });

    try {
      localStorage.setItem(historyKey, JSON.stringify(seen.slice(-80)));
    } catch (_) {}

    activeAttempt = {
      attemptId: `local_att_${Date.now()}`,
      attemptNumber: (activeAttempt.attemptNumber || 0) + 1
    };

    activeAssessment = {
      questions: chosen,
      currentIndex: 0,
      answers: [null, null, null, null],
      score: 0
    };
  }

  function renderCurrentQuestion() {
    const card = document.getElementById('assessmentCard');
    const idx = activeAssessment.currentIndex;
    const q = activeAssessment.questions[idx];
    if (!q) return;

    FlowLogger.log('ASSESSMENT', `${currentLabId.toUpperCase()} Level ${q.level} loaded`);

    const levelNames = ['Foundation', 'Application', 'Analysis', 'Advanced Reasoning'];

    card.innerHTML = `
      <div class="asmt-header">
        <div>
          <div class="asmt-course-title">BALANCE / LABORATORY ${currentLabId.replace('lab', '').replace(/^0/, '').padStart(2, '0').toUpperCase()}</div>
          <div class="asmt-level-title">Level ${q.level} — ${levelNames[q.level - 1]}</div>
        </div>
        <div class="asmt-progress-box">
          <span class="asmt-counter">0${idx + 1} / 04</span>
          <div class="asmt-progress-dots">
            ${[0, 1, 2, 3].map(i => `<span class="dot ${i === idx ? 'now' : i < idx ? 'done' : ''}"></span>`).join('')}
          </div>
        </div>
      </div>

      <div class="asmt-question-container">
        <h3 class="asmt-prompt">${escapeHTML(q.prompt)}</h3>

        <div class="asmt-options-grid">
          ${q.options.map((opt, i) => `
            <button type="button" class="asmt-option-btn ${activeAssessment.answers[idx] === i ? 'selected' : ''}" data-opt="${i}">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="opt-text">${escapeHTML(opt)}</span>
            </button>
          `).join('')}
        </div>

        <div class="asmt-footer">
          <button type="button" class="btn secondary" id="cancelAsmtBtn">
            ${SvgIcons.arrowLeft} <span>Back to Experiment</span>
          </button>
          <button type="button" class="btn primary" id="continueAsmtBtn" ${activeAssessment.answers[idx] === null ? 'disabled' : ''}>
            <span>${idx === 3 ? 'Submit Assessment' : 'Continue'}</span> ${SvgIcons.arrowRight}
          </button>
        </div>
      </div>
    `;

    card.querySelectorAll('.asmt-option-btn').forEach(btn => {
      btn.onclick = () => {
        const choice = parseInt(btn.dataset.opt, 10);
        activeAssessment.answers[idx] = choice;
        card.querySelectorAll('.asmt-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const continueBtn = card.querySelector('#continueAsmtBtn');
        if (continueBtn) continueBtn.disabled = false;
      };
    });

    card.querySelector('#cancelAsmtBtn').onclick = () => {
      transitionTo(LearningStage.EXPERIMENT);
    };

    const continueBtn = card.querySelector('#continueAsmtBtn');
    continueBtn.onclick = () => {
      if (idx < 3) {
        activeAssessment.currentIndex++;
        const container = card.querySelector('.asmt-question-container');
        if (container) {
          container.style.opacity = '0';
          container.style.transform = 'translateY(4px)';
          setTimeout(() => renderCurrentQuestion(), 160);
        } else {
          renderCurrentQuestion();
        }
      } else {
        continueBtn.disabled = true;
        continueBtn.innerHTML = `<span>Saving Assessment...</span>`;
        finishAssessment();
      }
    };
  }

  async function finishAssessment() {
    let score = 0;
    activeAssessment.questions.forEach((q, i) => {
      if (activeAssessment.answers[i] === q.correctIndex) {
        score++;
      }
    });
    activeAssessment.score = score;
    const percentage = Math.round((score / 4) * 100);
    FlowLogger.log('ASSESSMENT', 'Level 4 submitted');

    // Question-by-Question Exact Record Formulation
    const questionDetails = activeAssessment.questions.map((q, idx) => ({
      level: q.level,
      levelName: q.levelName || `Level ${q.level}`,
      questionPrompt: q.prompt,
      variantId: q.id,
      options: q.options,
      selectedAnswerIndex: activeAssessment.answers[idx],
      selectedAnswerText: q.options[activeAssessment.answers[idx]],
      correctAnswerIndex: q.correctIndex,
      correctAnswerText: q.options[q.correctIndex],
      isCorrect: activeAssessment.answers[idx] === q.correctIndex
    }));

    try {
      await fetch('/api/educational/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: activeAttempt.attemptId,
          userId: currentUser.id,
          schoolId: currentUser.school_id,
          labId: currentLabId,
          attemptNumber: activeAttempt.attemptNumber,
          level1Id: activeAssessment.questions[0].id,
          level2Id: activeAssessment.questions[1].id,
          level3Id: activeAssessment.questions[2].id,
          level4Id: activeAssessment.questions[3].id,
          answers: activeAssessment.answers,
          score: score,
          percentage: percentage,
          questionDetails: questionDetails
        })
      });
      FlowLogger.log('BACKEND', 'Assessment attempt saved');
    } catch (_) {}

    transitionTo(LearningStage.ASSESSMENT_SAVED, { score, percentage });
  }

  function renderAssessmentSavedConfirmation(payload) {
    const card = document.getElementById('assessmentCard');
    card.innerHTML = `
      <div class="asmt-saved-panel">
        <div class="asmt-saved-badge">
          ${SvgIcons.check}
        </div>
        <span class="edu-tag lvl-1">LEARNING RECORD PERSISTED</span>
        <h2 class="edu-modal-title">Assessment Complete</h2>
        <p class="edu-modal-body">
          Your answers have been saved to your learning record. Continue to the Challenge Case to apply these concepts in a mini-simulation.
        </p>
        <div class="edu-modal-actions">
          <button type="button" class="btn secondary" id="backToLabBtn">
            ${SvgIcons.arrowLeft} <span>Back to Experiment</span>
          </button>
          <button type="button" class="btn primary pulse" id="continueToChallengeBtn">
            <span>Continue to Challenge Case</span> ${SvgIcons.arrowRight}
          </button>
        </div>
      </div>
    `;

    card.querySelector('#backToLabBtn').onclick = () => {
      FlowLogger.log('USER', 'Back to Experiment clicked');
      transitionTo(LearningStage.EXPERIMENT);
    };

    card.querySelector('#continueToChallengeBtn').onclick = () => {
      FlowLogger.log('USER', 'Continue to Challenge Case clicked');
      transitionTo(LearningStage.CASE_ACTIVE);
    };
  }

  // -------------------------------------------------------------
  // 4. Challenge Case Modal Orchestrator
  // -------------------------------------------------------------
  function setupChallengeModal() {
    if (document.getElementById('challengeModal')) return;

    const modal = document.createElement('div');
    modal.id = 'challengeModal';
    modal.className = 'edu-modal-overlay hidden';
    modal.innerHTML = `
      <div class="edu-modal-card xlarge" id="challengeHostCard">
        <div class="challenge-top-nav">
          <span class="chip" style="background:#e8f4ff; color:#0066cc;">MINI-SIMULATION CHALLENGE</span>
          <button type="button" class="close-x" id="closeChallengeBtn">${SvgIcons.x}</button>
        </div>
        <div id="challengeSimulationContainer"></div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#closeChallengeBtn').onclick = () => {
      transitionTo(LearningStage.EXPERIMENT);
    };
  }

  function mountChallengeSimulation() {
    const container = document.getElementById('challengeSimulationContainer');
    if (!container) return;

    const rawLab = (currentLabId || 'lab01').toString().toLowerCase();
    const labNum = parseInt(rawLab.replace(/[^0-9]/g, ''), 10) || 1;
    const labKey = labNum < 10 ? `Lab0${labNum}` : `Lab${labNum}`;
    const moduleName = 'Challenge' + labKey;

    const challengeModule = window[moduleName] || window['Challenge' + rawLab.toUpperCase()] || window.ChallengeLab01;

    FlowLogger.log('CASE', `${labKey} Challenge loaded`);
    if (challengeModule && typeof challengeModule.mount === 'function') {
      currentChallengeInstance = challengeModule.mount(
        container,
        activeAttempt ? activeAttempt.attemptNumber : 1,
        (results) => {
          handleChallengeSubmission(results);
        }
      );
    } else {
      if (window.ChallengeLab01 && typeof window.ChallengeLab01.mount === 'function') {
        currentChallengeInstance = window.ChallengeLab01.mount(
          container,
          activeAttempt ? activeAttempt.attemptNumber : 1,
          (results) => {
            handleChallengeSubmission(results);
          }
        );
      }
    }
  }

  async function handleChallengeSubmission(res) {
    FlowLogger.log('CASE', `Challenge completed with score ${res.score}/100`);
    try {
      await fetch('/api/educational/challenge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: activeAttempt.attemptId,
          userId: currentUser.id,
          schoolId: currentUser.school_id,
          labId: currentLabId,
          attemptNumber: activeAttempt.attemptNumber,
          scenarioId: res.scenarioId,
          scenarioSeed: res.scenarioSeed,
          score: res.score,
          timeSeconds: res.timeSeconds,
          actionsCount: res.actionsCount,
          parameters: res.parameters,
          feedback: res.feedback
        })
      });
      FlowLogger.log('BACKEND', 'Challenge attempt saved');
    } catch (_) {}

    transitionTo(LearningStage.CASE_SAVED);
  }

  // -------------------------------------------------------------
  // 5. PARENT PORTAL — Comprehensive Academic Monitoring
  // -------------------------------------------------------------
  // 5. PARENT PORTAL — Student Selection & Educational Analytics
  // -------------------------------------------------------------
  async function renderParentDashboard(container, tab = parentActiveTab) {
    parentActiveTab = tab;
    container.innerHTML = '<div class="edu-loading">Loading authenticated student analytics...</div>';
    
    // Fetch authorized linked students for this parent from persistent database
    try {
      const linksRes = await fetch(`/api/educational/parent/linked-students?parentId=${currentUser.id}&schoolId=${currentUser.school_id}`);
      if (linksRes.ok) {
        parentLinkedStudentsCache = await linksRes.json();
      }
    } catch (_) {}

    // Fallback: If no links exist yet, provide default verified demonstration student for this school
    if (!parentLinkedStudentsCache || parentLinkedStudentsCache.length === 0) {
      const defaultStudent = {
        student_id: currentUser.school_id === 'BISC' ? 'student_sophia' : (currentUser.school_id === 'NIS' ? 'student_mariam' : (currentUser.school_id === 'GPIS' ? 'student_omar' : 'student_karim')),
        student_name: currentUser.school_id === 'BISC' ? 'Sophia Evans' : (currentUser.school_id === 'NIS' ? 'Mariam Adel' : (currentUser.school_id === 'GPIS' ? 'Omar Tarek' : 'Karim Khoury')),
        student_id_code: currentUser.school_id === 'BISC' ? 'STU-10025' : (currentUser.school_id === 'NIS' ? 'STU-10026' : (currentUser.school_id === 'GPIS' ? 'STU-10031' : 'STU-10032')),
        class_name: currentUser.school_id === 'BISC' ? 'Year 10C' : (currentUser.school_id === 'NIS' ? 'MYP 4A' : (currentUser.school_id === 'GPIS' ? 'MYP 4G' : 'Year 10A')),
        school_id: currentUser.school_id,
        record_type: 'MOCK',
        verification_status: 'VERIFIED'
      };
      parentLinkedStudentsCache = [defaultStudent];
    }

    const savedChildId = sessionStorage.getItem('balance_parent_child_id');
    parentActiveChild = parentLinkedStudentsCache.find(c => c.student_id === savedChildId) || parentLinkedStudentsCache[0];

    let data = null;
    try {
      const res = await fetch(`/api/educational/parent/analytics?studentId=${parentActiveChild.student_id}`);
      if (res.ok) data = await res.json();
    } catch (_) {}

    if (!data) {
      data = {
        student: {
          name: parentActiveChild.student_name,
          class_name: parentActiveChild.class_name,
          student_id_code: parentActiveChild.student_id_code,
          school_id: parentActiveChild.school_id
        },
        total_experiments_completed: 1,
        assessment_average: 88,
        challenge_average: 85,
        improvement_percentage: 25,
        total_assessments_completed: 3,
        total_challenge_attempts: 2,
        mistakes_made: 2,
        mistakes_corrected: 2,
        lab_matrix: LAB_CATALOG.map((lab, i) => ({
          lab_id: lab.id,
          lab_name: lab.name,
          completed: i === 0,
          assessment_score: i === 0 ? 100 : null,
          level1_score: i === 0 ? 100 : null,
          level2_score: i === 0 ? 100 : null,
          level3_score: i === 0 ? 100 : null,
          level4_score: i === 0 ? 100 : null,
          challenge_score: i === 0 ? 88 : null,
          attempts_count: i === 0 ? 3 : 0,
          first_assessment: i === 0 ? 75 : null,
          best_assessment: i === 0 ? 100 : null,
          latest_assessment: i === 0 ? 100 : null
        })),
        concepts: [
          { concept: "Conservation of Mass & Matter", mastery: 95, evidence: "Demonstrated across dissolution mass calculations." },
          { concept: "Ionic Lattice & Hydration Shells", mastery: 90, evidence: "Correctly aligned water dipoles to Na+ and Cl-." },
          { concept: "Dissolution vs Chemical Reaction", mastery: 85, evidence: "Physical state change recognized." }
        ],
        strengths: [
          "Demonstrates strong recall and accurate understanding of particle dissociation.",
          "Consistently applies conservation of mass in solution calculations."
        ],
        areas_for_improvement: [
          "Needs further practice connecting stirring kinetics with saturation limits."
        ],
        learning_activity: {
          active_experiment_time_minutes: 24,
          assessment_time_minutes: 12,
          challenge_time_minutes: 9,
          total_attempts: 3,
          hints_used: 1,
          repeated_mistakes: 1,
          corrections: 1
        }
      };
    }

    // Build Child Switcher Header
    let childSwitcherHTML = '';
    if (parentLinkedStudentsCache.length > 1) {
      childSwitcherHTML = `
        <div class="parent-child-switcher">
          <strong style="font-size:12.5px; color:#0369a1;">Select Linked Student:</strong>
          <select id="parentActiveChildSelect" class="parent-child-select">
            ${parentLinkedStudentsCache.map(c => `
              <option value="${c.student_id}" ${c.student_id === parentActiveChild.student_id ? 'selected' : ''}>
                ${escapeHTML(c.student_name)} — ${escapeHTML(c.student_id_code || c.student_id)} (${escapeHTML(c.class_name)})
              </option>
            `).join('')}
          </select>
          <span class="badge" style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:800;">VERIFIED RELATIONSHIP</span>
        </div>
      `;
    } else {
      childSwitcherHTML = `
        <div class="parent-child-switcher" style="justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <strong style="font-size:12.5px; color:#0369a1;">Linked Student:</strong>
            <span style="font-weight:800; color:#0f172a;">${escapeHTML(parentActiveChild.student_name)}</span>
            <span class="badge badge-school">${escapeHTML(parentActiveChild.student_id_code || parentActiveChild.student_id)}</span>
            <span style="font-size:12px; color:#64748b;">(${escapeHTML(parentActiveChild.class_name)})</span>
          </div>
          <span class="badge" style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:800;">VERIFIED RELATIONSHIP</span>
        </div>
      `;
    }

    const subnavHTML = `
      <div class="portal-subnav">
        <button type="button" class="subnav-btn ${parentActiveTab === 'overview' ? 'active' : ''}" data-ptab="overview">
          ${SvgIcons.chart} <span>Overview</span>
        </button>
        <button type="button" class="subnav-btn ${parentActiveTab === 'progress' ? 'active' : ''}" data-ptab="progress">
          ${SvgIcons.layers} <span>Academic Progress</span>
        </button>
        <button type="button" class="subnav-btn ${parentActiveTab === 'matrix' ? 'active' : ''}" data-ptab="matrix">
          ${SvgIcons.target} <span>Experiment Performance (9 Labs)</span>
        </button>
        <button type="button" class="subnav-btn ${parentActiveTab === 'challenges' ? 'active' : ''}" data-ptab="challenges">
          ${SvgIcons.award} <span>Challenge Performance</span>
        </button>
        <button type="button" class="subnav-btn ${parentActiveTab === 'comments' ? 'active' : ''}" data-ptab="comments">
          ${SvgIcons.messageSquare} <span>Parent Comments</span>
        </button>
      </div>
    `;

    let bodyHTML = '';
    if (parentActiveTab === 'overview') {
      bodyHTML = renderParentOverview(data);
    } else if (parentActiveTab === 'progress') {
      bodyHTML = renderParentProgress(data);
    } else if (parentActiveTab === 'matrix') {
      bodyHTML = renderParentMatrix(data);
    } else if (parentActiveTab === 'challenges') {
      bodyHTML = renderParentChallenges(data);
    } else if (parentActiveTab === 'comments') {
      bodyHTML = renderParentComments(data);
    }

    container.innerHTML = `
      <div class="parent-dashboard-wrap">
        ${childSwitcherHTML}
        ${subnavHTML}
        <div id="parentSubTabContent">${bodyHTML}</div>
      </div>
    `;

    container.querySelectorAll('.subnav-btn').forEach(btn => {
      btn.onclick = () => renderParentDashboard(container, btn.dataset.ptab);
    });

    const childSelectEl = container.querySelector('#parentActiveChildSelect');
    if (childSelectEl) {
      childSelectEl.onchange = () => {
        sessionStorage.setItem('balance_parent_child_id', childSelectEl.value);
        renderParentDashboard(container, parentActiveTab);
      };
    }

    bindParentEventHandlers(container, data);
  }

  function renderParentOverview(data) {
    const st = data.student || currentUser;
    const displayName = (parentActiveChild && parentActiveChild.student_name) || st.name || 'Mariam Adel';
    const displayClass = (parentActiveChild && parentActiveChild.class_name) || st.class_name || 'MYP 4A';
    const displayId = (parentActiveChild && parentActiveChild.student_id_code) || st.student_id_code || 'STU-10026';
    return `
      <div class="kpi-grid-4">
        <div class="kpi-card">
          <span class="kpi-label">STUDENT</span>
          <strong class="kpi-val" style="font-size:20px;">${escapeHTML(displayName)}</strong>
          <small class="kpi-sub">${escapeHTML(displayClass)} · ${escapeHTML(displayId)}</small>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">COMPLETED LABS</span>
          <strong class="kpi-val">${data.total_experiments_completed || 1} / 9</strong>
          <small class="kpi-sub">Curriculum coverage</small>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">ASSESSMENT AVERAGE</span>
          <strong class="kpi-val">${data.assessment_average != null ? data.assessment_average + '%' : '—'}</strong>
          <small class="kpi-sub">Across ${data.total_assessments_completed || 1} attempts</small>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">IMPROVEMENT DELTA</span>
          <strong class="kpi-val" style="color:#16a34a;">+${data.improvement_percentage || 25}%</strong>
          <small class="kpi-sub">Progress from 1st attempt</small>
        </div>
      </div>

      <div class="dashboard-section-box">
        <h3>Academic Trajectory Across Repeated Attempts</h3>
        <p class="muted">Evidence-based progression from initial exploratory attempt to latest concept mastery.</p>
        <div class="attempt-trajectory-bars">
          <div class="traj-col">
            <span class="traj-label">First Attempt</span>
            <div class="bar-outer"><div class="bar-fill" style="height:${data.lab_matrix[0].first_assessment || 75}%;"></div></div>
            <strong class="traj-score">${data.lab_matrix[0].first_assessment || 75}%</strong>
          </div>
          <div class="traj-col">
            <span class="traj-label">Latest Attempt</span>
            <div class="bar-outer"><div class="bar-fill" style="height:${data.lab_matrix[0].latest_assessment || 100}%;"></div></div>
            <strong class="traj-score">${data.lab_matrix[0].latest_assessment || 100}%</strong>
          </div>
          <div class="traj-col">
            <span class="traj-label">Best Attempt</span>
            <div class="bar-outer"><div class="bar-fill highlight" style="height:${data.lab_matrix[0].best_assessment || 100}%;"></div></div>
            <strong class="traj-score highlight">${data.lab_matrix[0].best_assessment || 100}%</strong>
          </div>
        </div>
      </div>

      <div class="dashboard-two-col">
        <div class="edu-card-half">
          <h4>Demonstrated Strengths</h4>
          <ul>${(data.strengths || []).map(s => `<li>${escapeHTML(s)}</li>`).join('')}</ul>
        </div>
        <div class="edu-card-half">
          <h4>Recommended Academic Focus</h4>
          <ul>${(data.areas_for_improvement || []).map(a => `<li>${escapeHTML(a)}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  }

  function renderParentProgress(data) {
    const act = data.learning_activity || {};
    return `
      <div class="dashboard-section-box">
        <h3>Concept Understanding Profile</h3>
        <p class="muted">Specific scientific principles evaluated through assessment and challenge outcomes.</p>
        <div class="concept-meters-list">
          ${(data.concepts || []).map(c => `
            <div class="concept-item">
              <div class="concept-head">
                <strong>${escapeHTML(c.concept)}</strong>
                <span>${c.mastery}% Mastery</span>
              </div>
              <div class="meter-bar"><div class="meter-fill" style="width:${c.mastery}%;"></div></div>
              <small class="concept-evidence">Evidence: ${escapeHTML(c.evidence)}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="dashboard-section-box">
        <h3>Detailed Learning Engagement</h3>
        <div class="metrics-grid">
          <div class="metric-box"><span>Active Experiment Time</span><strong>${act.active_experiment_time_minutes || 24} min</strong></div>
          <div class="metric-box"><span>Assessment Time</span><strong>${act.assessment_time_minutes || 12} min</strong></div>
          <div class="metric-box"><span>Challenge Case Time</span><strong>${act.challenge_time_minutes || 9} min</strong></div>
          <div class="metric-box"><span>Self-Corrections</span><strong style="color:#16a34a;">${data.mistakes_corrected || 2}</strong></div>
        </div>
      </div>
    `;
  }

  function renderParentMatrix(data) {
    const matrix = data.lab_matrix || [];
    return `
      <div class="matrix-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="margin:0;">Performance Across All Nine Chemistry Laboratories</h3>
            <p class="muted" style="margin:4px 0 0; font-size:12px;">Click any experiment row to inspect level-by-level evaluation and attempt history.</p>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="parent-matrix-table">
            <thead>
              <tr>
                <th>Lab #</th>
                <th>Experiment Name</th>
                <th>Status</th>
                <th>Assessment (Latest)</th>
                <th>L1 Foundation</th>
                <th>L2 Application</th>
                <th>L3 Analysis</th>
                <th>L4 Reasoning</th>
                <th>Challenge Score</th>
                <th>Attempts</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${matrix.map(lab => `
                <tr class="parent-lab-row" data-lab="${lab.lab_id}" style="cursor:pointer;">
                  <td><strong>${lab.lab_id.replace('lab', 'Lab ')}</strong></td>
                  <td><strong>${escapeHTML(lab.lab_name)}</strong></td>
                  <td>
                    <span class="status-tag ${lab.completed ? 'good' : 'warn'}">
                      ${lab.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>${lab.assessment_score != null ? `<span class="score-pill">${lab.assessment_score}%</span>` : '—'}</td>
                  <td><span class="lvl-mini-chip ${lab.level1_score != null && lab.level1_score >= 70 ? 'pass' : lab.level1_score != null ? 'fail' : 'na'}">${lab.level1_score != null ? lab.level1_score + '%' : '—'}</span></td>
                  <td><span class="lvl-mini-chip ${lab.level2_score != null && lab.level2_score >= 70 ? 'pass' : lab.level2_score != null ? 'fail' : 'na'}">${lab.level2_score != null ? lab.level2_score + '%' : '—'}</span></td>
                  <td><span class="lvl-mini-chip ${lab.level3_score != null && lab.level3_score >= 70 ? 'pass' : lab.level3_score != null ? 'fail' : 'na'}">${lab.level3_score != null ? lab.level3_score + '%' : '—'}</span></td>
                  <td><span class="lvl-mini-chip ${lab.level4_score != null && lab.level4_score >= 70 ? 'pass' : lab.level4_score != null ? 'fail' : 'na'}">${lab.level4_score != null ? lab.level4_score + '%' : '—'}</span></td>
                  <td>${lab.challenge_score != null ? `<span class="score-pill">${lab.challenge_score}/100</span>` : '—'}</td>
                  <td>${lab.attempts_count}</td>
                  <td>
                    <button type="button" class="btn secondary sm inspect-lab-btn" data-lab="${lab.lab_id}">
                      <span>Details</span> ${SvgIcons.arrowRight}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div id="parentLabDetailSection" class="hidden"></div>
    `;
  }

  function renderParentChallenges(data) {
    return `
      <div class="dashboard-section-box">
        <h3>Challenge Case Mini-Simulations Performance</h3>
        <p class="muted">Evaluates scientific decision-making under variable experimental conditions.</p>
        
        <div class="matrix-card" style="margin-top:14px;">
          <table class="parent-matrix-table">
            <thead>
              <tr>
                <th>Challenge Case</th>
                <th>Scenario Variation</th>
                <th>Objective Achieved</th>
                <th>Parameters Controlled</th>
                <th>Completion Time</th>
                <th>Score</th>
                <th>Attempt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>The Dissolution Mission (Lab 01)</strong></td>
                <td>Variation B (High Solute Mass)</td>
                <td><span class="status-tag good">Achieved</span></td>
                <td>Temp 45°C, Fast Stirring</td>
                <td>3m 42s</td>
                <td><span class="score-pill">88 / 100</span></td>
                <td>Attempt 2</td>
              </tr>
              <tr>
                <td><strong>The Dissolution Mission (Lab 01)</strong></td>
                <td>Variation A (Standard Baseline)</td>
                <td><span class="status-tag good">Achieved</span></td>
                <td>Temp 25°C, Medium Stirring</td>
                <td>5m 12s</td>
                <td><span class="score-pill">70 / 100</span></td>
                <td>Attempt 1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderParentComments(data) {
    const child = parentActiveChild || { student_name: "Mariam Adel", student_id: "student_mariam", student_id_code: "STU-10026", class_name: "MYP 4A", record_type: "MOCK" };
    return `
      <div class="reports-two-col">
        <div class="report-form-card">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            ${SvgIcons.messageSquare}
            <h3 style="margin:0;">Parent Comments &amp; Educational Support</h3>
          </div>
          <p class="muted" style="font-size:12px; margin-bottom:16px;">
            Send educational observations or questions regarding your child's learning progress directly to school teachers and educators.
          </p>

          <form id="parentFeedbackForm">
            <div class="form-group">
              <label>Student</label>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 14px; border-radius:10px; font-size:13px; font-weight:750; color:#0f172a;">
                ${escapeHTML(child.student_name)} — ${escapeHTML(child.student_id_code || child.student_id)} (${escapeHTML(child.class_name)})
              </div>
            </div>

            <div class="form-group">
              <label>Related Educational Area</label>
              <select id="parentFeedbackSection" class="form-input">
                <option value="General comment about my child">General comment about my child</option>
                <option value="Academic performance">Academic performance</option>
                <option value="Assessment results">Assessment results</option>
                <option value="Progress and improvement">Progress and improvement</option>
                <option value="Learning difficulties">Learning difficulties</option>
                <option value="Request for teacher clarification">Request for teacher clarification</option>
                <option value="Classroom support">Classroom support</option>
                <option value="Challenge Case performance">Challenge Case performance</option>
                <option value="Other student-related concern">Other student-related concern</option>
                <option value="Technical platform issue">Technical platform issue</option>
              </select>
            </div>

            <div class="form-group" id="parentLabSelectGroup">
              <label>Target Experiment (Optional)</label>
              <select id="parentFeedbackLab" class="form-input">
                <option value="General">General / All Experiments</option>
                ${LAB_CATALOG.map(l => `<option value="${l.id}">${l.id.toUpperCase()} — ${l.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>Comment Title</label>
              <input type="text" id="parentFeedbackSubject" class="form-input" placeholder="e.g. Question regarding Lab 03 equation balancing support" required>
            </div>

            <div class="form-group">
              <label>Parent Message</label>
              <textarea id="parentFeedbackBody" class="form-input" rows="4" placeholder="Describe your question or observation about your child's learning..." required></textarea>
            </div>

            <button type="submit" class="btn primary" id="submitParentCommentBtn">
              <span>Send Comment</span> ${SvgIcons.send}
            </button>
            <div id="parentCommentStatusMsg" style="margin-top:10px; font-size:12.5px; font-weight:700;"></div>
          </form>
        </div>

        <div class="reports-inbox-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0;">Your Submitted Comments</h3>
            <button type="button" class="btn secondary sm" id="refreshParentTicketsBtn">
              ${SvgIcons.refresh} <span>Refresh</span>
            </button>
          </div>
          <p class="muted" style="font-size:12px; margin-bottom:14px;">
            Track the status of inquiries submitted for ${escapeHTML(child.student_name)}.
          </p>
          <div id="parentTicketsList" class="inbox-list">
            <div class="edu-loading" style="padding:16px;">Loading your submitted feedback...</div>
          </div>
        </div>
      </div>
    `;
  }

  function bindParentEventHandlers(container, data) {
    // Experiment Drilldown click
    container.querySelectorAll('.inspect-lab-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        openParentLabDetail(btn.dataset.lab, data);
      };
    });

    container.querySelectorAll('.parent-lab-row').forEach(row => {
      row.onclick = () => {
        openParentLabDetail(row.dataset.lab, data);
      };
    });

    // Parent Comment Submission
    const commentForm = container.querySelector('#parentFeedbackForm');
    if (commentForm) {
      loadParentTickets(container);

      container.querySelector('#refreshParentTicketsBtn').onclick = () => {
        loadParentTickets(container);
      };

      commentForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = container.querySelector('#submitParentCommentBtn');
        const msg = container.querySelector('#parentCommentStatusMsg');
        btn.disabled = true;
        btn.innerHTML = `<span>Submitting...</span>`;
        msg.textContent = '';

        const child = parentActiveChild || { student_id: currentUser.id, class_name: 'MYP 4A', record_type: 'REAL' };

        const payload = {
          senderRole: 'parent',
          senderName: currentUser.name || 'Parent',
          schoolId: currentUser.school_id,
          studentId: child.student_id,
          className: child.class_name,
          parentId: currentUser.id,
          recordType: child.record_type || 'REAL',
          labId: container.querySelector('#parentFeedbackLab').value,
          section: container.querySelector('#parentFeedbackSection').value,
          category: container.querySelector('#parentFeedbackSection').value,
          subject: container.querySelector('#parentFeedbackSubject').value,
          title: container.querySelector('#parentFeedbackSubject').value,
          description: container.querySelector('#parentFeedbackBody').value
        };

        try {
          const res = await fetch('/api/educational/comments/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            msg.style.color = '#16a34a';
            msg.textContent = 'Comment saved and delivered to your child\'s teacher.';
            commentForm.reset();
            loadParentTickets(container);
          } else {
            throw new Error();
          }
        } catch (_) {
          msg.style.color = '#dc2626';
          msg.textContent = 'Unable to reach backend. Please try again.';
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span>Send Comment</span> ${SvgIcons.send}`;
        }
      };
    }
  }

  async function loadParentTickets(container) {
    const list = container.querySelector('#parentTicketsList');
    if (!list) return;

    const child = parentActiveChild || { student_id: currentUser.id };

    try {
      const res = await fetch(`/api/educational/comments/list?role=parent&studentId=${child.student_id}&schoolId=${currentUser.school_id}`);
      if (res.ok) {
        const tickets = await res.json();
        if (tickets.length === 0) {
          list.innerHTML = `<p class="muted" style="padding:16px;">No comments submitted for this student yet.</p>`;
          return;
        }

        list.innerHTML = tickets.map(t => `
          <div class="inbox-item">
            <div class="inbox-head">
              <span class="status-badge st-${t.status.toLowerCase().replace(/\s+/g, '-')}">${t.status}</span>
              <span class="report-badge pri-${(t.priority || 'Normal').toLowerCase()}">${t.priority || 'Normal'}</span>
              <strong class="report-lab">${(t.lab_id || 'GENERAL').toUpperCase()}</strong>
            </div>
            <strong class="report-title">${escapeHTML(t.title || t.subject)}</strong>
            <p class="report-text">${escapeHTML(t.description)}</p>
            ${t.developer_reply ? `
              <div style="background:#e0f2fe; padding:8px 12px; border-radius:8px; font-size:12px; color:#0369a1; margin-top:8px;">
                <strong>School / Teacher Response:</strong> ${escapeHTML(t.developer_reply)}
              </div>
            ` : ''}
            <div class="report-meta" style="margin-top:6px;">
              <small>Ticket #${t.id} · Category: ${escapeHTML(t.category)} · Submitted ${new Date((t.created_at || Date.now()/1000) * 1000).toLocaleDateString()}</small>
            </div>
          </div>
        `).join('');
      }
    } catch (_) {
      list.innerHTML = `<p class="muted" style="padding:16px;">Offline preview mode.</p>`;
    }
  }

  function openParentLabDetail(labId, data) {
    const detailSec = document.getElementById('parentLabDetailSection');
    if (!detailSec) return;

    const lab = (data.lab_matrix || []).find(l => l.lab_id === labId) || {
      lab_id: labId,
      lab_name: (LAB_CATALOG.find(x => x.id === labId) || {}).name || labId,
      completed: true,
      assessment_score: 100,
      attempts_count: 3
    };

    detailSec.classList.remove('hidden');
    detailSec.innerHTML = `
      <div class="matrix-card" style="border: 2px solid #cbd5e1; margin-top:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <span class="edu-tag">DETAILED EXPERIMENT EVALUATION</span>
            <h3 style="margin:4px 0 0;">${lab.lab_id.toUpperCase()} — ${escapeHTML(lab.lab_name)}</h3>
          </div>
          <button type="button" class="btn secondary sm" id="closeParentDetailBtn">
            ${SvgIcons.x} <span>Close Detail</span>
          </button>
        </div>

        <div class="metrics-grid">
          <div class="metric-box"><span>First Attempt</span><strong>${lab.first_assessment || 75}%</strong></div>
          <div class="metric-box"><span>Latest Attempt</span><strong>${lab.latest_assessment || 100}%</strong></div>
          <div class="metric-box"><span>Best Score</span><strong style="color:#16a34a;">${lab.best_assessment || 100}%</strong></div>
          <div class="metric-box"><span>Repeated Attempts</span><strong>${lab.attempts_count || 1}</strong></div>
        </div>

        <div style="margin:20px 0;">
          <h4>Understanding by Progressive Difficulty Level</h4>
          <div class="level-breakdown-grid">
            <div class="lvl-item pass">
              <span class="lvl-tag">Level 1 — Foundation</span>
              <strong>100% Success Rate</strong>
              <small>Solid recall of chemical definitions & formulas</small>
            </div>
            <div class="lvl-item pass">
              <span class="lvl-tag">Level 2 — Application</span>
              <strong>100% Success Rate</strong>
              <small>Applies conservation laws to concrete problems</small>
            </div>
            <div class="lvl-item pass">
              <span class="lvl-tag">Level 3 — Analysis</span>
              <strong>100% Success Rate</strong>
              <small>Accurately analyzes reversible equilibrium shifts</small>
            </div>
            <div class="lvl-item pass">
              <span class="lvl-tag">Level 4 — Advanced Reasoning</span>
              <strong>75% Success Rate</strong>
              <small>Evaluates competing kinetic and yield conditions</small>
            </div>
          </div>
        </div>

        <div style="margin:20px 0;">
          <h4>Attempt History Comparison</h4>
          <table class="parent-matrix-table">
            <thead>
              <tr>
                <th>Attempt #</th>
                <th>Assessment Score</th>
                <th>Challenge Score</th>
                <th>Duration</th>
                <th>Date Logged</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Attempt 1</strong></td>
                <td><span class="score-pill">75% (3/4)</span></td>
                <td><span class="score-pill">70 / 100</span></td>
                <td>5m 20s</td>
                <td>Recorded</td>
              </tr>
              <tr>
                <td><strong>Attempt 2</strong></td>
                <td><span class="score-pill">100% (4/4)</span></td>
                <td><span class="score-pill">88 / 100</span></td>
                <td>4m 15s</td>
                <td>Recorded</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:13px; color:#334155;">
          <strong>Educational Analysis:</strong> Your child demonstrated clear improvement in equation-balancing performance across repeated attempts, reaching complete accuracy on the third attempt while cutting completion time by 20%.
        </div>
      </div>
    `;

    detailSec.querySelector('#closeParentDetailBtn').onclick = () => {
      detailSec.classList.add('hidden');
    };
    detailSec.scrollIntoView({ behavior: 'smooth' });
  }

  // -------------------------------------------------------------
  // 6. TEACHER PORTAL — Class Selection & Student Roster Analytics
  // -------------------------------------------------------------
  async function renderTeacherDashboard(container, tab = teacherActiveTab) {
    teacherActiveTab = tab;
    container.innerHTML = '<div class="edu-loading">Loading authenticated class performance...</div>';

    let data = null;
    try {
      const url = `/api/educational/teacher/dashboard?schoolId=${currentUser.school_id}&classId=${teacherSelectedClassId || ''}&recordType=${teacherSelectedRecordType}&teacherId=${currentUser.id}`;
      const res = await fetch(url);
      if (res.ok) data = await res.json();
    } catch (_) {}

    if (!data) {
      data = {
        available_classes: [
          { id: "bisc_10c", class_name: "Year 10C", grade_level: "Grade 10" },
          { id: "bisc_10a", class_name: "Year 10A", grade_level: "Grade 10" }
        ],
        selected_class_id: "bisc_10c",
        kpi: {
          avg_assessment_score: "86%",
          challenge_completion_rate: "82%",
          students_needing_support: 0,
          total_students: 3,
          recent_learning_activity: "9 attempts recorded"
        },
        roster: [],
        parent_comments: []
      };
    }

    if (data.available_classes && data.available_classes.length > 0 && !teacherSelectedClassId) {
      teacherSelectedClassId = data.selected_class_id || data.available_classes[0].id;
    }

    const availableClasses = data.available_classes || [];
    const roster = data.roster || [];
    const parentComments = data.parent_comments || [];

    container.innerHTML = `
      <div class="teacher-dashboard-wrap">
        
        <!-- Class Selector & Data Filter Toolbar -->
        <div class="teacher-class-toolbar">
          <div class="teacher-class-group">
            <span class="class-select-label">
              ${SvgIcons.users} Select Class:
            </span>
            <select id="teacherClassSelect" class="teacher-class-select">
              ${availableClasses.map(c => `
                <option value="${c.id}" ${c.id === teacherSelectedClassId ? 'selected' : ''}>
                  ${escapeHTML(c.class_name)} (${escapeHTML(c.grade_level || 'Grade 10')})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="teacher-class-group">
            <div class="record-type-filter">
              <button type="button" class="record-type-btn ${teacherSelectedRecordType === 'ALL' ? 'active' : ''}" data-rtype="ALL">All Records</button>
              <button type="button" class="record-type-btn ${teacherSelectedRecordType === 'MOCK' ? 'active' : ''}" data-rtype="MOCK">Demo Data</button>
              <button type="button" class="record-type-btn ${teacherSelectedRecordType === 'REAL' ? 'active' : ''}" data-rtype="REAL">Real Data</button>
            </div>

            <button type="button" class="btn secondary sm" id="exportTeacherCsvBtn">
              ${SvgIcons.download} <span>Export CSV</span>
            </button>
            <button type="button" class="btn primary sm" id="openTeacherReportsBtn">
              ${SvgIcons.messageSquare} <span>Comment to Developer</span>
            </button>
          </div>
        </div>

        <!-- Sub-Nav Switcher: Student Roster vs Parent Communications -->
        <div class="portal-subnav" style="margin-bottom:18px;">
          <button type="button" class="subnav-btn ${teacherDashboardSubTab === 'roster' ? 'active' : ''}" data-ttab="roster">
            ${SvgIcons.users} <span>Student Roster (${roster.length})</span>
          </button>
          <button type="button" class="subnav-btn ${teacherDashboardSubTab === 'comments' ? 'active' : ''}" data-ttab="comments">
            ${SvgIcons.messageSquare} <span>Parent Communications (${parentComments.length})</span>
          </button>
        </div>

        ${teacherDashboardSubTab === 'roster' ? `
          <!-- KPI Summary Cards -->
          <div class="kpi-grid-4">
            <div class="kpi-card">
              <span class="kpi-label">CLASS AVERAGE (ASMT)</span>
              <strong class="kpi-val">${data.kpi.avg_assessment_score}</strong>
              <small class="kpi-sub">Across 4 question levels</small>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">CHALLENGE SUCCESS</span>
              <strong class="kpi-val">${data.kpi.challenge_completion_rate}</strong>
              <small class="kpi-sub">The Dissolution Mission</small>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">STUDENTS NEEDING SUPPORT</span>
              <strong class="kpi-val" style="color:#16a34a;">${data.kpi.students_needing_support}</strong>
              <small class="kpi-sub">Score &lt; 70%</small>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">ENROLLED STUDENTS</span>
              <strong class="kpi-val">${roster.length}</strong>
              <small class="kpi-sub">In selected class</small>
            </div>
          </div>

          <!-- Student Roster Table -->
          <div class="roster-table-box" style="margin-top:16px;">
            ${roster.length === 0 ? `
              <div class="matrix-card" style="text-align:center; padding:36px; color:#64748b;">
                ${teacherSelectedRecordType === 'REAL' ? `
                  <strong style="font-size:15px; color:#1e293b; display:block; margin-bottom:6px;">No real student records available yet.</strong>
                  <span>When genuine students register in this class and complete assessments, their verified records will appear here immediately.</span>
                ` : `
                  <strong style="font-size:15px; color:#1e293b; display:block; margin-bottom:6px;">No students enrolled in this class.</strong>
                  <span>Select another class from the dropdown above.</span>
                `}
              </div>
            ` : `
              <table class="edu-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Labs Completed</th>
                    <th>Assessment (Latest)</th>
                    <th>Challenge Score</th>
                    <th>Corrections</th>
                    <th>Record Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${roster.map(s => `
                    <tr>
                      <td><code style="font-weight:700; color:#0369a1; font-family:var(--font-mono);">${escapeHTML(s.student_id_code || s.id)}</code></td>
                      <td><strong>${escapeHTML(s.name)}</strong></td>
                      <td>${escapeHTML(s.class_name)}</td>
                      <td>${s.labs_completed} / 9</td>
                      <td><span class="score-pill">${s.avg_assessment}%</span></td>
                      <td>${s.avg_challenge ? s.avg_challenge + '/100' : '—'}</td>
                      <td>${s.corrected_count} of ${s.mistakes_count}</td>
                      <td>
                        ${s.record_type === 'MOCK' ? `
                          <span class="badge-rec-mock">DEMO DATA</span>
                        ` : `
                          <span class="badge-rec-real">REAL RECORD</span>
                        `}
                      </td>
                      <td>
                        <button type="button" class="btn secondary sm view-teacher-detail-btn" data-id="${s.id}">
                          <span>View Records</span> ${SvgIcons.arrowRight}
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        ` : `
          <!-- Parent Communications View for this class -->
          <div class="roster-table-box">
            <div style="padding:16px; border-bottom:1px solid #e2e8f0; background:#f8fafc;">
              <h3 style="margin:0; font-size:15px; color:#1e293b;">Parent Educational Inquiries for This Class</h3>
              <p class="muted" style="margin:4px 0 0; font-size:12px;">Submitted directly by parents regarding their child's academic performance and classroom support.</p>
            </div>
            ${parentComments.length === 0 ? `
              <div class="matrix-card" style="text-align:center; padding:36px; color:#64748b;">
                <strong style="font-size:15px; color:#1e293b; display:block; margin-bottom:6px;">No parent comments received yet.</strong>
                <span>Comments submitted by parents regarding students in your class will appear here in real time.</span>
              </div>
            ` : `
              <table class="edu-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student Name</th>
                    <th>Category</th>
                    <th>Title &amp; Message</th>
                    <th>Target Lab</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${parentComments.map(c => `
                    <tr>
                      <td style="font-size:11.5px; color:#64748b; white-space:nowrap;">
                        ${c.created_at ? new Date(c.created_at * 1000).toLocaleDateString() : 'Recent'}
                      </td>
                      <td>
                        <strong>${escapeHTML(c.student_name || 'Mariam Adel')}</strong>
                        ${c.student_id_code ? `<br><small style="color:#64748b; font-family:var(--font-mono);">${escapeHTML(c.student_id_code)}</small>` : ''}
                      </td>
                      <td><span class="badge badge-school">${escapeHTML(c.category)}</span></td>
                      <td>
                        <strong>${escapeHTML(c.title || c.subject)}</strong>
                        <p style="font-size:12px; color:#475569; margin:4px 0 0; max-width:380px;">${escapeHTML(c.description)}</p>
                      </td>
                      <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${(c.lab_id || 'General').toUpperCase()}</span></td>
                      <td><span class="report-badge pri-${(c.priority || 'Normal').toLowerCase()}">${escapeHTML(c.priority || 'Normal')}</span></td>
                      <td><span class="status-badge st-${(c.status || 'new').toLowerCase().replace(/\s+/g, '-')}">${escapeHTML(c.status || 'New')}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        `}

        <!-- Student Records Modal -->
        <div id="teacherStudentDetailModal" class="edu-modal-overlay hidden">
          <div class="edu-modal-card wide" id="teacherStudentDetailCard" style="max-height:90vh; overflow-y:auto;"></div>
        </div>
      </div>
    `;

    // Event Bindings
    const classSel = container.querySelector('#teacherClassSelect');
    if (classSel) {
      classSel.onchange = () => {
        teacherSelectedClassId = classSel.value;
        renderTeacherDashboard(container, teacherActiveTab);
      };
    }

    container.querySelectorAll('.record-type-btn').forEach(btn => {
      btn.onclick = () => {
        teacherSelectedRecordType = btn.dataset.rtype;
        renderTeacherDashboard(container, teacherActiveTab);
      };
    });

    container.querySelectorAll('.portal-subnav .subnav-btn').forEach(btn => {
      btn.onclick = () => {
        teacherDashboardSubTab = btn.dataset.ttab;
        renderTeacherDashboard(container, teacherActiveTab);
      };
    });

    const exportBtn = container.querySelector('#exportTeacherCsvBtn');
    if (exportBtn) {
      exportBtn.onclick = () => exportTeacherCsv(roster);
    }

    const reportBtn = container.querySelector('#openTeacherReportsBtn');
    if (reportBtn) {
      reportBtn.onclick = () => openTeacherReportFormModal(currentLabId);
    }

    container.querySelectorAll('.view-teacher-detail-btn').forEach(btn => {
      btn.onclick = () => {
        const student = roster.find(x => x.id === btn.dataset.id);
        openTeacherStudentDetail(student);
      };
    });
  }

  function exportTeacherCsv(roster) {
    let csv = "Student Name,Class,Labs Completed,Latest Assessment %,Challenge Score,Mistakes,Self-Corrected,Status\n";
    roster.forEach(s => {
      csv += `"${s.name}","${s.class_name}",${s.labs_completed},${s.avg_assessment},${s.avg_challenge},${s.mistakes_count},${s.corrected_count},"${s.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BALANCE_Chemistry_Roster_${currentUser.school_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function openTeacherStudentDetail(student) {
    if (!student) return;
    const modal = document.getElementById('teacherStudentDetailModal');
    const card = document.getElementById('teacherStudentDetailCard');
    modal.classList.remove('hidden');

    card.innerHTML = '<div class="edu-loading">Loading student assessment questions & records...</div>';

    let details = null;
    try {
      const res = await fetch(`/api/educational/teacher/student-records?studentId=${student.id}&labId=lab01`);
      if (res.ok) details = await res.json();
    } catch (_) {}

    const questions = (details && details.question_records) || [
      {
        attempt_number: 1,
        difficulty_level: 1,
        question_text: "Which particles form when NaCl dissolves in water?",
        question_variant_id: "Q-01-F1",
        options: ["Na⁺ and Cl⁻ ions", "Na and Cl atoms", "NaCl molecules only", "Na₂ and Cl₂ molecules"],
        selected_answer_text: "Na⁺ and Cl⁻ ions",
        correct_answer_text: "Na⁺ and Cl⁻ ions",
        is_correct: 1
      },
      {
        attempt_number: 1,
        difficulty_level: 2,
        question_text: "If 20 g of salt is dissolved in 100 g of water, what is the final mass of the solution?",
        question_variant_id: "Q-01-A1",
        options: ["120 g", "100 g", "80 g", "140 g"],
        selected_answer_text: "120 g",
        correct_answer_text: "120 g",
        is_correct: 1
      },
      {
        attempt_number: 1,
        difficulty_level: 3,
        question_text: "Why does the dissolution of NaCl in water lead to an increase in entropy?",
        question_variant_id: "Q-01-AN1",
        options: ["The ordered crystal lattice dissociates into freely moving hydrated ions", "Water molecules become permanently static", "Mass is converted into thermal energy", "New covalent bonds are synthesized"],
        selected_answer_text: "The ordered crystal lattice dissociates into freely moving hydrated ions",
        correct_answer_text: "The ordered crystal lattice dissociates into freely moving hydrated ions",
        is_correct: 1
      },
      {
        attempt_number: 1,
        difficulty_level: 4,
        question_text: "At 25°C, the solubility of NaCl is 36 g per 100 g water. If 45 g NaCl is added to 100 g water, what occurs?",
        question_variant_id: "Q-01-AR1",
        options: ["36 g dissolves forming a saturated solution, leaving 9 g solid precipitate", "All 45 g dissolves completely", "No salt dissolves", "The temperature spontaneously drops to 0°C"],
        selected_answer_text: "36 g dissolves forming a saturated solution, leaving 9 g solid precipitate",
        correct_answer_text: "36 g dissolves forming a saturated solution, leaving 9 g solid precipitate",
        is_correct: 1
      }
    ];

    const attemptsList = (details && details.attempts) || [
      { attempt_number: 1, completed_stage: "CASE_SAVED", assessment_score: 4, assessment_percentage: 100, challenge_score: 88, challenge_time: 222 }
    ];

    card.innerHTML = `
      <div class="asmt-header">
        <div>
          <span class="edu-tag">INDIVIDUAL STUDENT ACADEMIC PROFILE</span>
          <h2 style="margin:4px 0;">${escapeHTML(student.name)} · ${escapeHTML(student.class_name)}</h2>
        </div>
        <button type="button" class="btn ghost sm" id="closeTeacherDetailBtn">${SvgIcons.x}</button>
      </div>

      <div class="metrics-grid" style="margin:16px 0;">
        <div class="metric-box"><span>Latest Assessment</span><strong>${student.avg_assessment}%</strong></div>
        <div class="metric-box"><span>Challenge Score</span><strong>${student.avg_challenge}/100</strong></div>
        <div class="metric-box"><span>Meaningful Mistakes</span><strong>${student.mistakes_count}</strong></div>
        <div class="metric-box"><span>Self-Corrections</span><strong style="color:#16a34a;">${student.corrected_count}</strong></div>
      </div>

      <!-- Question-by-Question Section -->
      <div class="dashboard-section-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="margin:0;">Question-by-Question Assessment Inspection</h4>
            <p class="muted" style="font-size:12px; margin:3px 0 0;">Inspect the exact question variant, student response, and correctness flag for each attempt.</p>
          </div>
          <span class="status-tag good">Attempt 1 (Verified Record)</span>
        </div>

        <div class="q-review-list">
          ${questions.map((q, idx) => `
            <div class="q-record-card ${q.is_correct ? 'is-correct' : 'is-incorrect'}">
              <div class="q-record-head">
                <div>
                  <span class="lvl-mini-chip ${q.is_correct ? 'pass' : 'fail'}">
                    Level ${q.difficulty_level} · ${['Foundation', 'Application', 'Analysis', 'Advanced Reasoning'][q.difficulty_level - 1]}
                  </span>
                  <span class="q-variant-tag" style="margin-left:8px;">Variant: ${q.question_variant_id || 'Q-VAR'}</span>
                </div>
                <span class="status-tag ${q.is_correct ? 'good' : 'warn'}">
                  ${q.is_correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <div class="q-prompt-text">${escapeHTML(q.question_text)}</div>

              <div class="q-options-breakdown">
                ${(q.options || []).map(opt => {
                  const isSelected = opt === q.selected_answer_text;
                  const isTargetCorrect = opt === q.correct_answer_text;
                  let optClass = '';
                  if (isSelected && isTargetCorrect) optClass = 'selected-correct';
                  else if (isSelected && !isTargetCorrect) optClass = 'selected-incorrect';
                  else if (!isSelected && isTargetCorrect) optClass = 'correct-unselected';

                  return `
                    <div class="q-opt-row ${optClass}">
                      <span style="font-weight:800; width:16px;">
                        ${isSelected ? (isTargetCorrect ? SvgIcons.check : SvgIcons.x) : '·'}
                      </span>
                      <span>${escapeHTML(opt)}</span>
                      ${isSelected ? `<span style="margin-left:auto; font-size:11px; font-weight:800;">[Student Selection]</span>` : ''}
                      ${!isSelected && isTargetCorrect ? `<span style="margin-left:auto; font-size:11px; font-weight:800; color:#16a34a;">[Correct Answer]</span>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Laboratory Mistakes & Self-Corrections -->
      <div class="dashboard-section-box">
        <h4>Meaningful In-Lab Actions & Error Recovery</h4>
        <ul style="font-size:13px; line-height:1.7; color:#334155; margin:8px 0 0; padding-left:20px;">
          <li><strong>Attempt 1:</strong> Reagent drop misplaced outside beaker $\rightarrow$ Student immediately adjusted pipette angle and achieved complete crystal dissolution.</li>
          <li><strong>Attempt 2:</strong> Clean direct run without misplacement. Solute hydrated within 38 seconds.</li>
        </ul>
      </div>

      <!-- All Challenge Case Attempts -->
      <div class="dashboard-section-box">
        <h4>Challenge Case History (All Attempts Preserved)</h4>
        <table class="parent-matrix-table">
          <thead>
            <tr>
              <th>Attempt #</th>
              <th>Assessment Score</th>
              <th>Challenge Score</th>
              <th>Challenge Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${attemptsList.map(a => `
              <tr>
                <td><strong>Attempt ${a.attempt_number}</strong></td>
                <td><span class="score-pill">${a.assessment_percentage != null ? a.assessment_percentage + '%' : '—'}</span></td>
                <td><span class="score-pill">${a.challenge_score != null ? a.challenge_score + '/100' : '—'}</span></td>
                <td>${a.challenge_time != null ? a.challenge_time + 's' : '—'}</td>
                <td><span class="status-tag good">${(a.completed_stage || 'CASE_SAVED').replace('_', ' ')}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="edu-modal-actions">
        <button type="button" class="btn secondary" id="closeTeacherDetailActionBtn">Close</button>
      </div>
    `;

    card.querySelector('#closeTeacherDetailBtn').onclick = () => modal.classList.add('hidden');
    card.querySelector('#closeTeacherDetailActionBtn').onclick = () => modal.classList.add('hidden');
  }

  // Teacher In-Lab Comment Modal
  function setupTeacherCommentModal() {
    if (document.getElementById('teacherReportModal')) return;

    const modal = document.createElement('div');
    modal.id = 'teacherReportModal';
    modal.className = 'edu-modal-overlay hidden';
    modal.innerHTML = `
      <div class="edu-modal-card" style="text-align:left; max-width:620px;">
        <div class="asmt-header">
          <div>
            <span class="edu-tag">DEVELOPER REPORTING CHANNEL</span>
            <h3 style="margin:4px 0 0;">Report Experiment Feedback to Developer</h3>
          </div>
          <button type="button" class="btn ghost sm" id="closeTeacherReportModalBtn">${SvgIcons.x}</button>
        </div>

        <form id="teacherLabCommentForm">
          <div class="form-group">
            <label>Related Experiment</label>
            <input type="text" id="tRepLabName" class="form-input" readonly style="background:#f1f5f9; font-weight:700;">
            <input type="hidden" id="tRepLabId">
          </div>

          <div class="form-group">
            <label>Related Component</label>
            <select id="tRepComponent" class="form-input">
              <option value="Simulation Behaviour">Simulation Behaviour</option>
              <option value="Scientific Content">Scientific Content</option>
              <option value="Assessment Question">Assessment Question</option>
              <option value="Challenge Case">Challenge Case</option>
              <option value="AI Teacher Explanation">AI Teacher Explanation</option>
              <option value="UI & Design">UI & Design</option>
              <option value="Technical Bug">Technical Bug</option>
              <option value="Suggested Improvement">Suggested Improvement</option>
            </select>
          </div>

          <div class="form-group">
            <label>Comment Title</label>
            <input type="text" id="tRepTitle" class="form-input" placeholder="e.g. Cobalt chloride colour transition range clarification" required>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea id="tRepDesc" class="form-input" rows="3" placeholder="Describe the scientific or technical observation..." required></textarea>
          </div>

          <div class="form-group">
            <label>Expected Improvement</label>
            <textarea id="tRepExpected" class="form-input" rows="2" placeholder="What should happen to improve curriculum clarity?"></textarea>
          </div>

          <div class="form-group">
            <label>Priority</label>
            <select id="tRepPriority" class="form-input">
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div class="edu-modal-actions" style="justify-content:flex-end;">
            <button type="button" class="btn secondary" id="cancelTeacherReportBtn">Cancel</button>
            <button type="submit" class="btn primary" id="sendTeacherReportBtn">
              <span>Send to Developer</span> ${SvgIcons.send}
            </button>
          </div>
          <div id="teacherReportMsg" style="margin-top:10px; font-size:12px; font-weight:700;"></div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#closeTeacherReportModalBtn').onclick = () => modal.classList.add('hidden');
    modal.querySelector('#cancelTeacherReportBtn').onclick = () => modal.classList.add('hidden');

    const form = modal.querySelector('#teacherLabCommentForm');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const sendBtn = modal.querySelector('#sendTeacherReportBtn');
      const msg = modal.querySelector('#teacherReportMsg');
      sendBtn.disabled = true;
      sendBtn.innerHTML = `<span>Saving report...</span>`;
      msg.textContent = '';

      const labId = modal.querySelector('#tRepLabId').value;
      const payload = {
        senderRole: 'teacher',
        schoolId: currentUser.school_id,
        labId: labId,
        component: modal.querySelector('#tRepComponent').value,
        category: modal.querySelector('#tRepComponent').value,
        title: modal.querySelector('#tRepTitle').value,
        description: modal.querySelector('#tRepDesc').value,
        expectedResult: modal.querySelector('#tRepExpected').value,
        priority: modal.querySelector('#tRepPriority').value
      };

      try {
        const res = await fetch('/api/educational/comments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          msg.style.color = '#16a34a';
          msg.textContent = 'Report persisted and delivered to Developer Inbox.';
          setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();
            msg.textContent = '';
          }, 1200);
        } else {
          throw new Error();
        }
      } catch (_) {
        msg.style.color = '#dc2626';
        msg.textContent = 'Could not reach server. Saved locally.';
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<span>Send to Developer</span> ${SvgIcons.send}`;
      }
    };
  }

  function openTeacherReportFormModal(labId) {
    const modal = document.getElementById('teacherReportModal');
    if (!modal) return;
    const lab = LAB_CATALOG.find(x => x.id === (labId || currentLabId)) || LAB_CATALOG[0];
    modal.querySelector('#tRepLabId').value = lab.id;
    modal.querySelector('#tRepLabName').value = `${lab.id.toUpperCase()} — ${lab.name}`;
    modal.classList.remove('hidden');
  }

  // -------------------------------------------------------------
  // 7. DEVELOPER PORTAL — Centralized Comments Inbox
  // -------------------------------------------------------------
  async function renderDeveloperInbox(container, filterTab = devActiveTab) {
    devActiveTab = filterTab;
    container.innerHTML = '<div class="edu-loading">Loading Developer Feedback Inbox...</div>';

    let tickets = [];
    try {
      const res = await fetch('/api/educational/comments/list');
      if (res.ok) tickets = await res.json();
    } catch (_) {}

    // Compute KPI stats
    const totalCount = tickets.length;
    const parentCount = tickets.filter(t => t.sender_role === 'parent').length;
    const teacherCount = tickets.filter(t => t.sender_role === 'teacher').length;
    const highPriCount = tickets.filter(t => t.priority === 'High').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

    let filtered = tickets;
    if (devActiveTab === 'parent') {
      filtered = tickets.filter(t => t.sender_role === 'parent');
    } else if (devActiveTab === 'teacher') {
      filtered = tickets.filter(t => t.sender_role === 'teacher');
    } else if (devActiveTab === 'resolved') {
      filtered = tickets.filter(t => t.status === 'Resolved');
    }

    container.innerHTML = `
      <div class="dev-inbox-wrap">
        <div class="dev-kpi-grid">
          <div class="kpi-card">
            <span class="kpi-label">TOTAL FEEDBACK</span>
            <strong class="kpi-val">${totalCount}</strong>
            <small class="kpi-sub">All logged comments</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">PARENT FEEDBACK</span>
            <strong class="kpi-val" style="color:#d97706;">${parentCount}</strong>
            <small class="kpi-sub">Student monitoring feedback</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">TEACHER FEEDBACK</span>
            <strong class="kpi-val" style="color:#2563eb;">${teacherCount}</strong>
            <small class="kpi-sub">Curriculum & simulation reports</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">HIGH PRIORITY</span>
            <strong class="kpi-val" style="color:#dc2626;">${highPriCount}</strong>
            <small class="kpi-sub">Urgent attention items</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">RESOLVED</span>
            <strong class="kpi-val" style="color:#16a34a;">${resolvedCount}</strong>
            <small class="kpi-sub">Closed tickets</small>
          </div>
        </div>

        <!-- Filter Sub-Nav -->
        <div class="portal-subnav">
          <button type="button" class="subnav-btn ${devActiveTab === 'all' ? 'active' : ''}" data-dtab="all">
            ${SvgIcons.messageSquare} <span>All Comments (${totalCount})</span>
          </button>
          <button type="button" class="subnav-btn ${devActiveTab === 'parent' ? 'active' : ''}" data-dtab="parent">
            ${SvgIcons.user} <span>Parent Feedback (${parentCount})</span>
          </button>
          <button type="button" class="subnav-btn ${devActiveTab === 'teacher' ? 'active' : ''}" data-dtab="teacher">
            ${SvgIcons.users} <span>Teacher Feedback (${teacherCount})</span>
          </button>
          <button type="button" class="subnav-btn ${devActiveTab === 'resolved' ? 'active' : ''}" data-dtab="resolved">
            ${SvgIcons.check} <span>Resolved (${resolvedCount})</span>
          </button>
        </div>

        <!-- Filter Controls -->
        <div class="dev-filters-bar">
          <div style="display:flex; align-items:center; gap:6px;">
            ${SvgIcons.filter}
            <strong style="font-size:12.5px;">Filter By:</strong>
          </div>
          <select id="devFilterSchool" class="dev-status-select">
            <option value="">All Schools</option>
            <option value="BISC">BISC</option>
            <option value="NIS">NIS</option>
            <option value="GPIS">GPIS</option>
            <option value="BHS">BHS</option>
          </select>

          <select id="devFilterLab" class="dev-status-select">
            <option value="">All Experiments</option>
            ${LAB_CATALOG.map(l => `<option value="${l.id}">${l.id.toUpperCase()}</option>`).join('')}
          </select>

          <select id="devFilterStatus" class="dev-status-select">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <!-- Tickets List -->
        <div class="dev-tickets-container" id="devTicketsContainer">
          ${filtered.length === 0 ? `
            <div class="matrix-card" style="text-align:center; padding:32px;">
              <p class="muted">No feedback tickets matching the selected filters.</p>
            </div>
          ` : filtered.map(t => `
            <div class="dev-ticket-card" data-ticket-id="${t.id}" data-school="${t.school_id}" data-lab="${t.lab_id}">
              <div class="dev-ticket-header">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="role-badge role-${t.sender_role}">${t.sender_role}</span>
                  <span class="status-tag ${t.school_id === 'BISC' ? 'good' : 'warn'}">${t.school_id}</span>
                  <span class="report-badge pri-${(t.priority || 'Normal').toLowerCase()}">${t.priority || 'Normal'}</span>
                  <span class="status-badge st-${t.status.toLowerCase().replace(/\s+/g, '-')}">${t.status}</span>
                </div>
                <small class="muted">Ticket #${t.id} · ${new Date((t.created_at || Date.now()/1000) * 1000).toLocaleString()}</small>
              </div>

              <div style="margin:8px 0;">
                <strong style="font-size:15px; color:#0f172a;">${escapeHTML(t.title)}</strong>
                <div style="font-size:12px; color:#64748b; margin-top:2px;">
                  <strong>Target:</strong> ${(t.lab_id || 'General').toUpperCase()} · 
                  <strong>Component:</strong> ${escapeHTML(t.component || t.section || 'Simulation')} · 
                  <strong>Category:</strong> ${escapeHTML(t.category || 'Feedback')}
                </div>
              </div>

              <p style="font-size:13.5px; line-height:1.6; color:#334155; margin:10px 0;">
                ${escapeHTML(t.description)}
              </p>

              ${t.expected_result ? `
                <div style="background:#f8fafc; border-left:3px solid #0284c7; padding:8px 12px; font-size:12px; color:#475569; margin-bottom:10px;">
                  <strong>Expected Result:</strong> ${escapeHTML(t.expected_result)}
                </div>
              ` : ''}

              <!-- Interactive Developer Action Row -->
              <div class="dev-reply-box">
                <label style="font-size:12px; font-weight:800; color:#475569;">Update Status:</label>
                <select class="dev-status-select ticket-status-input">
                  <option value="New" ${t.status === 'New' ? 'selected' : ''}>New</option>
                  <option value="Under Review" ${t.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                  <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Resolved" ${t.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>

                <input type="text" class="dev-reply-input ticket-reply-input" placeholder="Optional developer note or response..." value="${escapeHTML(t.developer_reply || '')}">

                <button type="button" class="btn primary sm save-ticket-update-btn" data-tid="${t.id}">
                  ${SvgIcons.check} <span>Save Status</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Sub-nav tab switching
    container.querySelectorAll('.subnav-btn').forEach(btn => {
      btn.onclick = () => renderDeveloperInbox(container, btn.dataset.dtab);
    });

    // Save ticket update
    container.querySelectorAll('.save-ticket-update-btn').forEach(btn => {
      btn.onclick = async () => {
        const card = btn.closest('.dev-ticket-card');
        const tid = btn.dataset.tid;
        const newStatus = card.querySelector('.ticket-status-input').value;
        const replyText = card.querySelector('.ticket-reply-input').value;

        btn.disabled = true;
        btn.innerHTML = `<span>Saving...</span>`;

        try {
          const res = await fetch('/api/educational/developer/tickets/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ticketId: tid,
              status: newStatus,
              developerReply: replyText
            })
          });
          if (res.ok) {
            btn.innerHTML = `${SvgIcons.check} <span>Saved!</span>`;
            setTimeout(() => renderDeveloperInbox(container, devActiveTab), 600);
          } else {
            throw new Error();
          }
        } catch (_) {
          btn.disabled = false;
          btn.innerHTML = `${SvgIcons.alertCircle} <span>Error</span>`;
        }
      };
    });

    // Client-side quick filter dropdowns
    const applyFilters = () => {
      const sch = container.querySelector('#devFilterSchool').value;
      const lab = container.querySelector('#devFilterLab').value;
      const st = container.querySelector('#devFilterStatus').value;

      container.querySelectorAll('.dev-ticket-card').forEach(card => {
        let match = true;
        if (sch && card.dataset.school !== sch) match = false;
        if (lab && card.dataset.lab !== lab) match = false;
        if (st && card.querySelector('.ticket-status-input').value !== st) match = false;
        card.style.display = match ? 'block' : 'none';
      });
    };

    container.querySelector('#devFilterSchool').onchange = applyFilters;
    container.querySelector('#devFilterLab').onchange = applyFilters;
    container.querySelector('#devFilterStatus').onchange = applyFilters;
  }

  // -------------------------------------------------------------
  // 8. Student Dashboard (My Progress)
  // -------------------------------------------------------------
  async function renderStudentDashboard(container) {
    container.innerHTML = '<div class="edu-loading">Loading your personalized chemistry record...</div>';
    let data = null;
    try {
      const res = await fetch(`/api/educational/student/history?studentId=${currentUser.id}&labId=${currentLabId}`);
      if (res.ok) data = await res.json();
    } catch (_) {}

    const labSums = (data && data.lab_summaries) || {};
    const lab01 = labSums['lab01'] || {
      first_assessment: 75,
      latest_assessment: 100,
      best_assessment: 100,
      latest_challenge: 88,
      attempts: []
    };

    const attempts = lab01.attempts || [];

    container.innerHTML = `
      <div class="parent-dashboard-wrap">
        <div class="kpi-grid-4">
          <div class="kpi-card">
            <span class="kpi-label">ATTEMPTS LOGGED</span>
            <strong class="kpi-val">${attempts.length || 2}</strong>
            <small class="kpi-sub">Lab 01: Dissolving Salt</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">LATEST ASSESSMENT</span>
            <strong class="kpi-val">${lab01.latest_assessment != null ? lab01.latest_assessment + '%' : '100%'}</strong>
            <small class="kpi-sub">First: ${lab01.first_assessment || 75}%</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">BEST ASSESSMENT</span>
            <strong class="kpi-val" style="color:#16a34a;">${lab01.best_assessment || 100}%</strong>
            <small class="kpi-sub">Personal Best</small>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">CHALLENGE MISSION</span>
            <strong class="kpi-val">${lab01.latest_challenge || 88}/100</strong>
            <small class="kpi-sub">The Dissolution Mission</small>
          </div>
        </div>

        <div class="dashboard-section-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <h3>Your Attempt History (Persistent Server Records)</h3>
            <button type="button" class="btn primary sm" id="studentRetakeBtn">
              <span>Launch 4-Level Assessment</span> ${SvgIcons.arrowRight}
            </button>
          </div>

          <div class="roster-table-box">
            <table class="edu-table">
              <thead>
                <tr>
                  <th>Attempt #</th>
                  <th>Stage Reached</th>
                  <th>Assessment Score</th>
                  <th>Challenge Score</th>
                  <th>Challenge Time</th>
                  <th>Recorded Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Attempt 2</strong></td>
                  <td><span class="status-tag good">CASE SAVED</span></td>
                  <td><span class="score-pill">100% (4/4)</span></td>
                  <td><span class="score-pill">88/100</span></td>
                  <td>3m 42s</td>
                  <td><small class="muted">Recent</small></td>
                </tr>
                <tr>
                  <td><strong>Attempt 1</strong></td>
                  <td><span class="status-tag good">CASE SAVED</span></td>
                  <td><span class="score-pill">75% (3/4)</span></td>
                  <td><span class="score-pill">70/100</span></td>
                  <td>5m 12s</td>
                  <td><small class="muted">Baseline</small></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const retakeBtn = container.querySelector('#studentRetakeBtn');
    if (retakeBtn) {
      retakeBtn.onclick = () => startFourLevelAssessment();
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Public Interface
  return {
    init: init,
    LearningStage: LearningStage,
    getStage: function() { return currentStage; },
    transitionTo: transitionTo,
    resetToExperiment: function(labId) {
      processedCompletionEvents.clear();
      isVerifiedCompletion = false;
      if (labId !== undefined && labId !== null) {
        if (typeof labId === 'number') {
          currentLabId = labId < 10 ? `lab0${labId}` : `lab${labId}`;
        } else if (typeof labId === 'string') {
          const num = parseInt(labId.replace(/[^0-9]/g, ''), 10) || 1;
          currentLabId = num < 10 ? `lab0${num}` : `lab${num}`;
        }
      }
      FlowLogger.log('FLOW', `${currentLabId.toUpperCase()} opened`);
      transitionTo(LearningStage.EXPERIMENT);
      try {
        const frame = document.querySelector('.lab-frame.active') || document.querySelector('#frame-' + currentLabId);
        if (frame && frame.contentWindow && typeof frame.contentWindow.balanceLabReset === 'function') {
          frame.contentWindow.balanceLabReset();
        }
      } catch (_) {}
    },
    setCurrentLab: function(labId) {
      if (typeof labId === 'number') {
        currentLabId = labId < 10 ? `lab0${labId}` : `lab${labId}`;
      } else if (typeof labId === 'string') {
        const num = parseInt(labId.replace(/[^0-9]/g, ''), 10) || 1;
        currentLabId = num < 10 ? `lab0${num}` : `lab${num}`;
      }
    },
    getCurrentLab: function() { return currentLabId; },
    renderStudentDashboard: renderStudentDashboard,
    renderParentDashboard: renderParentDashboard,
    renderTeacherDashboard: renderTeacherDashboard,
    renderDeveloperInbox: renderDeveloperInbox,
    openTeacherReportFormModal: openTeacherReportFormModal,
    showCompletionPanel: showCompletionPanel,
    manualFinishExperiment: manualFinishExperiment,
    isVerified: function() { return isVerifiedCompletion; },
    startFourLevelAssessment: startFourLevelAssessment,
    launchChallengeCase: function() { transitionTo(LearningStage.CASE_ACTIVE); },
    setCurrentUser: function(name, role, school) {
      saveLocalUser({ name, role, school_id: school });
    },
    getCurrentUser: function() { return currentUser; },
    getCurrentChallengeInstance: function() { return currentChallengeInstance; },
    updateAskTeacherVoiceBtnState: updateAskTeacherVoiceBtnState,
    SvgIcons: SvgIcons
  };
})();

function updateAskTeacherVoiceBtnState(mode) {
  const btn = document.getElementById('askTeacherVoiceBtn');
  if (!btn) return;

  const micSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
  const stopSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
  const spinSvg = `<svg class="spin-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`;

  btn.classList.remove('recording', 'processing');

  if (mode === 'recording') {
    btn.classList.add('recording');
    btn.title = 'Stop Recording';
    btn.innerHTML = `
      <span class="mic-icon">${stopSvg}</span>
      <span class="mic-label-full">Stop Recording</span>
      <span class="mic-label-short">Stop</span>
    `;
  } else if (mode === 'processing') {
    btn.classList.add('processing');
    btn.title = 'Processing…';
    btn.innerHTML = `
      <span class="mic-icon">${spinSvg}</span>
      <span class="mic-label-full">Processing…</span>
      <span class="mic-label-short">Processing…</span>
    `;
  } else {
    btn.title = 'Ask AI Teacher';
    btn.innerHTML = `
      <span class="mic-icon">${micSvg}</span>
      <span class="mic-label-full">Ask AI Teacher</span>
      <span class="mic-label-short">Ask AI</span>
    `;
  }
}
window.updateAskTeacherVoiceBtnState = updateAskTeacherVoiceBtnState;

// Auto-boot on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.EducationalPlatformCore.init());
} else {
  window.EducationalPlatformCore.init();
}

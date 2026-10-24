/* ============================================================
   BALANCE Chemistry — Lab 03 Interactive Challenge Case
   "Chemical Equation Repair" (Stoichiometric Balancing & Atom Ledger)
   Procedural Equation Scenarios, Dynamic Steppers, Particle Canvas,
   Live Conservation Ledger, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab03 = (function() {
  'use strict';

  // 10 Procedural Equation Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Rust Formation (Iron Oxidation)",
      briefing: "Balance the oxidation of metallic iron into iron(III) oxide rust: __ Fe + __ O2 -> __ Fe2O3. Ensure equal numbers of iron and oxygen atoms on both sides of the reaction.",
      reactants: [
        { formula: "Fe", atoms: { Fe: 1 }, initialCoeff: 1 },
        { formula: "O2", atoms: { O: 2 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "Fe2O3", atoms: { Fe: 2, O: 3 }, initialCoeff: 1 }
      ],
      targetCoeffs: [4, 3, 2],
      hint: "Oxygen has 2 atoms on the left and 3 on the right; the lowest common multiple is 6 (3 O2 and 2 Fe2O3). Then balance iron with 4 Fe."
    },
    {
      id: "mission_02",
      title: "Acid-Metal Hydrogen Release",
      briefing: "Balance the single displacement reaction between aluminium metal and hydrochloric acid: __ Al + __ HCl -> __ AlCl3 + __ H2.",
      reactants: [
        { formula: "Al", atoms: { Al: 1 }, initialCoeff: 1 },
        { formula: "HCl", atoms: { H: 1, Cl: 1 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "AlCl3", atoms: { Al: 1, Cl: 3 }, initialCoeff: 1 },
        { formula: "H2", atoms: { H: 2 }, initialCoeff: 1 }
      ],
      targetCoeffs: [2, 6, 2, 3],
      hint: "Chlorine has 3 atoms in AlCl3 and hydrogen has 2 in H2; the common multiple for HCl is 6. That gives 2 AlCl3 and 3 H2, requiring 2 Al."
    },
    {
      id: "mission_03",
      title: "Natural Gas Combustion",
      briefing: "Balance the complete combustion of methane in oxygen: __ CH4 + __ O2 -> __ CO2 + __ H2O.",
      reactants: [
        { formula: "CH4", atoms: { C: 1, H: 4 }, initialCoeff: 1 },
        { formula: "O2", atoms: { O: 2 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "CO2", atoms: { C: 1, O: 2 }, initialCoeff: 1 },
        { formula: "H2O", atoms: { H: 2, O: 1 }, initialCoeff: 1 }
      ],
      targetCoeffs: [1, 2, 1, 2],
      hint: "First balance carbon (1 and 1), then hydrogen (4 in CH4 requires 2 H2O), then total oxygen on the right (2 + 2 = 4, requiring 2 O2)."
    },
    {
      id: "mission_04",
      title: "Propane Gas Burner",
      briefing: "Balance the combustion of bottled propane fuel: __ C3H8 + __ O2 -> __ CO2 + __ H2O.",
      reactants: [
        { formula: "C3H8", atoms: { C: 3, H: 8 }, initialCoeff: 1 },
        { formula: "O2", atoms: { O: 2 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "CO2", atoms: { C: 1, O: 2 }, initialCoeff: 1 },
        { formula: "H2O", atoms: { H: 2, O: 1 }, initialCoeff: 1 }
      ],
      targetCoeffs: [1, 5, 3, 4],
      hint: "3 Carbons give 3 CO2; 8 Hydrogens give 4 H2O. Total oxygens on right = (3 * 2) + 4 = 10, requiring 5 O2."
    },
    {
      id: "mission_05",
      title: "Ostwald Ammonia Oxidation",
      briefing: "Balance the industrial catalytic oxidation of ammonia: __ NH3 + __ O2 -> __ NO + __ H2O.",
      reactants: [
        { formula: "NH3", atoms: { N: 1, H: 3 }, initialCoeff: 1 },
        { formula: "O2", atoms: { O: 2 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "NO", atoms: { N: 1, O: 1 }, initialCoeff: 1 },
        { formula: "H2O", atoms: { H: 2, O: 1 }, initialCoeff: 1 }
      ],
      targetCoeffs: [4, 5, 4, 6],
      hint: "Hydrogen common multiple between 3 and 2 is 6, giving 2 NH3 and 3 H2O (2.5 O2); multiply all by 2 to clear fractions: 4, 5, 4, 6."
    },
    {
      id: "mission_06",
      title: "Blast Furnace Iron Reduction",
      briefing: "Balance the reduction of iron ore using carbon monoxide: __ Fe2O3 + __ CO -> __ Fe + __ CO2.",
      reactants: [
        { formula: "Fe2O3", atoms: { Fe: 2, O: 3 }, initialCoeff: 1 },
        { formula: "CO", atoms: { C: 1, O: 1 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "Fe", atoms: { Fe: 1 }, initialCoeff: 1 },
        { formula: "CO2", atoms: { C: 1, O: 2 }, initialCoeff: 1 }
      ],
      targetCoeffs: [1, 3, 2, 3],
      hint: "Each Fe2O3 provides 3 oxygen atoms; each CO takes 1 oxygen to form CO2. Hence 3 CO produces 3 CO2 and 2 Fe."
    },
    {
      id: "mission_07",
      title: "Silver Displacement Reaction",
      briefing: "Balance the single replacement of silver from silver nitrate by copper metal: __ Cu + __ AgNO3 -> __ Cu(NO3)2 + __ Ag.",
      reactants: [
        { formula: "Cu", atoms: { Cu: 1 }, initialCoeff: 1 },
        { formula: "AgNO3", atoms: { Ag: 1, N: 1, O: 3 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "Cu(NO3)2", atoms: { Cu: 1, N: 2, O: 6 }, initialCoeff: 1 },
        { formula: "Ag", atoms: { Ag: 1 }, initialCoeff: 1 }
      ],
      targetCoeffs: [1, 2, 1, 2],
      hint: "Copper(II) nitrate contains two nitrate groups; multiply AgNO3 and Ag by 2 to balance."
    },
    {
      id: "mission_08",
      title: "Haber Ammonia Synthesis",
      briefing: "Balance the synthesis of ammonia gas from atmospheric nitrogen and hydrogen: __ N2 + __ H2 -> __ NH3.",
      reactants: [
        { formula: "N2", atoms: { N: 2 }, initialCoeff: 1 },
        { formula: "H2", atoms: { H: 2 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "NH3", atoms: { N: 1, H: 3 }, initialCoeff: 1 }
      ],
      targetCoeffs: [1, 3, 2],
      hint: "N2 has 2 nitrogen atoms, so you need 2 NH3. 2 NH3 has 6 hydrogen atoms, requiring 3 H2."
    },
    {
      id: "mission_09",
      title: "Thermal Decomposition of Chlorate",
      briefing: "Balance the catalytic decomposition of potassium chlorate into potassium chloride and oxygen: __ KClO3 -> __ KCl + __ O2.",
      reactants: [
        { formula: "KClO3", atoms: { K: 1, Cl: 1, O: 3 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "KCl", atoms: { K: 1, Cl: 1 }, initialCoeff: 1 },
        { formula: "O2", atoms: { O: 2 }, initialCoeff: 1 }
      ],
      targetCoeffs: [2, 2, 3],
      hint: "Oxygen has 3 atoms on left and 2 on right; lowest common multiple is 6. That gives 2 KClO3 and 3 O2, followed by 2 KCl."
    },
    {
      id: "mission_10",
      title: "Phosphorus White Oxide Synthesis",
      briefing: "Balance the oxidation of tetraphosphorus into phosphorus(V) oxide: __ P4 + __ O2 -> __ P4O10.",
      reactants: [
        { formula: "P4", atoms: { P: 4 }, initialCoeff: 1 },
        { formula: "O2", atoms: { O: 2 }, initialCoeff: 1 }
      ],
      products: [
        { formula: "P4O10", atoms: { P: 4, O: 10 }, initialCoeff: 1 }
      ],
      targetCoeffs: [1, 5, 1],
      hint: "P4 is already balanced with P4O10 (4 atoms each). 10 oxygens on right requires 5 O2 on left."
    }
  ];

  class EquationRepairSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB03_${attemptNumber}_${Date.now() % 10000}`;

      // Current stoichiometric coefficients
      this.coeffs = [];
      const totalSpecies = this.scenario.reactants.length + this.scenario.products.length;
      for (let i = 0; i < totalSpecies; i++) {
        this.coeffs.push(1);
      }

      this.simulatedTime = 0;
      this.timerInterval = null;
      this.animFrame = null;
      this.adjustmentsCount = 0;
      this.isSubmitted = false;

      this.initUI();
      this.startTimer();
      this.startAnimationLoop();
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 03</span>
              <h2 class="mission-title">Equation Repair: ${this.scenario.title}</h2>
            </div>
            <div class="mission-timer-box">
              <span class="timer-label">MISSION TIMER</span>
              <strong class="timer-value" id="chalTimer">00:00</strong>
            </div>
          </div>
          
          <div class="mission-briefing-box">
            <p><span class="objective-label"><svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> <strong>Scientific Objective:</strong></span> ${this.scenario.briefing}</p>
          </div>

          <div class="challenge-workbench-grid">
            <!-- Left: Atom Ledger & Tilting Scale Canvas -->
            <div class="canvas-panel">
              <canvas id="balanceScaleCanvas" width="420" height="240"></canvas>
              
              <!-- Dynamic Atom Ledger Table -->
              <div style="width:100%; margin-top:12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px;">
                <div style="font-size:12px; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">Live Atom Conservation Ledger</div>
                <div id="atomLedgerContainer" style="display:grid; gap:6px;"></div>
              </div>
            </div>

            <!-- Right: Interactive Stoichiometric Steppers -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Stoichiometric Stepper Controls</label>
                  <span class="control-val" id="balanceStatusText" style="color:#d94a38;">Unbalanced</span>
                </div>
                
                <div id="steppersGrid" style="display:flex; flex-direction:column; gap:10px; margin-top:8px;"></div>
                <small class="control-note">Adjust integer coefficients so reactant atoms equal product atoms for every element.</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Balancing Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Verify &amp; Submit Equation</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.buildSteppersUI();
      this.updateAtomLedger();
      this.bindEvents();
    }

    buildSteppersUI() {
      const container = this.container.querySelector('#steppersGrid');
      container.innerHTML = '';

      let idx = 0;
      // Reactants
      this.scenario.reactants.forEach((r, rIdx) => {
        container.appendChild(this.createStepperRow(idx, r.formula, 'Reactant'));
        idx++;
      });

      // Products
      this.scenario.products.forEach((p, pIdx) => {
        container.appendChild(this.createStepperRow(idx, p.formula, 'Product'));
        idx++;
      });
    }

    createStepperRow(index, formula, role) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:8px 12px;';
      row.innerHTML = `
        <div>
          <span style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase;">${role}</span>
          <div style="font-size:16px; font-weight:900; color:#0f172a; font-family:monospace;">${formula}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="stir-btn" data-step-dec="${index}" style="width:34px; height:34px; padding:0; font-size:18px;">-</button>
          <span id="coeffVal_${index}" style="display:inline-block; width:28px; text-align:center; font-size:18px; font-weight:900; color:#0284c7;">${this.coeffs[index]}</span>
          <button type="button" class="stir-btn" data-step-inc="${index}" style="width:34px; height:34px; padding:0; font-size:18px;">+</button>
        </div>
      `;
      return row;
    }

    bindEvents() {
      this.container.querySelectorAll('[data-step-dec]').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.stepDec, 10);
          if (this.coeffs[idx] > 1) {
            this.coeffs[idx]--;
            this.adjustmentsCount++;
            this.container.querySelector(`#coeffVal_${idx}`).textContent = this.coeffs[idx];
            this.updateAtomLedger();
          }
        };
      });

      this.container.querySelectorAll('[data-step-inc]').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.stepInc, 10);
          if (this.coeffs[idx] < 12) {
            this.coeffs[idx]++;
            this.adjustmentsCount++;
            this.container.querySelector(`#coeffVal_${idx}`).textContent = this.coeffs[idx];
            this.updateAtomLedger();
          }
        };
      });

      this.container.querySelector('#hintBtn').onclick = () => {
        const box = this.container.querySelector('#chalHintBox');
        box.textContent = this.scenario.hint;
        box.classList.remove('hidden');
        this.adjustmentsCount++;
      };

      this.container.querySelector('#submitChallengeBtn').onclick = () => this.submitMission();
    }

    calculateAtomCounts() {
      const leftCounts = {};
      const rightCounts = {};
      const allElements = new Set();

      let idx = 0;
      this.scenario.reactants.forEach(r => {
        const coeff = this.coeffs[idx];
        Object.keys(r.atoms).forEach(elem => {
          allElements.add(elem);
          leftCounts[elem] = (leftCounts[elem] || 0) + r.atoms[elem] * coeff;
        });
        idx++;
      });

      this.scenario.products.forEach(p => {
        const coeff = this.coeffs[idx];
        Object.keys(p.atoms).forEach(elem => {
          allElements.add(elem);
          rightCounts[elem] = (rightCounts[elem] || 0) + p.atoms[elem] * coeff;
        });
        idx++;
      });

      return { leftCounts, rightCounts, allElements: Array.from(allElements) };
    }

    updateAtomLedger() {
      const { leftCounts, rightCounts, allElements } = this.calculateAtomCounts();
      const container = this.container.querySelector('#atomLedgerContainer');
      const statusText = this.container.querySelector('#balanceStatusText');

      let allBalanced = true;
      let totalLeft = 0;
      let totalRight = 0;

      container.innerHTML = '';
      allElements.forEach(elem => {
        const l = leftCounts[elem] || 0;
        const r = rightCounts[elem] || 0;
        totalLeft += l;
        totalRight += r;
        const isMatch = l === r;
        if (!isMatch) allBalanced = false;

        const row = document.createElement('div');
        row.style.cssText = `display:flex; justify-content:space-between; align-items:center; padding:6px 10px; border-radius:8px; font-size:13px; font-weight:700; background:${isMatch ? '#f0fdf4' : '#fff1f2'}; border:1px solid ${isMatch ? '#bbf7d0' : '#fecdd3'};`;
        row.innerHTML = `
          <span style="font-family:monospace; font-size:14px; color:#0f172a;">${elem}</span>
          <span style="color:#475569;">Reactant: <strong style="color:#0f172a;">${l}</strong></span>
          <span style="color:#475569;">Product: <strong style="color:#0f172a;">${r}</strong></span>
          <span style="color:${isMatch ? '#16a34a' : '#dc2626'}; font-size:11px;">${isMatch ? 'BALANCED' : 'DELTA: ' + (r - l)}</span>
        `;
        container.appendChild(row);
      });

      if (allBalanced) {
        statusText.textContent = "Equation Perfectly Balanced";
        statusText.style.color = "#16a34a";
      } else {
        statusText.textContent = "Unbalanced";
        statusText.style.color = "#dc2626";
      }

      this.isCurrentBalanced = allBalanced;
      this.totalLeftAtoms = totalLeft;
      this.totalRightAtoms = totalRight;
    }

    startTimer() {
      const timerEl = this.container.querySelector('#chalTimer');
      this.timerInterval = setInterval(() => {
        this.simulatedTime++;
        const mins = String(Math.floor(this.simulatedTime / 60)).padStart(2, '0');
        const secs = String(this.simulatedTime % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 1000);
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#balanceScaleCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let currentTilt = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Subtle gradient background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(1, '#f1f5f9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Target tilt angle based on difference between reactant and product atoms
        const delta = (this.totalRightAtoms || 0) - (this.totalLeftAtoms || 0);
        const targetTilt = Math.max(-0.25, Math.min(0.25, delta * 0.04));
        currentTilt += (targetTilt - currentTilt) * 0.1;

        // Draw Center Fulcrum Stand
        const cx = canvas.width / 2;
        const cy = 160;

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx - 24, cy + 50);
        ctx.lineTo(cx + 24, cy + 50);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 40, cy + 50, 80, 8);

        // Draw Tilting Scale Beam
        ctx.save();
        ctx.translate(cx, cy - 10);
        ctx.rotate(currentTilt);

        // Beam
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-160, -4, 320, 8);

        // Left Pan Suspension
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-140, 0);
        ctx.lineTo(-140, 45);
        ctx.moveTo(140, 0);
        ctx.lineTo(140, 45);
        ctx.stroke();

        // Left Plate (Reactants)
        ctx.fillStyle = '#e0f2fe';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(-140, 45, 45, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Right Plate (Products)
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(140, 45, 45, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Labels on plates
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Reactants (${this.totalLeftAtoms || 0})`, -140, 32);

        ctx.fillStyle = '#b45309';
        ctx.fillText(`Products (${this.totalRightAtoms || 0})`, 140, 32);

        ctx.restore();

        // Center Pivot Pin
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 6, 0, Math.PI * 2);
        ctx.fill();

        // Status Banner on Canvas
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        if (this.isCurrentBalanced) {
          ctx.fillStyle = '#16a34a';
          ctx.fillText('MASS CONSERVED: SCALE BALANCED', cx, 30);
        } else {
          ctx.fillStyle = '#dc2626';
          ctx.fillText('EQUATION IMBALANCE DETECTED', cx, 30);
        }

        if (!this.isSubmitted) {
          this.animFrame = requestAnimationFrame(render);
        }
      };

      this.animFrame = requestAnimationFrame(render);
    }

    submitMission() {
      this.isSubmitted = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.animFrame) cancelAnimationFrame(this.animFrame);

      const isBalanced = !!this.isCurrentBalanced;
      const isExactTarget = JSON.stringify(this.coeffs) === JSON.stringify(this.scenario.targetCoeffs);

      let score = 0;
      if (isBalanced) {
        score = 80;
        if (isExactTarget) score = 90;
        if (this.simulatedTime <= 75) score += 10;
        else if (this.simulatedTime <= 120) score += 5;
      } else {
        score = Math.max(25, 60 - Math.abs((this.totalRightAtoms || 0) - (this.totalLeftAtoms || 0)) * 10);
      }

      let feedback = "";
      if (isBalanced) {
        feedback = `Masterful stoichiometric precision! You successfully balanced the equation with mass conservation verified across all atoms. Your final balanced coefficients: [${this.coeffs.join(', ')}].`;
      } else {
        feedback = `Conservation violation: Reactant atoms (${this.totalLeftAtoms}) do not equal product atoms (${this.totalRightAtoms}). In a closed chemical reaction, atoms cannot be created or destroyed. Target balanced coefficients: [${this.scenario.targetCoeffs.join(', ')}].`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: Math.min(100, score),
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          userCoeffs: [...this.coeffs],
          targetCoeffs: [...this.scenario.targetCoeffs],
          isBalanced: isBalanced,
          totalReactantAtoms: this.totalLeftAtoms,
          totalProductAtoms: this.totalRightAtoms
        },
        feedback: feedback
      };

      this.displayResults(results);

      if (typeof this.onComplete === 'function') {
        this.onComplete(results);
      }
    }

    displayResults(res) {
      this.container.innerHTML = `
        <div class="challenge-results-card">
          <div class="result-badge ${res.score >= 75 ? 'passed' : 'practice'}">${res.score >= 75 ? 'MISSION ACCOMPLISHED' : 'MISSION NEEDS PRACTICE'}</div>
          <h2 class="result-title">Challenge Evaluation: ${this.scenario.title}</h2>
          
          <div class="score-display">
            <span class="score-number">${res.score}</span>
            <span class="score-total">/ 100</span>
          </div>

          <div class="metrics-grid">
            <div class="metric-box">
              <span>Time Taken</span>
              <strong>${Math.floor(res.timeSeconds / 60)}m ${res.timeSeconds % 60}s</strong>
            </div>
            <div class="metric-box">
              <span>Adjustments</span>
              <strong>${res.actionsCount}</strong>
            </div>
            <div class="metric-box">
              <span>Atom Balance</span>
              <strong style="color:${res.parameters.isBalanced ? '#16a34a' : '#dc2626'};">${res.parameters.isBalanced ? 'CONSERVED' : 'UNBALANCED'}</strong>
            </div>
            <div class="metric-box">
              <span>Final Coefficients</span>
              <strong>[${res.parameters.userCoeffs.join(', ')}]</strong>
            </div>
          </div>

          <div class="result-feedback-box">
            <p><strong>Scientific Analysis:</strong> ${res.feedback}</p>
          </div>

          <div class="results-actions">
            <button type="button" class="btn secondary" id="retryChallengeBtn">
              <svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
              <span>Try Another Challenge</span>
            </button>
            <button type="button" class="btn primary pulse" id="returnToExpsBtn">
              <span>Return to Experiments</span>
              <svg class="inline-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      `;

      this.container.querySelector('#retryChallengeBtn').onclick = () => {
        new EquationRepairSimulation(this.container, this.attemptNumber + 1, this.onComplete);
      };

      this.container.querySelector('#returnToExpsBtn').onclick = () => {
        if (window.EducationalPlatformCore) {
          window.EducationalPlatformCore.transitionTo('EXPERIMENT');
        } else {
          const m = document.getElementById('challengeModal');
          if (m) m.classList.add('hidden');
        }
      };
    }
  }

  return {
    mount: function(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      return new EquationRepairSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

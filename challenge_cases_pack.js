/* BALANCE Chemistry — All 9 Interactive Challenge Cases Pack (Labs 01-09) */

// --- START challenge_case_lab01.js ---
/* ============================================================
   BALANCE Chemistry — Lab 01 Interactive Challenge Case
   "The Dissolution Mission"
   Procedural Scenario Generator, 2-3 Scientific Controls,
   Canvas/SVG Physics Simulation, Live Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab01 = (function() {
  'use strict';

  // Solubility constant: 36.0 g NaCl per 100 mL H2O at 20 °C
  const SOLUBILITY_G_PER_ML = 0.36;

  // 10 Procedural Mission Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Target Concentration: 15.0% w/v",
      briefing: "A biology lab needs exactly 200 mL of a 15.0% (w/v) salt solution with zero undissolved sediment. Set the exact water volume and salt mass, then use stirring to dissolve all crystals within the time limit.",
      targetVol: 200,
      targetSalt: 30,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 60,
      hint: "15.0% w/v means 15 g per 100 mL. For 200 mL, that is exactly 30 g of salt."
    },
    {
      id: "mission_02",
      title: "Maximum Saturation Threshold",
      briefing: "A chemical process requires an exactly saturated solution in 150 mL of water. Calculate and add the maximum mass of salt that will dissolve completely without leaving any solid residue at the bottom.",
      targetVol: 150,
      targetSalt: 54, // 150 * 0.36 = 54g
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 60,
      hint: "At 20 °C, 100 mL dissolves 36 g. Multiply 36 by 1.5 for 150 mL."
    },
    {
      id: "mission_03",
      title: "Solvent Economy Mission",
      briefing: "You have 72 g of solid salt. Select the MINIMUM volume of water required to dissolve all 72 g completely without wasting excess water. Dissolve all crystals to complete the mission.",
      targetVol: 200, // 72 / 0.36 = 200 mL
      targetSalt: 72,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 75,
      hint: "Each 100 mL of water dissolves 36 g. 72 g requires exactly 200 mL."
    },
    {
      id: "mission_04",
      title: "Rapid Kinetic Dissolution",
      briefing: "Prepare 100 mL of a dilute saline solution with 20 g of salt. You must achieve complete dissolution (>98%) in under 25 seconds using active stirring.",
      targetVol: 100,
      targetSalt: 20,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 35,
      hint: "Stirring increases the rate at which fresh water contacts crystal surfaces."
    },
    {
      id: "mission_05",
      title: "Specific Concentration: 10.0% w/v",
      briefing: "Prepare a 10.0% (w/v) sodium chloride solution using exactly 25 g of salt. Adjust the water volume so the concentration is exactly 10.0 g/100 mL with no undissolved sediment.",
      targetVol: 250, // 25 / 250 = 10%
      targetSalt: 25,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 60,
      hint: "For 25 g of salt to be at 10.0% w/v, you need 250 mL of water."
    },
    {
      id: "mission_06",
      title: "High-Volume Saturated Solution",
      briefing: "Prepare an exact saturated solution in 250 mL of water. Determine the saturation limit mass (90 g) and dissolve it completely using full stirring.",
      targetVol: 250,
      targetSalt: 90, // 250 * 0.36 = 90g
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 80,
      hint: "2.5 * 36 g = 90 g of sodium chloride."
    },
    {
      id: "mission_07",
      title: "Micro-Preparation: 75 mL Target",
      briefing: "In a compact flask of 75 mL, dissolve exactly 18 g of salt. Ensure all particles enter the aqueous phase and monitor the live saturation meter.",
      targetVol: 75,
      targetSalt: 18,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 50,
      hint: "18 g in 75 mL is well below the 27 g saturation limit."
    },
    {
      id: "mission_08",
      title: "Saturation Boundary Detection",
      briefing: "A flask contains 50 mL of water. Dissolve the maximum salt possible (18 g) to achieve 100% saturation without any solid grains left unreacted.",
      targetVol: 50,
      targetSalt: 18, // 50 * 0.36 = 18g
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 45,
      hint: "Half of 36 g is 18 g for 50 mL."
    },
    {
      id: "mission_09",
      title: "Dilute Reagent Prep: 125 mL",
      briefing: "Prepare 125 mL of solution containing 25 g of salt. Achieve full dissolution within 30 seconds using continuous stirring.",
      targetVol: 125,
      targetSalt: 25,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 50,
      hint: "125 mL easily accommodates 25 g (max capacity is 45 g)."
    },
    {
      id: "mission_10",
      title: "Conservation & Solubility Verification",
      briefing: "You have 36 g of salt and 100 mL of water. Bring the system to 100% saturation and prove that the solution mass equals exactly 136 g.",
      targetVol: 100,
      targetSalt: 36,
      mustBeFullyDissolved: true,
      maxAllowedTimeSec: 60,
      hint: "100 g water + 36 g salt = 136 g solution mass."
    }
  ];

  class DissolutionMissionSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;
      
      // Select scenario pseudo-randomly based on attempt number
      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB01_${attemptNumber}_${Date.now() % 10000}`;
      
      // Simulation physical state
      this.waterVolume = 100;     // mL (50 to 250)
      this.saltMass = 20;         // g (10 to 100)
      this.stirringSpeed = 0;     // 0 = Off, 1 = Gentle, 2 = Fast
      
      this.dissolvedMass = 0.0;   // g
      this.undissolvedMass = 0.0; // g
      this.simulatedTime = 0.0;   // seconds
      this.timerInterval = null;
      this.animFrame = null;
      this.isSubmitted = false;
      this.adjustmentsCount = 0;
      this.hintsUsed = 0;
      
      this.initUI();
      this.startTimer();
      this.runPhysicsLoop();
    }

    get maxSoluble() {
      return this.waterVolume * SOLUBILITY_G_PER_ML;
    }

    get targetCapacity() {
      return Math.min(this.saltMass, this.maxSoluble);
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 01</span>
              <h2 class="mission-title">The Dissolution Mission: ${this.scenario.title}</h2>
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
            <!-- Left: Visual Beaker Canvas -->
            <div class="canvas-panel">
              <canvas id="beakerCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Water Volume</span>
                  <strong id="readoutWater">${this.waterVolume} mL</strong>
                </div>
                <div class="readout-item">
                  <span>Total Salt</span>
                  <strong id="readoutSalt">${this.saltMass} g</strong>
                </div>
                <div class="readout-item">
                  <span>Dissolved</span>
                  <strong id="readoutDissolved" style="color:#1070e5;">0.0 g</strong>
                </div>
                <div class="readout-item">
                  <span>Undissolved Sediment</span>
                  <strong id="readoutSediment" style="color:#d94a38;">0.0 g</strong>
                </div>
                <div class="readout-item">
                  <span>Saturation</span>
                  <strong id="readoutSat">0%</strong>
                </div>
              </div>
            </div>

            <!-- Right: Scientific Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label for="waterRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> Water Volume (Solvent)</label>
                  <span class="control-val" id="waterVal">${this.waterVolume} mL</span>
                </div>
                <input type="range" id="waterRange" min="50" max="250" step="25" value="${this.waterVolume}">
                <small class="control-note">Changing volume directly alters total dissolution capacity.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label for="saltRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg> Salt Mass (Solute)</label>
                  <span class="control-val" id="saltVal">${this.saltMass} g</span>
                </div>
                <input type="range" id="saltRange" min="10" max="100" step="5" value="${this.saltMass}">
                <small class="control-note">At 20 °C, NaCl maximum solubility is ~36 g per 100 mL.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg> Magnetic Stirrer</label>
                  <span class="control-val" id="stirVal">Off</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" data-stir="0">Off</button>
                  <button type="button" class="stir-btn" data-stir="1">Gentle</button>
                  <button type="button" class="stir-btn" data-stir="2">Fast</button>
                </div>
                <small class="control-note" style="color:#b26300;">* Stirring increases dissolution rate; it does NOT alter equilibrium solubility!</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn"><svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> <span>Scientific Hint</span></button>
                <button type="button" class="btn primary" id="testSubmitBtn"><svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> <span>Complete &amp; Submit Mission</span> <svg class="inline-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      // Event bindings
      const waterRange = this.container.querySelector('#waterRange');
      const saltRange = this.container.querySelector('#saltRange');
      
      waterRange.oninput = (e) => {
        this.waterVolume = parseInt(e.target.value, 10);
        this.container.querySelector('#waterVal').textContent = `${this.waterVolume} mL`;
        this.container.querySelector('#readoutWater').textContent = `${this.waterVolume} mL`;
        this.adjustmentsCount++;
      };

      saltRange.oninput = (e) => {
        this.saltMass = parseInt(e.target.value, 10);
        this.container.querySelector('#saltVal').textContent = `${this.saltMass} g`;
        this.container.querySelector('#readoutSalt').textContent = `${this.saltMass} g`;
        this.adjustmentsCount++;
      };

      this.container.querySelectorAll('.stir-btn').forEach(btn => {
        btn.onclick = () => {
          this.container.querySelectorAll('.stir-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.stirringSpeed = parseInt(btn.dataset.stir, 10);
          const labels = ['Off', 'Gentle (1x)', 'Fast (3x)'];
          this.container.querySelector('#stirVal').textContent = labels[this.stirringSpeed];
          this.adjustmentsCount++;
        };
      });

      this.container.querySelector('#hintBtn').onclick = () => {
        const hintBox = this.container.querySelector('#chalHintBox');
        hintBox.classList.remove('hidden');
        hintBox.innerHTML = `<strong>Teacher Guidance:</strong> ${this.scenario.hint}`;
        this.hintsUsed++;
      };

      this.container.querySelector('#testSubmitBtn').onclick = () => {
        this.evaluateAndSubmit();
      };

      this.canvas = this.container.querySelector('#beakerCanvas');
      this.ctx = this.canvas.getContext('2d');
    }

    startTimer() {
      const startTime = Date.now();
      this.timerInterval = setInterval(() => {
        if (this.isSubmitted) return;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        this.simulatedTime = elapsed;
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        const timerEl = this.container.querySelector('#chalTimer');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 500);
    }

    runPhysicsLoop() {
      let lastTs = performance.now();
      let vortexAngle = 0;

      const loop = (ts) => {
        if (this.isSubmitted) return;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        // Kinetic dissolution calculation
        // Rate depends on stirring speed: 0 = slow (0.08/s), 1 = medium (0.35/s), 2 = fast (0.95/s)
        const rateConstants = [0.08, 0.35, 0.95];
        const k = rateConstants[this.stirringSpeed];
        const capacity = this.targetCapacity;

        if (this.dissolvedMass < capacity) {
          const step = (capacity - this.dissolvedMass) * k * dt;
          this.dissolvedMass = Math.min(capacity, this.dissolvedMass + step);
        } else if (this.dissolvedMass > capacity) {
          // If water was reduced below dissolved amount, excess precipitates back out
          this.dissolvedMass = Math.max(capacity, this.dissolvedMass - 15 * dt);
        }

        this.undissolvedMass = Math.max(0, this.saltMass - this.dissolvedMass);
        const satPercent = Math.min(100, Math.round((this.dissolvedMass / this.maxSoluble) * 100));

        // Update readouts
        const disEl = this.container.querySelector('#readoutDissolved');
        const sedEl = this.container.querySelector('#readoutSediment');
        const satEl = this.container.querySelector('#readoutSat');
        if (disEl) disEl.textContent = `${this.dissolvedMass.toFixed(1)} g`;
        if (sedEl) sedEl.textContent = `${this.undissolvedMass.toFixed(1)} g`;
        if (satEl) satEl.textContent = `${satPercent}%`;

        // Render Canvas
        if (this.stirringSpeed > 0) vortexAngle += dt * (this.stirringSpeed * 6);
        this.renderBeaker(vortexAngle);

        this.animFrame = requestAnimationFrame(loop);
      };

      this.animFrame = requestAnimationFrame(loop);
    }

    renderBeaker(vortexAngle) {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Beaker dimensions
      const bx = 90, by = 40, bw = 240, bh = 250;
      
      // Liquid height based on volume: 50 mL -> 40px, 250 mL -> 190px
      const liquidH = 40 + ((this.waterVolume - 50) / 200) * 150;
      const liquidY = by + bh - liquidH;

      // Draw Beaker Background Glass
      ctx.fillStyle = 'rgba(235, 245, 255, 0.35)';
      ctx.fillRect(bx, by, bw, bh);

      // Draw Liquid
      const satFraction = Math.min(1, this.dissolvedMass / this.maxSoluble);
      const waterGrad = ctx.createLinearGradient(bx, liquidY, bx, by + bh);
      waterGrad.addColorStop(0, `rgba(165, 225, 255, ${0.45 + satFraction * 0.15})`);
      waterGrad.addColorStop(1, `rgba(70, 160, 240, ${0.65 + satFraction * 0.20})`);
      ctx.fillStyle = waterGrad;
      ctx.fillRect(bx, liquidY, bw, liquidH);

      // Draw Stirring Vortex if active
      if (this.stirringSpeed > 0) {
        ctx.save();
        ctx.beginPath();
        const vortexDepth = this.stirringSpeed === 1 ? 18 : 36;
        ctx.moveTo(bx, liquidY);
        ctx.quadraticCurveTo(bx + bw / 2, liquidY + vortexDepth, bx + bw, liquidY);
        ctx.lineTo(bx + bw, by + bh);
        ctx.lineTo(bx, by + bh);
        ctx.closePath();
        ctx.fillStyle = `rgba(140, 210, 255, 0.5)`;
        ctx.fill();

        // Vortex spiral lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = bx + bw / 2;
        const cy = liquidY + vortexDepth / 2;
        ctx.arc(cx, cy, 25, vortexAngle, vortexAngle + Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Undissolved Sediment Layer at Bottom
      if (this.undissolvedMass > 0.5) {
        const sedimentHeight = Math.min(30, (this.undissolvedMass / 60) * 28 + 4);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(bx + 10, by + bh - sedimentHeight, bw - 20, sedimentHeight);
        
        // Crystalline speckles
        ctx.fillStyle = 'rgba(215, 235, 245, 0.8)';
        for (let i = 0; i < 20; i++) {
          const sx = bx + 15 + ((i * 37) % (bw - 30));
          const sy = by + bh - sedimentHeight + ((i * 13) % sedimentHeight);
          ctx.fillRect(sx, sy, 3, 3);
        }
      }

      // Draw Glass Walls & Graduation Marks
      ctx.strokeStyle = 'rgba(100, 140, 180, 0.8)';
      ctx.lineWidth = 4;
      ctx.strokeRect(bx, by, bw, bh);

      // Volume tick marks
      ctx.fillStyle = 'rgba(80, 110, 140, 0.7)';
      ctx.font = '10px Inter, sans-serif';
      for (let v = 50; v <= 250; v += 50) {
        const ty = by + bh - (40 + ((v - 50) / 200) * 150);
        ctx.fillRect(bx + 4, ty, 14, 2);
        ctx.fillText(`${v} mL`, bx + 22, ty + 3);
      }

      // Beaker Lip
      ctx.fillStyle = 'rgba(140, 180, 220, 0.9)';
      ctx.fillRect(bx - 10, by - 6, bw + 20, 8);
    }

    evaluateAndSubmit() {
      this.isSubmitted = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.animFrame) cancelAnimationFrame(this.animFrame);

      const targetVol = this.scenario.targetVol;
      const targetSalt = this.scenario.targetSalt;
      const mustDissolve = this.scenario.mustBeFullyDissolved;

      // Scoring Breakdown
      let accuracyScore = 0; // 0 to 40
      let goalScore = 0;     // 0 to 40
      let efficiencyScore = 0; // 0 to 20

      // 1. Water Volume Accuracy (Max 20 pts)
      const volDiff = Math.abs(this.waterVolume - targetVol);
      if (volDiff === 0) accuracyScore += 20;
      else if (volDiff <= 25) accuracyScore += 12;
      else if (volDiff <= 50) accuracyScore += 6;

      // 2. Salt Mass Accuracy (Max 20 pts)
      const saltDiff = Math.abs(this.saltMass - targetSalt);
      if (saltDiff === 0) accuracyScore += 20;
      else if (saltDiff <= 5) accuracyScore += 12;
      else if (saltDiff <= 10) accuracyScore += 6;

      // 3. Goal Achievement: Dissolution / Undissolved Sediment (Max 40 pts)
      const dissolvedPct = this.saltMass > 0 ? (this.dissolvedMass / this.saltMass) * 100 : 0;
      if (mustDissolve) {
        if (this.undissolvedMass <= 0.2 && dissolvedPct >= 99) {
          goalScore = 40;
        } else if (this.undissolvedMass <= 2.0) {
          goalScore = 25;
        } else {
          goalScore = 10;
        }
      } else {
        goalScore = 35;
      }

      // 4. Efficiency: Time and Stirring (Max 20 pts)
      if (this.simulatedTime <= this.scenario.maxAllowedTimeSec) efficiencyScore += 10;
      else efficiencyScore += 5;

      if (this.stirringSpeed > 0) efficiencyScore += 10; // Used active kinetics
      else efficiencyScore += 2;

      // Deduction for excessive hints
      const penalty = this.hintsUsed * 5;
      const finalScore = Math.max(0, Math.min(100, (accuracyScore + goalScore + efficiencyScore) - penalty));

      // Feedback Formulation
      let feedback = "";
      if (finalScore >= 85) {
        feedback = `Outstanding work! You accurately calculated ${this.waterVolume} mL of water and ${this.saltMass} g of salt, achieving 100% dissolution at equilibrium with no excess residue.`;
      } else if (finalScore >= 70) {
        feedback = `Good result! You reached ${dissolvedPct.toFixed(1)}% dissolution (${this.dissolvedMass.toFixed(1)} g dissolved). Fine-tune your volume and stirring speed to dissolve remaining traces faster.`;
      } else {
        feedback = `Mission incomplete: ${this.undissolvedMass.toFixed(1)} g of salt remained undissolved because the volume was below the saturation requirement (~36 g / 100 mL), or stirring was stopped too early.`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: finalScore,
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        hintsUsed: this.hintsUsed,
        parameters: {
          waterVolume: this.waterVolume,
          saltMass: this.saltMass,
          stirringSpeed: this.stirringSpeed,
          dissolvedMass: this.dissolvedMass,
          undissolvedMass: this.undissolvedMass
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
              <span>Parameter Adjustments</span>
              <strong>${res.actionsCount}</strong>
            </div>
            <div class="metric-box">
              <span>Dissolved Mass</span>
              <strong>${res.parameters.dissolvedMass.toFixed(1)} g</strong>
            </div>
            <div class="metric-box">
              <span>Undissolved Sediment</span>
              <strong>${res.parameters.undissolvedMass.toFixed(1)} g</strong>
            </div>
          </div>

          <div class="result-feedback-box">
            <p><strong>Scientific Analysis:</strong> ${res.feedback}</p>
          </div>

          <div class="results-actions">
            <button type="button" class="btn secondary" id="retryChallengeBtn"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg> <span>Try Another Challenge</span></button>
            <button type="button" class="btn primary pulse" id="returnToExpsBtn"><span>Return to Experiments</span> <svg class="inline-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
          </div>
        </div>
      `;

      this.container.querySelector('#retryChallengeBtn').onclick = () => {
        new DissolutionMissionSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new DissolutionMissionSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab01.js ---

// --- START challenge_case_lab02.js ---
/* ============================================================
   BALANCE Chemistry — Lab 02 Interactive Challenge Case
   "Unknown Sample Investigation" (Qualitative Cation Analysis)
   Procedural Scenarios, Reagent Addition Controls, Canvas Simulation,
   Precipitate & Complexation Reactions, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab02 = (function() {
  'use strict';

  // 10 Procedural Mission Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Industrial Effluent Screening",
      targetCation: "Cu2+",
      initialColor: "rgba(186, 230, 253, 0.35)",
      briefing: "A nearby textile facility discharged an unlabelled blue-tinted wastewater. Add dropwise sodium hydroxide and aqueous ammonia to observe precipitate formation and test for royal blue complexation in excess ammonia. Accurately identify the cation.",
      hint: "Copper(II) ions form a light blue precipitate with NaOH. In excess NH3, this precipitate dissolves to form an intense royal blue tetraammine complex [Cu(NH3)4(H2O)2]2+."
    },
    {
      id: "mission_02",
      title: "Groundwater Well Fe(II) Cation",
      targetCation: "Fe2+",
      initialColor: "rgba(220, 252, 231, 0.35)",
      briefing: "A deep borehole water sample has a faint green hue. Add 1.0 M NaOH dropwise. Look for a pale dirty-green precipitate that darkens upon air contact and does NOT dissolve in excess ammonia. Classify the oxidation state.",
      hint: "Iron(II) forms a dirty-green precipitate Fe(OH)2. The top surface slowly oxidizes in air to reddish-brown iron(III) hydroxide."
    },
    {
      id: "mission_03",
      title: "Acid Mine Drainage Rust Cation",
      targetCation: "Fe3+",
      initialColor: "rgba(254, 243, 199, 0.45)",
      briefing: "Drainage runoff from an abandoned quarry shows rusty sediments. Treat the sample with dropwise NaOH and aqueous NH3. Confirm whether a foxy reddish-brown precipitate forms immediately and is insoluble in excess.",
      hint: "Iron(III) forms an insoluble foxy reddish-brown gelatinous precipitate Fe(OH)3 with both NaOH and NH3."
    },
    {
      id: "mission_04",
      title: "Electroplating Bath Purity Check",
      targetCation: "Cu2+",
      initialColor: "rgba(186, 230, 253, 0.4)",
      briefing: "Verify whether the electroplating supply is genuine Copper(II) sulfate. Add excess aqueous ammonia to verify the definitive diagnostic deep blue coloration.",
      hint: "Only Cu2+ forms the distinctive deep royal blue solution when excess aqueous ammonia is added."
    },
    {
      id: "mission_05",
      title: "Borehole Aquifer Iron Speciation",
      targetCation: "Fe2+",
      initialColor: "rgba(220, 252, 231, 0.3)",
      briefing: "Distinguish whether this well water sample contains reduced Fe(II) or oxidized Fe(III). Execute the hydroxide precipitation test with minimal reagent waste.",
      hint: "Green precipitate indicates Fe2+; reddish-brown indicates Fe3+."
    },
    {
      id: "mission_06",
      title: "Excess Ammonia Complexation Protocol",
      targetCation: "Cu2+",
      initialColor: "rgba(186, 230, 253, 0.3)",
      briefing: "Execute a controlled two-step qualitative test: first add 2 drops of NH3 to precipitate Cu(OH)2, then add 12 drops excess NH3 to dissolve the precipitate into a deep royal blue solution.",
      hint: "Excess NH3 acts as a neutral ligand, displacing water molecules to form soluble [Cu(NH3)4(H2O)2]2+."
    },
    {
      id: "mission_07",
      title: "Surface Oxidation Observation",
      targetCation: "Fe2+",
      initialColor: "rgba(220, 252, 231, 0.4)",
      briefing: "Precipitate the green hydroxide Fe(OH)2 and observe the surface layer exposed to atmospheric oxygen. Confirm the cation based on the resulting color change.",
      hint: "4 Fe(OH)2 + O2 + 2 H2O -> 4 Fe(OH)3 converts green iron(II) hydroxide into rusty brown iron(III) hydroxide at the air-liquid boundary."
    },
    {
      id: "mission_08",
      title: "High Purity Rust Cation Verification",
      targetCation: "Fe3+",
      initialColor: "rgba(254, 240, 138, 0.4)",
      briefing: "A manufacturing QA team needs verification of ferric ion content in a pigment batch. Confirm Fe(III) by checking insolubility in both excess NaOH and excess NH3.",
      hint: "Unlike copper(II), iron(III) hydroxide cannot form a soluble ammine complex in excess ammonia."
    },
    {
      id: "mission_09",
      title: "Micro-Volume Diagnostic Run",
      targetCation: "Cu2+",
      initialColor: "rgba(186, 230, 253, 0.25)",
      briefing: "Identify the mystery cation in this micro-test tube using no more than two test reagent additions. Confirm the diagnosis accurately.",
      hint: "A single dropwise addition of NaOH followed by NH3 provides rapid diagnostic confirmation."
    },
    {
      id: "mission_10",
      title: "Forensic Cation Certification",
      targetCation: "Fe3+",
      initialColor: "rgba(254, 243, 199, 0.4)",
      briefing: "Final forensic certification: analyze the mystery unknown against Oxford MYP criteria. Record reagent observations and submit the definitive cation ID.",
      hint: "Check both precipitate color (red-brown) and solubility in excess."
    }
  ];

  class UnknownSampleSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;
      
      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB02_${attemptNumber}_${Date.now() % 10000}`;

      // Scientific State
      this.selectedReagent = 'NaOH'; // 'NaOH' or 'NH3'
      this.selectedDose = 2; // 2 drops (dropwise), 6 drops (standard), 15 drops (excess)
      this.totalNaOHAdded = 0;
      this.totalNH3Added = 0;
      this.precipitateAmount = 0.0; // 0.0 to 1.0
      this.precipitateDissolved = false; // true if Cu in excess NH3
      this.swirlIntensity = 0.0;
      this.airOxidationAmount = 0.0;
      this.userDiagnosis = "";

      // Telemetry
      this.simulatedTime = 0;
      this.timerInterval = null;
      this.animFrame = null;
      this.adjustmentsCount = 0;
      this.isSubmitted = false;

      // Particles for animated drops and precipitate
      this.droplets = [];
      this.pptFlakes = [];

      this.initUI();
      this.startTimer();
      this.startAnimationLoop();
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 02</span>
              <h2 class="mission-title">Qualitative Analysis: ${this.scenario.title}</h2>
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
            <!-- Left: Test Tube Canvas Simulation -->
            <div class="canvas-panel">
              <canvas id="testTubeCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Reagent Added</span>
                  <strong id="readoutReagents">0 drops</strong>
                </div>
                <div class="readout-item">
                  <span>Precipitate</span>
                  <strong id="readoutPpt">None</strong>
                </div>
                <div class="readout-item">
                  <span>Solution State</span>
                  <strong id="readoutState" style="color:#0284c7;">Aqueous Sample</strong>
                </div>
              </div>
            </div>

            <!-- Right: Analytical Controls & Diagnosis -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M2 12h20"/></svg> Choose Analytical Reagent</label>
                  <span class="control-val" id="reagentVal">1.0 M NaOH</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" id="btnNaOH">NaOH (1.0 M)</button>
                  <button type="button" class="stir-btn" id="btnNH3">NH3 (1.0 M)</button>
                </div>
                <small class="control-note">NaOH tests hydroxide insolubility; NH3 tests for ammine complex formation.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> Addition Dose</label>
                  <span class="control-val" id="doseVal">Dropwise (2 drops)</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" data-dose="2">Dropwise (2)</button>
                  <button type="button" class="stir-btn" data-dose="6">Standard (6)</button>
                  <button type="button" class="stir-btn" data-dose="15">Excess (15)</button>
                </div>
                <div style="margin-top:10px; display:flex; gap:8px;">
                  <button type="button" class="btn primary" id="btnAddReagent" style="flex:1;">
                    <svg class="inline-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Dispense Reagent</span>
                  </button>
                  <button type="button" class="btn secondary" id="btnSwirl" style="flex:1;">
                    <svg class="inline-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                    <span>Swirl Tube</span>
                  </button>
                </div>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg> Cation Identification Verdict</label>
                </div>
                <select id="diagnosisSelect" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; font-weight:700; color:#0f172a; margin-top:4px;">
                  <option value="">-- Select Confirmed Cation --</option>
                  <option value="Cu2+">Copper(II) Ion — Cu2+</option>
                  <option value="Fe2+">Iron(II) Ion — Fe2+</option>
                  <option value="Fe3+">Iron(III) Ion — Fe3+</option>
                </select>
                <small class="control-note">Examine precipitate color, insolubility in NaOH, and ammine complex formation in excess NH3.</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Scientific Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Submit Diagnostic Report</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const btnNaOH = this.container.querySelector('#btnNaOH');
      const btnNH3 = this.container.querySelector('#btnNH3');
      const reagentVal = this.container.querySelector('#reagentVal');

      btnNaOH.onclick = () => {
        this.selectedReagent = 'NaOH';
        btnNaOH.classList.add('active');
        btnNH3.classList.remove('active');
        reagentVal.textContent = '1.0 M NaOH';
        this.adjustmentsCount++;
      };

      btnNH3.onclick = () => {
        this.selectedReagent = 'NH3';
        btnNH3.classList.add('active');
        btnNaOH.classList.remove('active');
        reagentVal.textContent = '1.0 M NH3';
        this.adjustmentsCount++;
      };

      const doseBtns = this.container.querySelectorAll('[data-dose]');
      const doseVal = this.container.querySelector('#doseVal');
      doseBtns.forEach(b => {
        b.onclick = () => {
          doseBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.selectedDose = parseInt(b.dataset.dose, 10);
          doseVal.textContent = this.selectedDose === 2 ? 'Dropwise (2 drops)' : (this.selectedDose === 6 ? 'Standard (6 drops)' : 'Excess (15 drops)');
          this.adjustmentsCount++;
        };
      });

      this.container.querySelector('#btnAddReagent').onclick = () => this.dispenseReagent();
      this.container.querySelector('#btnSwirl').onclick = () => this.swirlTube();

      this.container.querySelector('#hintBtn').onclick = () => {
        const box = this.container.querySelector('#chalHintBox');
        box.textContent = this.scenario.hint;
        box.classList.remove('hidden');
        this.adjustmentsCount++;
      };

      this.container.querySelector('#diagnosisSelect').onchange = (e) => {
        this.userDiagnosis = e.target.value;
        this.adjustmentsCount++;
      };

      this.container.querySelector('#submitChallengeBtn').onclick = () => this.submitMission();
    }

    dispenseReagent() {
      const drops = this.selectedDose;
      if (this.selectedReagent === 'NaOH') {
        this.totalNaOHAdded += drops;
      } else {
        this.totalNH3Added += drops;
      }
      this.adjustmentsCount++;

      // Create falling droplet animations
      for (let i = 0; i < Math.min(drops, 5); i++) {
        this.droplets.push({
          x: 210 + (Math.random() * 12 - 6),
          y: 45 + i * 8,
          vy: 3 + Math.random() * 2,
          color: this.selectedReagent === 'NaOH' ? 'rgba(224, 242, 254, 0.9)' : 'rgba(240, 249, 255, 0.9)'
        });
      }

      this.evaluateReactionPhysics();
    }

    swirlTube() {
      this.swirlIntensity = 1.0;
      this.adjustmentsCount++;
      if (this.scenario.targetCation === 'Fe2+' && this.precipitateAmount > 0.2) {
        this.airOxidationAmount = Math.min(1.0, this.airOxidationAmount + 0.35);
      }
      this.evaluateReactionPhysics();
    }

    evaluateReactionPhysics() {
      const totalReagent = this.totalNaOHAdded + this.totalNH3Added;
      const target = this.scenario.targetCation;

      if (target === 'Cu2+') {
        if (this.totalNH3Added >= 10) {
          // Excess NH3 dissolves Cu(OH)2 into deep royal blue ammine complex!
          this.precipitateAmount = Math.max(0, 0.8 - (this.totalNH3Added - 8) * 0.12);
          this.precipitateDissolved = true;
        } else if (totalReagent > 0) {
          this.precipitateAmount = Math.min(1.0, totalReagent * 0.15);
          this.precipitateDissolved = false;
        }
      } else if (target === 'Fe2+') {
        if (totalReagent > 0) {
          this.precipitateAmount = Math.min(1.0, totalReagent * 0.16);
          // Insoluble in excess
        }
      } else if (target === 'Fe3+') {
        if (totalReagent > 0) {
          this.precipitateAmount = Math.min(1.0, totalReagent * 0.18);
          // Insoluble in excess
        }
      }

      this.updateReadouts();
    }

    updateReadouts() {
      const rReagents = this.container.querySelector('#readoutReagents');
      const rPpt = this.container.querySelector('#readoutPpt');
      const rState = this.container.querySelector('#readoutState');

      const totalDrops = this.totalNaOHAdded + this.totalNH3Added;
      rReagents.textContent = `${totalDrops} drops (${this.totalNaOHAdded} NaOH, ${this.totalNH3Added} NH3)`;

      const target = this.scenario.targetCation;
      if (this.precipitateDissolved && this.totalNH3Added >= 10 && target === 'Cu2+') {
        rPpt.textContent = "Dissolved in excess";
        rPpt.style.color = "#1e3a8a";
        rState.textContent = "Deep Royal Blue Solution";
        rState.style.color = "#1d4ed8";
      } else if (this.precipitateAmount > 0.05) {
        if (target === 'Cu2+') {
          rPpt.textContent = "Light Blue Ppt";
          rPpt.style.color = "#0284c7";
          rState.textContent = "Cu(OH)2(s) Suspension";
        } else if (target === 'Fe2+') {
          rPpt.textContent = this.airOxidationAmount > 0.3 ? "Green Ppt (Browning)" : "Pale Dirty-Green Ppt";
          rPpt.style.color = "#65a30d";
          rState.textContent = "Fe(OH)2(s) + Fe(OH)3 Surface";
        } else if (target === 'Fe3+') {
          rPpt.textContent = "Reddish-Brown Ppt";
          rPpt.style.color = "#b91c1c";
          rState.textContent = "Fe(OH)3(s) Insoluble";
        }
      } else {
        rPpt.textContent = "None";
        rPpt.style.color = "#64748b";
        rState.textContent = "Aqueous Sample";
        rState.style.color = "#0284c7";
      }
    }

    startTimer() {
      const timerEl = this.container.querySelector('#chalTimer');
      this.timerInterval = setInterval(() => {
        this.simulatedTime++;
        const mins = String(Math.floor(this.simulatedTime / 60)).padStart(2, '0');
        const secs = String(this.simulatedTime % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;

        // Slow atmospheric oxidation of Fe2+ if precipitate present
        if (this.scenario.targetCation === 'Fe2+' && this.precipitateAmount > 0.2) {
          this.airOxidationAmount = Math.min(1.0, this.airOxidationAmount + 0.015);
        }
      }, 1000);
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#testTubeCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawScene(ctx, canvas.width, canvas.height);
        if (!this.isSubmitted) {
          this.animFrame = requestAnimationFrame(render);
        }
      };
      this.animFrame = requestAnimationFrame(render);
    }

    drawScene(ctx, width, height) {
      // Background lab bench subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Wooden rack holder
      ctx.fillStyle = '#b45309';
      ctx.fillRect(150, 290, 120, 14);
      ctx.fillRect(160, 304, 15, 26);
      ctx.fillRect(245, 304, 15, 26);

      // Test Tube Geometry
      const tubeX = 185;
      const tubeY = 70;
      const tubeW = 50;
      const tubeH = 220;
      const r = tubeW / 2;

      // Draw Solution Liquid Inside Tube
      const liquidTop = tubeY + 80;
      const liquidH = tubeH - 80;

      ctx.save();
      // Clip inside test tube
      ctx.beginPath();
      ctx.moveTo(tubeX, tubeY);
      ctx.lineTo(tubeX, tubeY + tubeH - r);
      ctx.arc(tubeX + r, tubeY + tubeH - r, r, Math.PI, 0, true);
      ctx.lineTo(tubeX + tubeW, tubeY);
      ctx.closePath();
      ctx.clip();

      // Liquid base color
      let liquidColor = this.scenario.initialColor;
      const target = this.scenario.targetCation;

      if (this.precipitateDissolved && this.totalNH3Added >= 10 && target === 'Cu2+') {
        liquidColor = 'rgba(29, 78, 216, 0.92)'; // Deep royal blue ammine complex!
      } else if (this.precipitateAmount > 0.05) {
        if (target === 'Cu2+') {
          liquidColor = 'rgba(186, 230, 253, 0.7)';
        } else if (target === 'Fe2+') {
          liquidColor = 'rgba(209, 250, 229, 0.7)';
        } else if (target === 'Fe3+') {
          liquidColor = 'rgba(254, 215, 170, 0.7)';
        }
      }

      ctx.fillStyle = liquidColor;
      ctx.fillRect(tubeX, liquidTop, tubeW, liquidH);

      // Draw Precipitate Layer / Flakes
      if (this.precipitateAmount > 0.05 && !this.precipitateDissolved) {
        const pptHeight = liquidH * this.precipitateAmount * 0.45;
        const pptY = tubeY + tubeH - pptHeight;

        let pptColor = '#38bdf8'; // Cu(OH)2 light blue
        if (target === 'Fe2+') pptColor = '#65a30d'; // Fe(OH)2 green
        if (target === 'Fe3+') pptColor = '#b91c1c'; // Fe(OH)3 reddish brown

        ctx.fillStyle = pptColor;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(tubeX, pptY, tubeW, pptHeight);

        // Aerial oxidation meniscus for Fe2+
        if (target === 'Fe2+' && this.airOxidationAmount > 0.05) {
          ctx.fillStyle = '#9a3412'; // rusty brown Fe(OH)3
          ctx.globalAlpha = Math.min(1.0, this.airOxidationAmount * 0.9);
          ctx.fillRect(tubeX, liquidTop, tubeW, 12);
        }
        ctx.globalAlpha = 1.0;
      }

      // Swirl visual effect
      if (this.swirlIntensity > 0.02) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(tubeX + r, liquidTop + 40, r * 0.6 * this.swirlIntensity, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        this.swirlIntensity *= 0.95;
      }

      ctx.restore();

      // Draw Glass Test Tube Outlines & Highlights
      ctx.beginPath();
      ctx.moveTo(tubeX, tubeY);
      ctx.lineTo(tubeX, tubeY + tubeH - r);
      ctx.arc(tubeX + r, tubeY + tubeH - r, r, Math.PI, 0, true);
      ctx.lineTo(tubeX + tubeW, tubeY);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();

      // Glass lip rim
      ctx.beginPath();
      ctx.ellipse(tubeX + r, tubeY, r + 4, 4, 0, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      // Glass shine highlight
      ctx.beginPath();
      ctx.moveTo(tubeX + 6, tubeY + 20);
      ctx.lineTo(tubeX + 6, tubeY + tubeH - 25);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.stroke();

      // Draw Pipette Dropper above Tube
      ctx.fillStyle = '#64748b';
      ctx.fillRect(tubeX + r - 3, 20, 6, 25);
      ctx.beginPath();
      ctx.moveTo(tubeX + r - 3, 45);
      ctx.lineTo(tubeX + r, 52);
      ctx.lineTo(tubeX + r + 3, 45);
      ctx.closePath();
      ctx.fill();

      // Droplets physics
      for (let i = this.droplets.length - 1; i >= 0; i--) {
        const d = this.droplets[i];
        d.y += d.vy;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (d.y >= liquidTop) {
          this.droplets.splice(i, 1);
        }
      }
    }

    submitMission() {
      if (!this.userDiagnosis) {
        alert("Please select your confirmed Cation Identification Verdict before submitting.");
        return;
      }

      this.isSubmitted = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.animFrame) cancelAnimationFrame(this.animFrame);

      const target = this.scenario.targetCation;
      const isCorrect = this.userDiagnosis === target;
      const totalDrops = this.totalNaOHAdded + this.totalNH3Added;

      // Scoring Breakdown
      let accuracyScore = isCorrect ? 60 : 15;
      let proceduralScore = 0;

      if (target === 'Cu2+') {
        if (this.totalNH3Added >= 10 && this.precipitateDissolved) proceduralScore += 25; // tested ammine complex
        else if (this.totalNaOHAdded > 0) proceduralScore += 15;
      } else if (target === 'Fe2+') {
        if (this.airOxidationAmount > 0.1 || this.swirlIntensity > 0) proceduralScore += 25; // checked surface browning
        else proceduralScore += 15;
      } else if (target === 'Fe3+') {
        if (totalDrops >= 4) proceduralScore += 25; // verified red-brown insoluble ppt
      }

      // Efficiency bonus: 15 points if executed with fewer than 30 total drops and < 90 seconds
      let efficiencyScore = 0;
      if (totalDrops <= 25 && this.simulatedTime <= 90) efficiencyScore = 15;
      else if (totalDrops <= 40) efficiencyScore = 10;
      else efficiencyScore = 5;

      const totalScore = Math.min(100, accuracyScore + proceduralScore + efficiencyScore);

      let feedback = "";
      if (isCorrect) {
        feedback = `Outstanding qualitative investigation! You correctly diagnosed ${target}. `;
        if (target === 'Cu2+') {
          feedback += `You confirmed the light blue Cu(OH)2 precipitate and its characteristic ammine complex [Cu(NH3)4(H2O)2]2+ which dissolves to give an intense royal blue solution in excess ammonia.`;
        } else if (target === 'Fe2+') {
          feedback += `You correctly verified the dirty-green Fe(OH)2 precipitate and noted its surface oxidation to reddish-brown iron(III) hydroxide upon atmospheric contact.`;
        } else {
          feedback += `You correctly confirmed the characteristic insoluble foxy reddish-brown Fe(OH)3 precipitate with both sodium hydroxide and ammonia.`;
        }
      } else {
        feedback = `Diagnostic discrepancy: Your verdict was ${this.userDiagnosis}, but the authentic unknown sample contained ${target}. Re-examine the reaction matrix: Cu2+ forms light blue ppt dissolving in excess NH3 to royal blue; Fe2+ forms dirty-green ppt browning on top; Fe3+ forms reddish-brown ppt insoluble in excess.`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: totalScore,
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          targetCation: target,
          userDiagnosis: this.userDiagnosis,
          totalNaOHAdded: this.totalNaOHAdded,
          totalNH3Added: this.totalNH3Added,
          precipitateDissolved: this.precipitateDissolved
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
              <span>Analytical Actions</span>
              <strong>${res.actionsCount}</strong>
            </div>
            <div class="metric-box">
              <span>Target Cation</span>
              <strong>${res.parameters.targetCation}</strong>
            </div>
            <div class="metric-box">
              <span>Your Verdict</span>
              <strong style="color:${res.parameters.userDiagnosis === res.parameters.targetCation ? '#16a34a' : '#dc2626'};">${res.parameters.userDiagnosis}</strong>
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
        new UnknownSampleSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new UnknownSampleSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab02.js ---

// --- START challenge_case_lab03.js ---
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

// --- END challenge_case_lab03.js ---

// --- START challenge_case_lab04.js ---
/* ============================================================
   BALANCE Chemistry — Lab 04 Interactive Challenge Case
   "Fertilizer Production Mission" (Neutralization Titration & Crystallization)
   Burette Flow Dynamics, pH Indicator Swirl, Evaporation Mantle,
   Live Meniscus Canvas, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab04 = (function() {
  'use strict';

  // 10 Procedural Production Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Neutral Ammonium Nitrate Batch",
      briefing: "Synthesize agricultural ammonium nitrate: NH3(aq) + HNO3(aq) -> NH4NO3(aq). Titrate exactly 25.0 mL of 1.0 M nitric acid with aqueous ammonia to achieve neutral equivalence pH 7.00 (±0.30), then evaporate to harvest pure crystals.",
      targetAcidVol: 25.0,
      equivalenceAmmoniaVol: 25.0,
      targetSaltName: "NH4NO3",
      hint: "Equimolar 1:1 reaction requires exactly 25.0 mL of 1.0 M ammonia. Watch the indicator turn neutral."
    },
    {
      id: "mission_02",
      title: "High-Purity Ammonium Sulfate Standard",
      briefing: "Produce ammonium sulfate fertilizer: 2 NH3 + H2SO4 -> (NH4)2SO4. Carefully deliver 30.0 mL of ammonia to neutralize 15.0 mL of 1.0 M sulfuric acid, achieving the exact neutralization end-point.",
      targetAcidVol: 15.0,
      equivalenceAmmoniaVol: 30.0,
      targetSaltName: "(NH4)2SO4",
      hint: "Sulfuric acid is diprotic; 15.0 mL of 1.0 M H2SO4 requires 30.0 mL of 1.0 M ammonia for complete neutralization."
    },
    {
      id: "mission_03",
      title: "Rapid Micro-Titration Run",
      briefing: "Execute a rapid diagnostic titration using Methyl Orange indicator. Stop burette delivery precisely when the indicator transitions from red to yellow-orange (pH 4.4 to 6.2).",
      targetAcidVol: 20.0,
      equivalenceAmmoniaVol: 20.0,
      targetSaltName: "NH4NO3",
      hint: "Slow your flow to dropwise as you approach 19 mL to avoid over-titrating."
    },
    {
      id: "mission_04",
      title: "Phenolphthalein Calibration Standard",
      briefing: "Standardize an ammonia solution using phenolphthalein. Titrate until the very first persistent faint pale pink tinge indicates complete acid consumption.",
      targetAcidVol: 25.0,
      equivalenceAmmoniaVol: 25.0,
      targetSaltName: "NH4NO3",
      hint: "Phenolphthalein is colorless in acid and turns pale pink at pH 8.2."
    },
    {
      id: "mission_05",
      title: "Maximum Evaporation Yield Mission",
      briefing: "Neutralize 25.0 mL of acid and engage the evaporation mantle. Evaporate >80% of water without charring the salt to obtain maximum dry crystal yield.",
      targetAcidVol: 25.0,
      equivalenceAmmoniaVol: 25.0,
      targetSaltName: "NH4NO3",
      hint: "Switch heater to moderate heat once crystal slurry begins forming."
    },
    {
      id: "mission_06",
      title: "Acid Economy Batch (Zero Waste)",
      briefing: "A production constraint requires zero excess acid or ammonia. Reach within ±0.2 mL of the 22.5 mL stoichiometric equivalence point.",
      targetAcidVol: 22.5,
      equivalenceAmmoniaVol: 22.5,
      targetSaltName: "NH4NO3",
      hint: "Use dropwise additions for the final 1.0 mL."
    },
    {
      id: "mission_07",
      title: "Universal Indicator Spectrum Test",
      briefing: "Monitor the continuous pH transition using Universal Indicator: Red (pH 1-3) -> Orange (pH 4-5) -> Green (pH 7-8 neutral). Target the vibrant green neutral window.",
      targetAcidVol: 25.0,
      equivalenceAmmoniaVol: 25.0,
      targetSaltName: "NH4NO3",
      hint: "Green denotes pH 7.0; stop immediately when green appears."
    },
    {
      id: "mission_08",
      title: "Ammonium Phosphate Fertilizer",
      briefing: "Prepare ammonium phosphate standard. Add exactly 30.0 mL of ammonia to complete the tri-basic stoichiometric neutralization.",
      targetAcidVol: 10.0,
      equivalenceAmmoniaVol: 30.0,
      targetSaltName: "(NH4)3PO4",
      hint: "Tri-basic neutralization requires 3 moles of ammonia per mole of phosphoric acid."
    },
    {
      id: "mission_09",
      title: "Low-Temperature Crystallization",
      briefing: "Prevent thermal decomposition of ammonium nitrate by evaporating at moderate temperature (60 °C) rather than vigorous boiling.",
      targetAcidVol: 25.0,
      equivalenceAmmoniaVol: 25.0,
      targetSaltName: "NH4NO3",
      hint: "NH4NO3 decomposes above 200 °C; gentle evaporation gives pure white needle crystals."
    },
    {
      id: "mission_10",
      title: "Forensic Industrial Certification",
      briefing: "Final QA certification: execute the entire fertilizer synthesis cycle: titration, end-point detection, and evaporative crystallization with >90% purity.",
      targetAcidVol: 25.0,
      equivalenceAmmoniaVol: 25.0,
      targetSaltName: "NH4NO3",
      hint: "Check both stoichiometric neutralization and dry crystalline harvest."
    }
  ];

  class FertilizerProductionSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB04_${attemptNumber}_${Date.now() % 10000}`;

      // Physical state
      this.buretteDelivered = 0.0; // mL
      this.flowRate = 0.0; // 0 = closed, 0.2 = dropwise, 1.0 = stream
      this.selectedIndicator = 'Universal'; // 'Universal', 'MethylOrange', 'Phenolphthalein'
      this.heatingMantle = 0; // 0 = off, 1 = 60C, 2 = 100C
      this.waterEvaporated = 0.0; // mL
      this.currentPH = 1.2;
      this.crystalYieldGrams = 0.0;

      this.simulatedTime = 0;
      this.timerInterval = null;
      this.animFrame = null;
      this.adjustmentsCount = 0;
      this.isSubmitted = false;

      this.drops = [];

      this.initUI();
      this.startTimer();
      this.startAnimationLoop();
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 04</span>
              <h2 class="mission-title">Fertilizer Mission: ${this.scenario.title}</h2>
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
            <!-- Left: Titration & Crystallization Canvas -->
            <div class="canvas-panel">
              <canvas id="titrationCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Delivered NH3</span>
                  <strong id="readoutBurette">0.0 mL</strong>
                </div>
                <div class="readout-item">
                  <span>Solution pH</span>
                  <strong id="readoutPH" style="color:#dc2626;">1.20</strong>
                </div>
                <div class="readout-item">
                  <span>Evaporated</span>
                  <strong id="readoutEvap">0.0 mL</strong>
                </div>
                <div class="readout-item">
                  <span>Harvested Salt</span>
                  <strong id="readoutCrystals" style="color:#0284c7;">0.0 g</strong>
                </div>
              </div>
            </div>

            <!-- Right: Burette & Evaporation Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> Burette Ammonia Flow Control</label>
                  <span class="control-val" id="flowVal">Stopcock Closed</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" data-flow="0">Closed</button>
                  <button type="button" class="stir-btn" data-flow="0.2">Dropwise (0.2 mL/s)</button>
                  <button type="button" class="stir-btn" data-flow="1.0">Stream (1.0 mL/s)</button>
                </div>
                <small class="control-note">Target equivalence is ~${this.scenario.equivalenceAmmoniaVol} mL of 1.0 M NH3.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> Chemical Indicator</label>
                  <span class="control-val" id="indicatorVal">Universal Indicator</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" data-ind="Universal">Universal</button>
                  <button type="button" class="stir-btn" data-ind="MethylOrange">Methyl Orange</button>
                  <button type="button" class="stir-btn" data-ind="Phenolphthalein">Phenolphthalein</button>
                </div>
                <small class="control-note">Universal: Red->Green->Blue; Methyl Orange: Red->Yellow; Phenolphthalein: Colorless->Pink.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M2 12h20"/></svg> Evaporation Heating Mantle</label>
                  <span class="control-val" id="mantleVal">Off</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" data-mantle="0">Off (20 °C)</button>
                  <button type="button" class="stir-btn" data-mantle="1">Warm (60 °C)</button>
                  <button type="button" class="stir-btn" data-mantle="2">Boil (100 °C)</button>
                </div>
                <small class="control-note">Evaporate water to induce supersaturation and crystallize pure fertilizer salt.</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Scientific Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Harvest &amp; Submit Batch</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const flowBtns = this.container.querySelectorAll('[data-flow]');
      const flowVal = this.container.querySelector('#flowVal');
      flowBtns.forEach(b => {
        b.onclick = () => {
          flowBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.flowRate = parseFloat(b.dataset.flow);
          flowVal.textContent = this.flowRate === 0 ? 'Stopcock Closed' : (this.flowRate < 0.5 ? 'Dropwise Flow' : 'Stream Flow');
          this.adjustmentsCount++;
        };
      });

      const indBtns = this.container.querySelectorAll('[data-ind]');
      const indVal = this.container.querySelector('#indicatorVal');
      indBtns.forEach(b => {
        b.onclick = () => {
          indBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.selectedIndicator = b.dataset.ind;
          indVal.textContent = b.textContent;
          this.adjustmentsCount++;
        };
      });

      const mantleBtns = this.container.querySelectorAll('[data-mantle]');
      const mantleVal = this.container.querySelector('#mantleVal');
      mantleBtns.forEach(b => {
        b.onclick = () => {
          mantleBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.heatingMantle = parseInt(b.dataset.mantle, 10);
          mantleVal.textContent = this.heatingMantle === 0 ? 'Off (20 °C)' : (this.heatingMantle === 1 ? 'Warm (60 °C)' : 'Boil (100 °C)');
          this.adjustmentsCount++;
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

    startTimer() {
      const timerEl = this.container.querySelector('#chalTimer');
      this.timerInterval = setInterval(() => {
        this.simulatedTime++;
        const mins = String(Math.floor(this.simulatedTime / 60)).padStart(2, '0');
        const secs = String(this.simulatedTime % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;

        // Titration fluid delivery
        if (this.flowRate > 0 && this.buretteDelivered < 50.0) {
          this.buretteDelivered = Math.min(50.0, this.buretteDelivered + this.flowRate);
          this.updatePhysicalChemistry();
        }

        // Evaporation physics
        if (this.heatingMantle > 0) {
          const evapRate = this.heatingMantle === 1 ? 0.3 : 0.8;
          const maxEvap = this.scenario.targetAcidVol + this.buretteDelivered - 5.0;
          if (this.waterEvaporated < maxEvap) {
            this.waterEvaporated = Math.min(maxEvap, this.waterEvaporated + evapRate);
          }

          // Calculate crystallized salt mass (g)
          const neutralizedRatio = Math.min(1.0, this.buretteDelivered / this.scenario.equivalenceAmmoniaVol);
          const theoreticalYield = (this.scenario.targetAcidVol * 0.08); // ~2.0 g to 3.0 g
          const concFactor = Math.min(1.0, this.waterEvaporated / (this.scenario.targetAcidVol * 0.7));
          this.crystalYieldGrams = neutralizedRatio * theoreticalYield * concFactor;
        }

        this.updateReadouts();
      }, 1000);
    }

    updatePhysicalChemistry() {
      const eqVol = this.scenario.equivalenceAmmoniaVol;
      const v = this.buretteDelivered;

      if (v < eqVol * 0.9) {
        // Acidic buffer region
        this.currentPH = 1.2 + (v / eqVol) * 2.2;
      } else if (v < eqVol * 1.1) {
        // Sharp equivalence steep transition
        const progress = (v - eqVol * 0.9) / (eqVol * 0.2);
        this.currentPH = 3.4 + progress * 5.6; // reaches ~9.0
      } else {
        // Alkaline plateau (weak base buffer)
        this.currentPH = Math.min(11.5, 9.0 + (v - eqVol * 1.1) * 0.15);
      }
    }

    getFlaskFluidColor() {
      const ph = this.currentPH;
      if (this.selectedIndicator === 'Universal') {
        if (ph < 3.0) return '#ef4444'; // Red
        if (ph < 5.0) return '#f97316'; // Orange
        if (ph < 6.5) return '#eab308'; // Yellow
        if (ph < 8.0) return '#22c55e'; // Green (Neutral!)
        if (ph < 9.5) return '#06b6d4'; // Cyan
        return '#3b82f6'; // Blue
      } else if (this.selectedIndicator === 'MethylOrange') {
        if (ph < 3.1) return '#dc2626'; // Red
        if (ph < 4.4) return '#ea580c'; // Orange
        return '#facc15'; // Yellow
      } else {
        // Phenolphthalein
        if (ph < 8.2) return 'rgba(255, 255, 255, 0.2)'; // Colorless
        const alpha = Math.min(0.85, (ph - 8.2) * 0.4);
        return `rgba(244, 114, 182, ${alpha})`; // Pink
      }
    }

    updateReadouts() {
      const rBurette = this.container.querySelector('#readoutBurette');
      const rPH = this.container.querySelector('#readoutPH');
      const rEvap = this.container.querySelector('#readoutEvap');
      const rCryst = this.container.querySelector('#readoutCrystals');

      if (rBurette) rBurette.textContent = `${this.buretteDelivered.toFixed(1)} mL`;
      if (rPH) {
        rPH.textContent = this.currentPH.toFixed(2);
        if (this.currentPH >= 6.5 && this.currentPH <= 7.5) {
          rPH.style.color = '#16a34a';
        } else if (this.currentPH < 6.5) {
          rPH.style.color = '#dc2626';
        } else {
          rPH.style.color = '#2563eb';
        }
      }
      if (rEvap) rEvap.textContent = `${this.waterEvaporated.toFixed(1)} mL`;
      if (rCryst) rCryst.textContent = `${this.crystalYieldGrams.toFixed(2)} g`;
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#titrationCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lab bench gradient
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Retort Stand & Burette
        ctx.fillStyle = '#475569';
        ctx.fillRect(60, 20, 10, 300); // Stand rod
        ctx.fillRect(30, 310, 100, 16); // Stand base
        ctx.fillRect(70, 70, 70, 8); // Clamp arm

        // Burette Tube
        const bx = 135;
        const by = 25;
        const bw = 18;
        const bh = 150;

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Burette liquid column
        const maxBuretteVol = 50.0;
        const liquidFraction = Math.max(0, (maxBuretteVol - this.buretteDelivered) / maxBuretteVol);
        const bLiquidH = bh * liquidFraction;
        const bLiquidY = by + (bh - bLiquidH);

        ctx.fillStyle = 'rgba(224, 242, 254, 0.8)';
        ctx.fillRect(bx + 1, bLiquidY, bw - 2, bLiquidH);

        // Burette tip
        ctx.beginPath();
        ctx.moveTo(bx + 4, by + bh);
        ctx.lineTo(bx + 8, by + bh + 25);
        ctx.lineTo(bx + 10, by + bh + 25);
        ctx.lineTo(bx + 14, by + bh);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();

        // Burette stopcock valve
        ctx.fillStyle = this.flowRate > 0 ? '#16a34a' : '#dc2626';
        ctx.fillRect(bx + 3, by + bh + 8, 12, 6);

        // Droplets animation
        if (this.flowRate > 0 && Math.random() < (this.flowRate > 0.5 ? 0.7 : 0.25)) {
          this.drops.push({
            x: bx + 9,
            y: by + bh + 26,
            vy: 3 + Math.random() * 2
          });
        }

        ctx.fillStyle = 'rgba(186, 230, 253, 0.9)';
        for (let i = this.drops.length - 1; i >= 0; i--) {
          const d = this.drops[i];
          d.y += d.vy;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          if (d.y >= 235) {
            this.drops.splice(i, 1);
          }
        }

        // Conical Flask below Burette
        const fx = 144;
        const fy = 215;

        // Flask glass geometry
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fx - 12, fy);
        ctx.lineTo(fx + 12, fy);
        ctx.lineTo(fx + 10, fy + 20);
        ctx.lineTo(fx + 45, fy + 80);
        ctx.arc(fx, fy + 80, 45, 0, Math.PI, false);
        ctx.lineTo(fx - 10, fy + 20);
        ctx.closePath();
        ctx.clip();

        // Liquid inside flask
        const flaskColor = this.getFlaskFluidColor();
        ctx.fillStyle = flaskColor;
        ctx.fillRect(fx - 55, fy + 40, 110, 50);

        // Crystals floating/settling if produced
        if (this.crystalYieldGrams > 0.1) {
          ctx.fillStyle = '#ffffff';
          for (let c = 0; c < Math.min(30, Math.floor(this.crystalYieldGrams * 12)); c++) {
            const cx = fx - 35 + ((c * 17) % 70);
            const cy = fy + 70 + ((c * 7) % 15);
            ctx.fillRect(cx, cy, 4, 1.5);
          }
        }

        ctx.restore();

        // Flask outline
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fx - 12, fy);
        ctx.lineTo(fx + 12, fy);
        ctx.lineTo(fx + 10, fy + 20);
        ctx.lineTo(fx + 45, fy + 80);
        ctx.arc(fx, fy + 80, 45, 0, Math.PI, false);
        ctx.lineTo(fx - 10, fy + 20);
        ctx.closePath();
        ctx.stroke();

        // Evaporating Basin / Heating Mantle (Right side)
        const mx = 320;
        const my = 250;

        // Heating mantle base
        ctx.fillStyle = this.heatingMantle > 0 ? (this.heatingMantle === 2 ? '#ea580c' : '#f59e0b') : '#64748b';
        ctx.beginPath();
        ctx.arc(mx, my + 30, 40, Math.PI, 0, false);
        ctx.fill();

        // Porcelain evaporating dish
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my + 15, 36, 0, Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Needle crystals inside dish
        if (this.crystalYieldGrams > 0.05) {
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          for (let k = 0; k < Math.min(25, Math.floor(this.crystalYieldGrams * 15)); k++) {
            const kx = mx - 25 + ((k * 13) % 50);
            const ky = my + 20 + ((k * 5) % 15);
            ctx.beginPath();
            ctx.moveTo(kx, ky);
            ctx.lineTo(kx + 6, ky + 2);
            ctx.stroke();
          }
        }

        // Steam vapor if heating
        if (this.heatingMantle > 0 && Math.random() < 0.3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(mx + (Math.random() * 20 - 10), my - 10 - Math.random() * 20, 5 + Math.random() * 5, 0, Math.PI * 2);
          ctx.fill();
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

      const eqVol = this.scenario.equivalenceAmmoniaVol;
      const volDiff = Math.abs(this.buretteDelivered - eqVol);
      const isNeutral = this.currentPH >= 6.0 && this.currentPH <= 8.0;

      // Scoring
      let titrationScore = Math.max(0, 50 - volDiff * 8);
      let phScore = isNeutral ? 30 : Math.max(5, 30 - Math.abs(this.currentPH - 7.0) * 8);
      let crystallizationScore = Math.min(20, this.crystalYieldGrams * 10);

      const totalScore = Math.min(100, Math.round(titrationScore + phScore + crystallizationScore));

      let feedback = "";
      if (totalScore >= 75) {
        feedback = `Exceptional fertilizer synthesis! You delivered ${this.buretteDelivered.toFixed(1)} mL NH3 (target: ${eqVol.toFixed(1)} mL), achieving equivalence pH ${this.currentPH.toFixed(2)} and harvesting ${this.crystalYieldGrams.toFixed(2)} g of pure crystalline ${this.scenario.targetSaltName}.`;
      } else {
        feedback = `Stoichiometric discrepancy: Delivered ${this.buretteDelivered.toFixed(1)} mL (target ${eqVol.toFixed(1)} mL), resulting in pH ${this.currentPH.toFixed(2)}. Neutralization requires exact acid-base stoichiometric parity before evaporation to avoid unreacted hazardous residues.`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: totalScore,
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          deliveredAmmonia: this.buretteDelivered,
          targetAmmonia: eqVol,
          finalPH: this.currentPH,
          harvestedCrystalsGrams: this.crystalYieldGrams
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
              <span>Final pH</span>
              <strong style="color:${res.parameters.finalPH >= 6.0 && res.parameters.finalPH <= 8.0 ? '#16a34a' : '#dc2626'};">${res.parameters.finalPH.toFixed(2)}</strong>
            </div>
            <div class="metric-box">
              <span>Ammonia Delivered</span>
              <strong>${res.parameters.deliveredAmmonia.toFixed(1)} / ${res.parameters.targetAmmonia.toFixed(1)} mL</strong>
            </div>
            <div class="metric-box">
              <span>Harvested Salt</span>
              <strong style="color:#0284c7;">${res.parameters.harvestedCrystalsGrams.toFixed(2)} g</strong>
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
        new FertilizerProductionSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new FertilizerProductionSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab04.js ---

// --- START challenge_case_lab05.js ---
/* ============================================================
   BALANCE Chemistry — Lab 05 Interactive Challenge Case
   "Reversible Reaction Recovery" (Ammonium Chloride Decomposition & Recombination)
   Bunsen Flame Intensity, Condenser Jacket Cooling, Sublimation Physics,
   Ring Deposition Canvas, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab05 = (function() {
  'use strict';

  // 10 Procedural Recovery Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Sublimation Ring Deposition",
      briefing: "Execute the thermal decomposition and recombination of ammonium chloride: NH4Cl(s) <=> NH3(g) + HCl(g). Heat the bottom of the sealed tube to ~340 °C to vaporize solid NH4Cl, while maintaining the upper condenser cold (<100 °C) to harvest a pure white crystalline ring.",
      initialMassGrams: 8.0,
      targetSublimedYield: 7.0,
      maxAllowedPressure: 1.6,
      hint: "Endothermic decomposition occurs at the hot base (>340 °C); exothermic recombination occurs at the cool condenser (<100 °C)."
    },
    {
      id: "mission_02",
      title: "High-Purity Sublimate Harvest",
      briefing: "Maximize recovery yield of recombined salt without exceeding safe tube pressure (1.5 atm). Regulate the Bunsen flame and condenser cooling.",
      initialMassGrams: 10.0,
      targetSublimedYield: 8.8,
      maxAllowedPressure: 1.5,
      hint: "Gentle heating prevents rapid pressure spikes while allowing gases to diffuse smoothly to the cold ring zone."
    },
    {
      id: "mission_03",
      title: "Reversibility Proof Cycle",
      briefing: "Demonstrate true chemical reversibility. Completely sublime the initial solid, let the white ring form, then cool the tube to prove mass conservation.",
      initialMassGrams: 6.0,
      targetSublimedYield: 5.5,
      maxAllowedPressure: 1.4,
      hint: "Total mass of solid at base + mass of recombined ring must equal initial 6.0 g."
    },
    {
      id: "mission_04",
      title: "Pressure Boundary Management",
      briefing: "Operate at high thermal power while managing the pressure relief valve. Keep internal pressure strictly below 1.35 atm at all times.",
      initialMassGrams: 9.0,
      targetSublimedYield: 7.5,
      maxAllowedPressure: 1.35,
      hint: "If pressure climbs above 1.25 atm, reduce flame intensity immediately."
    },
    {
      id: "mission_05",
      title: "Rapid Thermal Dissociation",
      briefing: "Achieve >80% sublimation within 45 seconds using optimal heating and continuous condenser chilling.",
      initialMassGrams: 7.5,
      targetSublimedYield: 6.0,
      maxAllowedPressure: 1.6,
      hint: "Set flame to 85% and condenser to ice bath (5 °C)."
    },
    {
      id: "mission_06",
      title: "Cold-Finger Temperature Optimization",
      briefing: "Test condenser efficiency by varying cooling temperature. Determine the temperature that yields the densest white crystalline ring.",
      initialMassGrams: 8.0,
      targetSublimedYield: 7.2,
      maxAllowedPressure: 1.5,
      hint: "Lower cold-zone temperature accelerates recombination rate: NH3(g) + HCl(g) -> NH4Cl(s)."
    },
    {
      id: "mission_07",
      title: "Thermal Decomposition vs Melting",
      briefing: "Verify that ammonium chloride does not melt into a liquid, but directly undergoes genuine solid-to-gas sublimation.",
      initialMassGrams: 8.0,
      targetSublimedYield: 7.0,
      maxAllowedPressure: 1.5,
      hint: "Watch the crystal bed diminish directly into invisible vapor with zero liquid droplet formation."
    },
    {
      id: "mission_08",
      title: "Multi-Zone Equilibrium Calibration",
      briefing: "Establish a steady-state equilibrium where sublimation rate at the bottom equals recombination rate at the condenser.",
      initialMassGrams: 10.0,
      targetSublimedYield: 8.0,
      maxAllowedPressure: 1.45,
      hint: "Maintain base temperature at 350 °C and condenser at 20 °C."
    },
    {
      id: "mission_09",
      title: "Sublimation Energy Conservation",
      briefing: "Harvest >6.0 g of recombined crystals while using minimal cumulative thermal energy.",
      initialMassGrams: 7.0,
      targetSublimedYield: 6.0,
      maxAllowedPressure: 1.4,
      hint: "Use pulsed moderate heating rather than continuous maximum flame."
    },
    {
      id: "mission_10",
      title: "Forensic Salt Purification",
      briefing: "Separate volatile ammonium chloride from non-volatile sand/sodium chloride impurities via sublimative extraction.",
      initialMassGrams: 8.5,
      targetSublimedYield: 7.5,
      maxAllowedPressure: 1.5,
      hint: "Only NH4Cl sublimes and redeposits on the upper tube wall."
    }
  ];

  class ReversibleReactionSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB05_${attemptNumber}_${Date.now() % 10000}`;

      // Physical state
      this.baseMass = this.scenario.initialMassGrams; // g remaining at base
      this.ringMass = 0.0; // g deposited on ring
      this.vaporMass = 0.0; // g in gas phase
      this.flameIntensity = 0; // 0 to 100%
      this.baseTemp = 22; // °C
      this.condenserTemp = 20; // °C (5 to 30)
      this.pressureAtm = 1.0;
      this.maxPressureObserved = 1.0;

      this.simulatedTime = 0;
      this.timerInterval = null;
      this.animFrame = null;
      this.adjustmentsCount = 0;
      this.isSubmitted = false;

      this.vaporParticles = [];

      this.initUI();
      this.startTimer();
      this.startAnimationLoop();
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 05</span>
              <h2 class="mission-title">Reversible Recovery: ${this.scenario.title}</h2>
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
            <!-- Left: Sublimation Glass Tube Canvas -->
            <div class="canvas-panel">
              <canvas id="sublimationCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Base Temp</span>
                  <strong id="readoutBaseT">22 °C</strong>
                </div>
                <div class="readout-item">
                  <span>Condenser Temp</span>
                  <strong id="readoutCondT">20 °C</strong>
                </div>
                <div class="readout-item">
                  <span>Tube Pressure</span>
                  <strong id="readoutP" style="color:#0284c7;">1.00 atm</strong>
                </div>
                <div class="readout-item">
                  <span>Harvested Ring</span>
                  <strong id="readoutRing" style="color:#16a34a;">0.0 g</strong>
                </div>
              </div>
            </div>

            <!-- Right: Burner & Condenser Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label for="flameRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Bunsen Burner Flame Intensity</label>
                  <span class="control-val" id="flameVal">Off (0%)</span>
                </div>
                <input type="range" id="flameRange" min="0" max="100" step="5" value="0">
                <small class="control-note">Sublimation of NH4Cl requires >340 °C thermal decomposition temperature.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> Condenser Cooling Jacket</label>
                  <span class="control-val" id="condenserVal">Ambient (20 °C)</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn" data-cond="5">Ice Bath (5 °C)</button>
                  <button type="button" class="stir-btn active" data-cond="20">Ambient (20 °C)</button>
                  <button type="button" class="stir-btn" data-cond="30">Warm (30 °C)</button>
                </div>
                <small class="control-note">Cold surface drives exothermic recombination: NH3(g) + HCl(g) -> NH4Cl(s).</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Reversibility Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Harvest &amp; Submit Sublimate</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const flameRange = this.container.querySelector('#flameRange');
      const flameVal = this.container.querySelector('#flameVal');
      flameRange.oninput = (e) => {
        this.flameIntensity = parseInt(e.target.value, 10);
        flameVal.textContent = this.flameIntensity === 0 ? 'Off (0%)' : `${this.flameIntensity}% Heat`;
        this.adjustmentsCount++;
      };

      const condBtns = this.container.querySelectorAll('[data-cond]');
      const condVal = this.container.querySelector('#condenserVal');
      condBtns.forEach(b => {
        b.onclick = () => {
          condBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.condenserTemp = parseInt(b.dataset.cond, 10);
          condVal.textContent = b.textContent;
          this.adjustmentsCount++;
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

    startTimer() {
      const timerEl = this.container.querySelector('#chalTimer');
      this.timerInterval = setInterval(() => {
        this.simulatedTime++;
        const mins = String(Math.floor(this.simulatedTime / 60)).padStart(2, '0');
        const secs = String(this.simulatedTime % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;

        // Base temperature thermal dynamics
        const targetTemp = 22 + (this.flameIntensity * 4.0); // up to 422 °C
        this.baseTemp += (targetTemp - this.baseTemp) * 0.15;

        // Sublimation kinetics
        if (this.baseTemp > 300 && this.baseMass > 0.05) {
          const rate = Math.min(this.baseMass, (this.baseTemp - 300) * 0.0035);
          this.baseMass -= rate;
          this.vaporMass += rate;
        }

        // Recombination kinetics at cool condenser
        if (this.vaporMass > 0.05) {
          const coldEfficiency = Math.max(0.2, (100 - this.condenserTemp) / 100);
          const recombRate = Math.min(this.vaporMass, this.vaporMass * 0.28 * coldEfficiency);
          this.vaporMass -= recombRate;
          this.ringMass += recombRate;
        }

        // Pressure physics: ideal gas approximation from vapor
        this.pressureAtm = 1.0 + (this.vaporMass * 0.15) + ((this.baseTemp - 22) / 600) * 0.35;
        if (this.pressureAtm > this.maxPressureObserved) {
          this.maxPressureObserved = this.pressureAtm;
        }

        this.updateReadouts();
      }, 1000);
    }

    updateReadouts() {
      const rBase = this.container.querySelector('#readoutBaseT');
      const rCond = this.container.querySelector('#readoutCondT');
      const rP = this.container.querySelector('#readoutP');
      const rRing = this.container.querySelector('#readoutRing');

      if (rBase) rBase.textContent = `${Math.round(this.baseTemp)} °C`;
      if (rCond) rCond.textContent = `${this.condenserTemp} °C`;
      if (rP) {
        rP.textContent = `${this.pressureAtm.toFixed(2)} atm`;
        rP.style.color = this.pressureAtm > this.scenario.maxAllowedPressure ? '#dc2626' : (this.pressureAtm > 1.3 ? '#f59e0b' : '#0284c7');
      }
      if (rRing) rRing.textContent = `${this.ringMass.toFixed(2)} g`;
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#sublimationCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const tubeX = 180;
        const tubeY = 30;
        const tubeW = 60;
        const tubeH = 240;

        // Draw Bunsen Burner below tube
        const bx = tubeX + tubeW / 2;
        const by = tubeY + tubeH + 20;

        ctx.fillStyle = '#475569';
        ctx.fillRect(bx - 8, by, 16, 40);
        ctx.fillRect(bx - 30, by + 40, 60, 10);

        // Flame animation
        if (this.flameIntensity > 0) {
          const flameH = (this.flameIntensity / 100) * 35;
          const fGrad = ctx.createRadialGradient(bx, by, 2, bx, by - flameH, 15);
          fGrad.addColorStop(0, '#60a5fa');
          fGrad.addColorStop(0.4, '#38bdf8');
          fGrad.addColorStop(0.8, '#f59e0b');
          fGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.moveTo(bx - 8, by);
          ctx.quadraticCurveTo(bx - 12 + Math.random() * 4, by - flameH * 0.7, bx, by - flameH);
          ctx.quadraticCurveTo(bx + 12 - Math.random() * 4, by - flameH * 0.7, bx + 8, by);
          ctx.closePath();
          ctx.fill();
        }

        // Condenser Jacket around Upper Tube
        ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.fillRect(tubeX - 10, tubeY + 40, tubeW + 20, 70);
        ctx.strokeRect(tubeX - 10, tubeY + 40, tubeW + 20, 70);

        // Glass Boiling Tube
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tubeX, tubeY);
        ctx.lineTo(tubeX, tubeY + tubeH - 20);
        ctx.arc(tubeX + 30, tubeY + tubeH - 20, 30, Math.PI, 0, true);
        ctx.lineTo(tubeX + tubeW, tubeY);
        ctx.closePath();
        ctx.clip();

        // Hot base glow
        if (this.baseTemp > 100) {
          const glowAlpha = Math.min(0.7, (this.baseTemp - 100) / 400);
          ctx.fillStyle = `rgba(239, 68, 68, ${glowAlpha})`;
          ctx.fillRect(tubeX, tubeY + tubeH - 60, tubeW, 60);
        }

        // Solid NH4Cl Crystals at Base
        if (this.baseMass > 0.05) {
          const solidH = (this.baseMass / this.scenario.initialMassGrams) * 35;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(tubeX + 6, tubeY + tubeH - solidH - 5, tubeW - 12, solidH);

          // Crystal texture dots
          ctx.fillStyle = '#e2e8f0';
          for (let i = 0; i < 15; i++) {
            ctx.fillRect(tubeX + 10 + (i * 7) % 40, tubeY + tubeH - solidH + (i * 3) % 20, 3, 3);
          }
        }

        // Recombined White Crystalline Ring in Cold Zone
        if (this.ringMass > 0.05) {
          const ringThickness = Math.min(18, this.ringMass * 2.2);
          const ringY = tubeY + 70;

          // Pure white crystal ring adhering to glass inner walls
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(tubeX + 2, ringY - ringThickness / 2, 10, ringThickness);
          ctx.fillRect(tubeX + tubeW - 12, ringY - ringThickness / 2, 10, ringThickness);

          // Connecting frosty ring
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fillRect(tubeX + 2, ringY - 2, tubeW - 4, 4);
        }

        // Rising vapor particles (NH3 + HCl)
        if (this.vaporMass > 0.02 && Math.random() < 0.4) {
          this.vaporParticles.push({
            x: tubeX + 10 + Math.random() * (tubeW - 20),
            y: tubeY + tubeH - 30,
            vy: 2 + Math.random() * 2,
            alpha: 0.8
          });
        }

        ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
        for (let p = this.vaporParticles.length - 1; p >= 0; p--) {
          const vp = this.vaporParticles[p];
          vp.y -= vp.vy;
          vp.alpha -= 0.015;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, vp.alpha)})`;
          ctx.beginPath();
          ctx.arc(vp.x, vp.y, 4, 0, Math.PI * 2);
          ctx.fill();

          if (vp.y <= tubeY + 70 || vp.alpha <= 0) {
            this.vaporParticles.splice(p, 1);
          }
        }

        ctx.restore();

        // Glass Tube Outlines & Stopper
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tubeX, tubeY);
        ctx.lineTo(tubeX, tubeY + tubeH - 20);
        ctx.arc(tubeX + 30, tubeY + tubeH - 20, 30, Math.PI, 0, true);
        ctx.lineTo(tubeX + tubeW, tubeY);
        ctx.stroke();

        // Rubber Stopper
        ctx.fillStyle = '#334155';
        ctx.fillRect(tubeX - 2, tubeY - 10, tubeW + 4, 14);

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

      const targetYield = this.scenario.targetSublimedYield;
      const yieldDiff = Math.max(0, targetYield - this.ringMass);
      const isOverpressured = this.maxPressureObserved > this.scenario.maxAllowedPressure;

      let yieldScore = Math.max(0, (this.ringMass / targetYield) * 60);
      let safetyScore = isOverpressured ? 10 : 30;
      let timeScore = this.simulatedTime <= 60 ? 10 : (this.simulatedTime <= 90 ? 5 : 0);

      const totalScore = Math.min(100, Math.round(yieldScore + safetyScore + timeScore));

      let feedback = "";
      if (totalScore >= 75) {
        feedback = `Masterful reversible recovery! You harvested ${this.ringMass.toFixed(2)} g of pure recombined ammonium chloride ring (target: ${targetYield.toFixed(1)} g) while maintaining peak pressure at ${this.maxPressureObserved.toFixed(2)} atm. Reversible thermal decomposition and recombination cleanly demonstrated!`;
      } else {
        feedback = `Recovery deficit: Harvested ${this.ringMass.toFixed(2)} g sublimate (target: ${targetYield.toFixed(1)} g). Peak pressure was ${this.maxPressureObserved.toFixed(2)} atm ${isOverpressured ? '(EXCEEDED SAFETY LIMIT)' : ''}. Maintain base temperature >340 °C for dissociation and cold condenser <25 °C for recombination.`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: totalScore,
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          harvestedRingMass: this.ringMass,
          targetYield: targetYield,
          peakPressure: this.maxPressureObserved,
          finalBaseTemp: this.baseTemp
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
              <span>Harvested Ring</span>
              <strong style="color:#16a34a;">${res.parameters.harvestedRingMass.toFixed(2)} g</strong>
            </div>
            <div class="metric-box">
              <span>Target Yield</span>
              <strong>${res.parameters.targetYield.toFixed(1)} g</strong>
            </div>
            <div class="metric-box">
              <span>Peak Pressure</span>
              <strong style="color:${res.parameters.peakPressure > 1.5 ? '#dc2626' : '#0284c7'};">${res.parameters.peakPressure.toFixed(2)} atm</strong>
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
        new ReversibleReactionSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new ReversibleReactionSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab05.js ---

// --- START challenge_case_lab06.js ---
/* ============================================================
   BALANCE Chemistry — Lab 06 Interactive Challenge Case
   "Unknown Gas Confirmation" (Analytical Ammonium Confirmation & Smoke Test)
   Procedural Forensic Samples, Reagent & Warming Controls,
   Damp Litmus & Conc. HCl Smoke Plume Canvas, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab06 = (function() {
  'use strict';

  // 10 Procedural Gas Confirmation Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Forensic Ammonium Fertilizer Confirmation",
      targetGas: "NH3",
      sampleName: "Agricultural Fertilizer Sample A",
      hasAmmonium: true,
      briefing: "A customs inspection intercepted an unlabelled white crystalline fertilizer. Add 2.0 M sodium hydroxide and warm gently to liberate ammonia gas: NH4+(aq) + OH-(aq) -> NH3(g) + H2O(l). Confirm the gas using both damp red litmus paper and a glass rod dipped in concentrated HCl (dense white fumes).",
      hint: "Ammonia is the only common alkaline gas; it turns damp red litmus blue and reacts with concentrated HCl vapor to produce dense white smoke of NH4Cl."
    },
    {
      id: "mission_02",
      title: "Mystery Salt Differentiation: NH4Cl vs NaCl",
      targetGas: "NH3",
      sampleName: "Crystalline Salt Batch B",
      hasAmmonium: true,
      briefing: "Determine whether Salt Batch B contains ammonium chloride or table salt (NaCl). Sodium chloride does not release alkaline gas when warmed with sodium hydroxide.",
      hint: "If damp red litmus turns blue upon warming with NaOH, ammonium ion (NH4+) is present."
    },
    {
      id: "mission_03",
      title: "Negative Control: Pure Sodium Nitrate",
      targetGas: "None",
      sampleName: "Reference Mineral Salt C",
      hasAmmonium: false,
      briefing: "Perform a negative control test on Reference Salt C. Warm with sodium hydroxide and confirm that no alkaline ammonia vapors or white smoke plumes are produced.",
      hint: "Non-ammonium salts will not turn damp red litmus blue when warmed with sodium hydroxide."
    },
    {
      id: "mission_04",
      title: "Cold Storage Ammonia Leak Trace",
      targetGas: "NH3",
      sampleName: "Refrigerant Condensate Sample D",
      hasAmmonium: true,
      briefing: "A commercial refrigeration pipe leaked. Test the collected condensation for trace dissolved ammonium ions using the conc. HCl smoke rod test.",
      hint: "NH3(g) + HCl(g) -> NH4Cl(s) forms visible microscopic aerosol smoke particles immediately upon contact."
    },
    {
      id: "mission_05",
      title: "Damp Red Litmus Response Calibration",
      targetGas: "NH3",
      sampleName: "Soil Leachate Sample E",
      hasAmmonium: true,
      briefing: "Measure the speed of alkaline gas liberation. Bring damp red litmus to the mouth of the test tube and record the color change to vibrant royal blue.",
      hint: "Moisture on the litmus paper dissolves NH3 to form NH4+ and OH-, raising the local pH above 8.3."
    },
    {
      id: "mission_06",
      title: "Concentrated Acid Smoke Plume Audit",
      targetGas: "NH3",
      sampleName: "Industrial Cleanser Residue F",
      hasAmmonium: true,
      briefing: "Dip the glass probe into concentrated hydrochloric acid and position it over the warmed tube mouth to verify dense white smoke formation.",
      hint: "Hold the glass rod right at the mouth of the test tube where the ammonia gas concentration is highest."
    },
    {
      id: "mission_07",
      title: "Negative Control: Potassium Sulfate",
      targetGas: "None",
      sampleName: "Fertilizer Grade Potash G",
      hasAmmonium: false,
      briefing: "Verify that potassium sulfate does not trigger false positive litmus or smoke reactions when treated with sodium hydroxide.",
      hint: "Potassium ions do not produce volatile basic gases with hydroxide."
    },
    {
      id: "mission_08",
      title: "Minimal Warming Gas Release",
      targetGas: "NH3",
      sampleName: "Ammonium Phosphate Sample H",
      hasAmmonium: true,
      briefing: "Liberate ammonia using minimal thermal energy (gentle warmth 50 °C) to prevent boiling over the caustic sodium hydroxide solution.",
      hint: "Gentle warming is sufficient to drive volatile ammonia gas out of solution without boiling liquid."
    },
    {
      id: "mission_09",
      title: "Forensic Crime Scene Powder",
      targetGas: "NH3",
      sampleName: "Unlabelled White Powder I",
      hasAmmonium: true,
      briefing: "Execute the complete two-stage analytical confirmation protocol: 1. Litmus alkaline test, 2. Acid smoke precipitation. Submit the verified cation identification.",
      hint: "Both tests must be positive to definitively certify the presence of ammonium (NH4+)."
    },
    {
      id: "mission_10",
      title: "Final Analytical Board Certification",
      targetGas: "NH3",
      sampleName: "Board Examination Sample J",
      hasAmmonium: true,
      briefing: "Complete the final diagnostic certification against Oxford MYP criteria. Document litmus color transition and HCl plume density.",
      hint: "NH3 is alkaline, pungent, highly soluble, and reacts with HCl to form solid NH4Cl."
    }
  ];

  class UnknownGasSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB06_${attemptNumber}_${Date.now() % 10000}`;

      // Scientific state
      this.naohAdded = 0; // mL (0 to 5)
      this.isHeating = false;
      this.tubeTemp = 22; // °C
      this.gasEvolutionRate = 0.0; // 0 to 1
      this.selectedProbe = 'None'; // 'None', 'Litmus', 'HClRod'
      this.litmusBlueFraction = 0.0; // 0 (red) to 1 (blue)
      this.smokePlumeDensity = 0.0; // 0 to 1
      this.userDiagnosis = "";

      this.simulatedTime = 0;
      this.timerInterval = null;
      this.animFrame = null;
      this.adjustmentsCount = 0;
      this.isSubmitted = false;

      this.smokeParticles = [];
      this.gasBubbles = [];

      this.initUI();
      this.startTimer();
      this.startAnimationLoop();
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 06</span>
              <h2 class="mission-title">Gas Confirmation: ${this.scenario.title}</h2>
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
            <!-- Left: Boiling Tube & Smoke Plume Canvas -->
            <div class="canvas-panel">
              <canvas id="gasCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>NaOH Added</span>
                  <strong id="readoutNaOH">0.0 mL</strong>
                </div>
                <div class="readout-item">
                  <span>Tube Temp</span>
                  <strong id="readoutTemp">22 °C</strong>
                </div>
                <div class="readout-item">
                  <span>Damp Litmus</span>
                  <strong id="readoutLitmus" style="color:#dc2626;">Red (Acid/Neutral)</strong>
                </div>
                <div class="readout-item">
                  <span>HCl Probe Smoke</span>
                  <strong id="readoutSmoke">None</strong>
                </div>
              </div>
            </div>

            <!-- Right: Reagent, Warming & Diagnostic Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> Add 2.0 M Sodium Hydroxide</label>
                  <span class="control-val" id="naohVal">0.0 mL</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn" id="btnAdd1mL">+1.0 mL NaOH</button>
                  <button type="button" class="stir-btn" id="btnAdd3mL">+3.0 mL NaOH</button>
                </div>
                <small class="control-note">OH- ions react with NH4+ to liberate dissolved ammonia: NH4+ + OH- -> NH3 + H2O.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Gentle Thermal Warming</label>
                  <span class="control-val" id="heatVal">Off (22 °C)</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" id="btnHeatOff">Heater Off</button>
                  <button type="button" class="stir-btn" id="btnHeatOn">Warm Gently (60 °C)</button>
                </div>
                <small class="control-note">Heating decreases ammonia gas solubility, driving it out of aqueous solution.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg> Analytical Test Probe</label>
                  <span class="control-val" id="probeVal">No Probe Active</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn active" data-probe="None">None</button>
                  <button type="button" class="stir-btn" data-probe="Litmus">Damp Red Litmus</button>
                  <button type="button" class="stir-btn" data-probe="HClRod">Conc. HCl Glass Rod</button>
                </div>
                <small class="control-note">Hold test probe at the mouth of the tube to detect escaping volatile vapors.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg> Forensic Analytical Verdict</label>
                </div>
                <select id="diagnosisSelect" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; font-weight:700; color:#0f172a; margin-top:4px;">
                  <option value="">-- Submit Confirmed Gas Identification --</option>
                  <option value="NH3">Ammonia Gas (NH3) Confirmed [Contains NH4+]</option>
                  <option value="None">Negative Result [No Ammonium Ions Present]</option>
                </select>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Forensic Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Submit Gas Analysis</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const naohVal = this.container.querySelector('#naohVal');
      this.container.querySelector('#btnAdd1mL').onclick = () => {
        this.naohAdded = Math.min(5.0, this.naohAdded + 1.0);
        naohVal.textContent = `${this.naohAdded.toFixed(1)} mL`;
        this.adjustmentsCount++;
        this.updateChemistry();
      };
      this.container.querySelector('#btnAdd3mL').onclick = () => {
        this.naohAdded = Math.min(5.0, this.naohAdded + 3.0);
        naohVal.textContent = `${this.naohAdded.toFixed(1)} mL`;
        this.adjustmentsCount++;
        this.updateChemistry();
      };

      const btnHeatOff = this.container.querySelector('#btnHeatOff');
      const btnHeatOn = this.container.querySelector('#btnHeatOn');
      const heatVal = this.container.querySelector('#heatVal');

      btnHeatOff.onclick = () => {
        this.isHeating = false;
        btnHeatOff.classList.add('active');
        btnHeatOn.classList.remove('active');
        heatVal.textContent = 'Off (22 °C)';
        this.adjustmentsCount++;
      };

      btnHeatOn.onclick = () => {
        this.isHeating = true;
        btnHeatOn.classList.add('active');
        btnHeatOff.classList.remove('active');
        heatVal.textContent = 'Warm (60 °C)';
        this.adjustmentsCount++;
      };

      const probeBtns = this.container.querySelectorAll('[data-probe]');
      const probeVal = this.container.querySelector('#probeVal');
      probeBtns.forEach(b => {
        b.onclick = () => {
          probeBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.selectedProbe = b.dataset.probe;
          probeVal.textContent = b.textContent;
          this.adjustmentsCount++;
        };
      });

      this.container.querySelector('#diagnosisSelect').onchange = (e) => {
        this.userDiagnosis = e.target.value;
        this.adjustmentsCount++;
      };

      this.container.querySelector('#hintBtn').onclick = () => {
        const box = this.container.querySelector('#chalHintBox');
        box.textContent = this.scenario.hint;
        box.classList.remove('hidden');
        this.adjustmentsCount++;
      };

      this.container.querySelector('#submitChallengeBtn').onclick = () => this.submitMission();
    }

    startTimer() {
      const timerEl = this.container.querySelector('#chalTimer');
      this.timerInterval = setInterval(() => {
        this.simulatedTime++;
        const mins = String(Math.floor(this.simulatedTime / 60)).padStart(2, '0');
        const secs = String(this.simulatedTime % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;

        // Thermal dynamics
        const targetTemp = this.isHeating ? 62 : 22;
        this.tubeTemp += (targetTemp - this.tubeTemp) * 0.2;

        this.updateChemistry();
        this.updateReadouts();
      }, 1000);
    }

    updateChemistry() {
      if (this.scenario.hasAmmonium && this.naohAdded > 0.5 && this.tubeTemp > 35) {
        this.gasEvolutionRate = Math.min(1.0, (this.naohAdded / 3.0) * ((this.tubeTemp - 30) / 30));
      } else {
        this.gasEvolutionRate = 0.0;
      }

      // Litmus transition
      if (this.selectedProbe === 'Litmus' && this.gasEvolutionRate > 0.1) {
        this.litmusBlueFraction = Math.min(1.0, this.litmusBlueFraction + this.gasEvolutionRate * 0.35);
      }

      // Smoke plume density
      if (this.selectedProbe === 'HClRod' && this.gasEvolutionRate > 0.1) {
        this.smokePlumeDensity = Math.min(1.0, this.gasEvolutionRate * 1.2);
      } else {
        this.smokePlumeDensity *= 0.8;
      }
    }

    updateReadouts() {
      const rNaOH = this.container.querySelector('#readoutNaOH');
      const rTemp = this.container.querySelector('#readoutTemp');
      const rLitmus = this.container.querySelector('#readoutLitmus');
      const rSmoke = this.container.querySelector('#readoutSmoke');

      if (rNaOH) rNaOH.textContent = `${this.naohAdded.toFixed(1)} mL`;
      if (rTemp) rTemp.textContent = `${Math.round(this.tubeTemp)} °C`;
      if (rLitmus) {
        if (this.litmusBlueFraction > 0.6) {
          rLitmus.textContent = "Turned Royal Blue (Alkaline Gas!)";
          rLitmus.style.color = "#1d4ed8";
        } else if (this.litmusBlueFraction > 0.1) {
          rLitmus.textContent = "Turning Purple/Blue...";
          rLitmus.style.color = "#9333ea";
        } else {
          rLitmus.textContent = "Remains Red (Acid/Neutral)";
          rLitmus.style.color = "#dc2626";
        }
      }
      if (rSmoke) {
        if (this.smokePlumeDensity > 0.4) {
          rSmoke.textContent = "Dense White Fumes (NH4Cl)";
          rSmoke.style.color = "#0f172a";
        } else if (this.smokePlumeDensity > 0.1) {
          rSmoke.textContent = "Faint White Haze";
          rSmoke.style.color = "#64748b";
        } else {
          rSmoke.textContent = "None";
          rSmoke.style.color = "#94a3b8";
        }
      }
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#gasCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lab bench gradient
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Test Tube Geometry
        const tx = 180;
        const ty = 70;
        const tw = 60;
        const th = 220;

        // Heating mantle glow under tube
        if (this.isHeating) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.beginPath();
          ctx.arc(tx + 30, ty + th + 10, 35, 0, Math.PI);
          ctx.fill();
        }

        // Boiling Tube Glass
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty + th - 25);
        ctx.arc(tx + 30, ty + th - 25, 30, Math.PI, 0, true);
        ctx.lineTo(tx + tw, ty);
        ctx.closePath();
        ctx.clip();

        // Reaction solution inside tube
        const liquidH = 70 + (this.naohAdded * 10);
        const liquidY = ty + th - liquidH;

        ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
        ctx.fillRect(tx, liquidY, tw, liquidH);

        // Sample sediment at bottom
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tx + 8, ty + th - 12, tw - 16, 8);

        // Bubbles of gas evolving upon warming
        if (this.gasEvolutionRate > 0.05 && Math.random() < this.gasEvolutionRate * 0.7) {
          this.gasBubbles.push({
            x: tx + 12 + Math.random() * (tw - 24),
            y: ty + th - 15,
            vy: 2 + Math.random() * 2,
            r: 2 + Math.random() * 2
          });
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let b = this.gasBubbles.length - 1; b >= 0; b--) {
          const bub = this.gasBubbles[b];
          bub.y -= bub.vy;
          ctx.beginPath();
          ctx.arc(bub.x, bub.y, bub.r, 0, Math.PI * 2);
          ctx.fill();

          if (bub.y <= liquidY) {
            this.gasBubbles.splice(b, 1);
          }
        }

        ctx.restore();

        // Tube outline
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty + th - 25);
        ctx.arc(tx + 30, ty + th - 25, 30, Math.PI, 0, true);
        ctx.lineTo(tx + tw, ty);
        ctx.stroke();

        // Rim
        ctx.beginPath();
        ctx.ellipse(tx + 30, ty, 34, 5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#64748b';
        ctx.stroke();

        // Draw Selected Probe at Mouth of Tube
        const mouthX = tx + 30;
        const mouthY = ty - 10;

        if (this.selectedProbe === 'Litmus') {
          // Litmus Paper Strip
          const redCol = '#ef4444';
          const blueCol = '#2563eb';
          // Interpolate color from red to blue
          const rGrad = ctx.createLinearGradient(mouthX - 10, mouthY - 30, mouthX + 10, mouthY + 5);
          if (this.litmusBlueFraction > 0.5) {
            rGrad.addColorStop(0, redCol);
            rGrad.addColorStop(1, blueCol);
          } else {
            rGrad.addColorStop(0, redCol);
            rGrad.addColorStop(1, redCol);
          }

          ctx.fillStyle = rGrad;
          ctx.fillRect(mouthX - 8, mouthY - 35, 16, 45);
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 1;
          ctx.strokeRect(mouthX - 8, mouthY - 35, 16, 45);
        } else if (this.selectedProbe === 'HClRod') {
          // Glass Rod with Concentrated HCl droplet
          ctx.fillStyle = '#cbd5e1';
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.fillRect(mouthX + 15, mouthY - 60, 6, 65);
          ctx.strokeRect(mouthX + 15, mouthY - 60, 6, 65);

          // Acid drop at tip
          ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
          ctx.beginPath();
          ctx.arc(mouthX + 18, mouthY + 7, 4, 0, Math.PI * 2);
          ctx.fill();

          // Dense White Smoke Plume Particles (NH4Cl)
          if (this.smokePlumeDensity > 0.05) {
            for (let s = 0; s < 3; s++) {
              this.smokeParticles.push({
                x: mouthX + 18 + (Math.random() * 8 - 4),
                y: mouthY + 5,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -(1.5 + Math.random() * 2),
                r: 4 + Math.random() * 4,
                alpha: 0.85
              });
            }
          }
        }

        // Render Dense White Smoke
        for (let sp = this.smokeParticles.length - 1; sp >= 0; sp--) {
          const p = this.smokeParticles[sp];
          p.x += p.vx;
          p.y += p.vy;
          p.r += 0.25;
          p.alpha -= 0.015;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          if (p.alpha <= 0 || p.y < 10) {
            this.smokeParticles.splice(sp, 1);
          }
        }

        if (!this.isSubmitted) {
          this.animFrame = requestAnimationFrame(render);
        }
      };

      this.animFrame = requestAnimationFrame(render);
    }

    submitMission() {
      if (!this.userDiagnosis) {
        alert("Please select your confirmed Forensic Analytical Verdict before submitting.");
        return;
      }

      this.isSubmitted = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      if (this.animFrame) cancelAnimationFrame(this.animFrame);

      const target = this.scenario.targetGas;
      const isCorrect = this.userDiagnosis === target;

      let score = 0;
      if (isCorrect) {
        score = 80;
        if (this.litmusBlueFraction > 0.5 || this.smokePlumeDensity > 0.3) score += 10;
        if (this.simulatedTime <= 75) score += 10;
      } else {
        score = 30;
      }

      let feedback = "";
      if (isCorrect) {
        feedback = `Flawless forensic gas confirmation! You accurately classified ${this.scenario.sampleName} as ${target === 'NH3' ? 'Ammonia Gas (NH3) / Ammonium Ion (NH4+)' : 'Negative (No Ammonium)'}. `;
        if (target === 'NH3') {
          feedback += `You confirmed the alkaline nature via damp red litmus turning royal blue and observed the diagnostic dense white smoke plume of solid NH4Cl when exposed to concentrated HCl vapors.`;
        } else {
          feedback += `You correctly verified that no alkaline gas or white smoke was evolved, confirming the absence of ammonium cations.`;
        }
      } else {
        feedback = `Forensic discrepancy: Your verdict was ${this.userDiagnosis}, but authentic sample analysis confirmed ${target}. Remember: NH4+ + OH- -> NH3 + H2O. Ammonia turns damp red litmus blue and produces dense white NH4Cl fumes with concentrated HCl.`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: Math.min(100, score),
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          targetGas: target,
          userDiagnosis: this.userDiagnosis,
          litmusBlueFraction: this.litmusBlueFraction,
          peakSmokeDensity: this.smokePlumeDensity
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
              <span>Target Gas</span>
              <strong>${res.parameters.targetGas}</strong>
            </div>
            <div class="metric-box">
              <span>Your Verdict</span>
              <strong style="color:${res.parameters.userDiagnosis === res.parameters.targetGas ? '#16a34a' : '#dc2626'};">${res.parameters.userDiagnosis}</strong>
            </div>
            <div class="metric-box">
              <span>Smoke Test Density</span>
              <strong>${(res.parameters.peakSmokeDensity * 100).toFixed(0)}%</strong>
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
        new UnknownGasSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new UnknownGasSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab06.js ---

// --- START challenge_case_lab07.js ---
/* ============================================================
   BALANCE Chemistry — Lab 07 Interactive Challenge Case
   "Equilibrium Recovery Chamber" (Cobalt Hexaaqua / Tetrachloro Spectrophotometer)
   [Co(H2O)6]2+ (Pink) + 4 Cl- + Heat <=> [CoCl4]2- (Blue) + 6 H2O
   Temperature Bath & Chloride Injector Controls, Spectrophotometer Canvas,
   Live Absorbance Graph, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab07 = (function() {
  'use strict';

  // 10 Procedural Equilibrium Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Cobalt Humidity Sensor Calibration",
      targetSpecies: "Blue",
      targetBluePercent: 92.0,
      tolerance: 5.0,
      briefing: "Synthesize a desiccated cobalt chloride humidity sensor: shift the equilibrium towards the dehydrated blue complex [CoCl4]2- (>90% blue). Apply thermal heating and concentrated chloride donor to overcome the hexaaqua hydration barrier.",
      hint: "The forward reaction is endothermic and consumes Cl-; both high temperature (>70 °C) and concentrated HCl shift equilibrium toward the royal blue tetrachlorocobaltate(II) ion."
    },
    {
      id: "mission_02",
      title: "Rehydration Sensor Reset",
      targetSpecies: "Pink",
      targetBluePercent: 5.0,
      tolerance: 4.0,
      briefing: "Reset the sensor back to the fully hydrated pink hexaaqua state [Co(H2O)6]2- (<8% blue). Submerge the cuvette in an ice bath (0 °C) and add deionized water dilution.",
      hint: "Cooling favors the exothermic reverse reaction; adding water Le Chatelier-shifts the equilibrium strongly left toward pink."
    },
    {
      id: "mission_03",
      title: "Equipotential Purple Midpoint",
      targetSpecies: "Purple",
      targetBluePercent: 50.0,
      tolerance: 4.0,
      briefing: "Calibrate the solution to the exact 50:50 purple isosbestic midpoint where [Co(H2O)6]2+ and [CoCl4]2- concentrations are equal (A510 = A660).",
      hint: "Carefully adjust temperature to ~45 °C with moderate chloride to produce the balanced violet color."
    },
    {
      id: "mission_04",
      title: "Thermal Shock Countermeasure",
      targetSpecies: "Pink",
      targetBluePercent: 12.0,
      tolerance: 5.0,
      briefing: "The chamber was subjected to an unexpected 80 °C heat surge. Rapidly counteract this thermal shift using deionized water dilution to preserve the pink hexaaqua state.",
      hint: "Adding excess water drives the reverse reaction even under elevated thermal conditions."
    },
    {
      id: "mission_05",
      title: "Chloride Conservation Protocol",
      targetSpecies: "Blue",
      targetBluePercent: 85.0,
      tolerance: 5.0,
      briefing: "Achieve >85% blue complex using the minimum possible drops of concentrated 12 M HCl by taking maximum advantage of water bath heating.",
      hint: "Operating at 80 °C dramatically lowers the chloride concentration required to stabilize the blue complex."
    },
    {
      id: "mission_06",
      title: "Rapid Cryo-Quench Cycle",
      targetSpecies: "Pink",
      targetBluePercent: 8.0,
      tolerance: 4.0,
      briefing: "Quench an 85% blue solution into a 92% pink solution in under 35 seconds using immediate ice bath submersion.",
      hint: "Set temperature bath directly to 0 °C."
    },
    {
      id: "mission_07",
      title: "Le Chatelier Dilution Reversal",
      targetSpecies: "Pink",
      targetBluePercent: 15.0,
      tolerance: 5.0,
      briefing: "Demonstrate that adding 6 moles of H2O shifts equilibrium left even with high chloride present.",
      hint: "H2O is a product of the forward reaction; increasing its concentration forces recombination to the left."
    },
    {
      id: "mission_08",
      title: "Spectrophotometric Wavelength Lock",
      targetSpecies: "Blue",
      targetBluePercent: 88.0,
      tolerance: 4.0,
      briefing: "Calibrate absorption at 660 nm (tetrahedral blue peak) to exactly 88% intensity for spectrophotometer baseline testing.",
      hint: "Fine-tune with single drops of concentrated chloride."
    },
    {
      id: "mission_09",
      title: "Cyclic Thermochromic Validation",
      targetSpecies: "Purple",
      targetBluePercent: 50.0,
      tolerance: 5.0,
      briefing: "Perform a cyclic thermal adjustment: heat to blue, cool to pink, then settle at the exact 50% purple equilibrium state.",
      hint: "Dynamic reversibility allows precise midpoint settling."
    },
    {
      id: "mission_10",
      title: "Thermodynamic Enthalpy Verification",
      targetSpecies: "Blue",
      targetBluePercent: 95.0,
      tolerance: 4.0,
      briefing: "Prove Delta H > 0 by maximizing the blue complex at 85 °C with high chloride. Verify complete spectral saturation.",
      hint: "Endothermic forward direction absorbs thermal energy."
    }
  ];

  class CobaltEquilibriumSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB07_${attemptNumber}_${Date.now() % 10000}`;

      // Scientific state
      this.temperature = 22; // °C (0 to 85)
      this.chlorideDrops = 4; // drops of 12M HCl
      this.waterAddedML = 10; // mL H2O (10 to 40)
      this.bluePercent = 20.0; // % [CoCl4]2-

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
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 07</span>
              <h2 class="mission-title">Equilibrium Chamber: ${this.scenario.title}</h2>
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
            <!-- Left: Spectrophotometer Cuvette & Absorbance Canvas -->
            <div class="canvas-panel">
              <canvas id="spectroCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Temperature</span>
                  <strong id="readoutT">22 °C</strong>
                </div>
                <div class="readout-item">
                  <span>Chloride [Cl-]</span>
                  <strong id="readoutCl">4 drops</strong>
                </div>
                <div class="readout-item">
                  <span>Pink Complex</span>
                  <strong id="readoutPink" style="color:#f472b6;">80%</strong>
                </div>
                <div class="readout-item">
                  <span>Blue Complex</span>
                  <strong id="readoutBlue" style="color:#2563eb;">20%</strong>
                </div>
              </div>
            </div>

            <!-- Right: Water Bath & Reagent Injection Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label for="tempRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> Water Bath Temperature</label>
                  <span class="control-val" id="tempVal">22 °C</span>
                </div>
                <input type="range" id="tempRange" min="0" max="85" step="1" value="22">
                <small class="control-note">Endothermic Delta H > 0: High temperature shifts equilibrium right toward blue [CoCl4]2-.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> Concentrated Chloride Donor (12 M HCl)</label>
                  <span class="control-val" id="clVal">4 drops</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn" id="btnAddCl1">+1 Drop HCl</button>
                  <button type="button" class="stir-btn" id="btnAddCl5">+5 Drops HCl</button>
                </div>
                <small class="control-note">Adding Cl- reactant drives forward shift: [Co(H2O)6]2+ + 4 Cl- -> [CoCl4]2- + 6 H2O.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M2 12h20"/></svg> Deionized Water Dilution (H2O Product)</label>
                  <span class="control-val" id="waterVal">10 mL</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn" id="btnAddWater5">+5 mL H2O</button>
                  <button type="button" class="stir-btn" id="btnResetSolvent">Reset Solvent</button>
                </div>
                <small class="control-note">Adding water shifts equilibrium left toward pink [Co(H2O)6]2+.</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Equilibrium Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Lock &amp; Submit State</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const tempRange = this.container.querySelector('#tempRange');
      const tempVal = this.container.querySelector('#tempVal');
      tempRange.oninput = (e) => {
        this.temperature = parseInt(e.target.value, 10);
        tempVal.textContent = `${this.temperature} °C`;
        this.adjustmentsCount++;
        this.recomputeEquilibrium();
      };

      const clVal = this.container.querySelector('#clVal');
      this.container.querySelector('#btnAddCl1').onclick = () => {
        this.chlorideDrops = Math.min(25, this.chlorideDrops + 1);
        clVal.textContent = `${this.chlorideDrops} drops`;
        this.adjustmentsCount++;
        this.recomputeEquilibrium();
      };
      this.container.querySelector('#btnAddCl5').onclick = () => {
        this.chlorideDrops = Math.min(25, this.chlorideDrops + 5);
        clVal.textContent = `${this.chlorideDrops} drops`;
        this.adjustmentsCount++;
        this.recomputeEquilibrium();
      };

      const waterVal = this.container.querySelector('#waterVal');
      this.container.querySelector('#btnAddWater5').onclick = () => {
        this.waterAddedML = Math.min(40, this.waterAddedML + 5);
        waterVal.textContent = `${this.waterAddedML} mL`;
        this.adjustmentsCount++;
        this.recomputeEquilibrium();
      };
      this.container.querySelector('#btnResetSolvent').onclick = () => {
        this.waterAddedML = 10;
        this.chlorideDrops = 4;
        waterVal.textContent = '10 mL';
        clVal.textContent = '4 drops';
        this.adjustmentsCount++;
        this.recomputeEquilibrium();
      };

      this.container.querySelector('#hintBtn').onclick = () => {
        const box = this.container.querySelector('#chalHintBox');
        box.textContent = this.scenario.hint;
        box.classList.remove('hidden');
        this.adjustmentsCount++;
      };

      this.container.querySelector('#submitChallengeBtn').onclick = () => this.submitMission();
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

    recomputeEquilibrium() {
      // Thermodynamic equilibrium constant model:
      // ln(K) ~ -Delta H / (R * T) + C.
      // Higher T increases K. Higher [Cl-] pushes right. Higher [H2O] pushes left.
      const tempFactor = (this.temperature - 20) * 0.9;
      const clFactor = this.chlorideDrops * 3.8;
      const waterFactor = (this.waterAddedML - 10) * 2.5;

      const rawIndex = 20 + tempFactor + clFactor - waterFactor;
      this.bluePercent = Math.max(1.0, Math.min(99.0, rawIndex));

      this.updateReadouts();
    }

    updateReadouts() {
      const rT = this.container.querySelector('#readoutT');
      const rCl = this.container.querySelector('#readoutCl');
      const rPink = this.container.querySelector('#readoutPink');
      const rBlue = this.container.querySelector('#readoutBlue');

      if (rT) rT.textContent = `${this.temperature} °C`;
      if (rCl) rCl.textContent = `${this.chlorideDrops} drops`;
      if (rPink) rPink.textContent = `${(100 - this.bluePercent).toFixed(1)}%`;
      if (rBlue) rBlue.textContent = `${this.bluePercent.toFixed(1)}%`;
    }

    getBlendedColor() {
      // Pink: rgb(244, 114, 182)
      // Blue: rgb(37, 99, 235)
      const bFrac = this.bluePercent / 100.0;
      const pFrac = 1.0 - bFrac;

      const r = Math.round(244 * pFrac + 37 * bFrac);
      const g = Math.round(114 * pFrac + 99 * bFrac);
      const b = Math.round(182 * pFrac + 235 * bFrac);
      return `rgb(${r}, ${g}, ${b})`;
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#spectroCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lab bench gradient
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Water Bath Tank (Left)
        ctx.fillStyle = this.temperature > 50 ? 'rgba(254, 215, 170, 0.4)' : (this.temperature < 15 ? 'rgba(224, 242, 254, 0.6)' : 'rgba(241, 245, 249, 0.5)');
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 80, 160, 210);
        ctx.fillRect(30, 80, 160, 210);

        // Water bath fluid
        ctx.fillStyle = this.temperature > 50 ? 'rgba(251, 146, 60, 0.25)' : (this.temperature < 15 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(203, 213, 225, 0.25)');
        ctx.fillRect(31, 110, 158, 178);

        // Glass Cuvette submerged inside Bath
        const cx = 80;
        const cy = 100;
        const cw = 60;
        const ch = 170;

        const fluidColor = this.getBlendedColor();
        ctx.fillStyle = fluidColor;
        ctx.fillRect(cx, cy + 20, cw, ch - 20);

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.strokeRect(cx, cy, cw, ch);

        // Glass highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 6, cy + 10);
        ctx.lineTo(cx + 6, cy + ch - 10);
        ctx.stroke();

        // Spectrophotometer Absorbance Graph (Right)
        const gx = 220;
        const gy = 60;
        const gw = 180;
        const gh = 140;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeRect(gx, gy, gw, gh);

        // Graph Grid
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let y = gy + 20; y < gy + gh; y += 25) {
          ctx.moveTo(gx, y);
          ctx.lineTo(gx + gw, y);
        }
        ctx.stroke();

        // Absorbance Curve (510 nm Pink Peak vs 660 nm Blue Peak)
        const bFrac = this.bluePercent / 100.0;
        const pFrac = 1.0 - bFrac;

        ctx.strokeStyle = fluidColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < gw; x++) {
          const wl = 450 + (x / gw) * 270; // 450 to 720 nm
          // Pink Gaussian peak at 510 nm
          const peakPink = Math.exp(-Math.pow(wl - 510, 2) / 600) * pFrac;
          // Blue Gaussian peak at 660 nm
          const peakBlue = Math.exp(-Math.pow(wl - 660, 2) / 900) * bFrac * 1.3;
          const absVal = Math.min(1.0, peakPink + peakBlue);

          const px = gx + x;
          const py = gy + gh - (absVal * (gh - 20)) - 10;
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Graph Peak Labels
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#f472b6';
        ctx.fillText('510nm Pink', gx + 35, gy + 16);
        ctx.fillStyle = '#2563eb';
        ctx.fillText('660nm Blue', gx + 115, gy + 16);

        // Composition Bar below Graph
        const bx = 220;
        const by = 230;
        const bw = 180;
        const bh = 22;

        ctx.fillStyle = '#f472b6'; // Pink segment
        ctx.fillRect(bx, by, bw * pFrac, bh);

        ctx.fillStyle = '#2563eb'; // Blue segment
        ctx.fillRect(bx + bw * pFrac, by, bw * bFrac, bh);

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        if (pFrac > 0.25) ctx.fillText(`${Math.round(pFrac * 100)}%`, bx + (bw * pFrac) / 2, by + 15);
        if (bFrac > 0.25) ctx.fillText(`${Math.round(bFrac * 100)}%`, bx + bw * pFrac + (bw * bFrac) / 2, by + 15);

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

      const target = this.scenario.targetBluePercent;
      const tol = this.scenario.tolerance;
      const delta = Math.abs(this.bluePercent - target);
      const isWithinTolerance = delta <= tol;

      let score = 0;
      if (isWithinTolerance) {
        score = 85;
        if (delta <= tol * 0.5) score += 10;
        if (this.simulatedTime <= 60) score += 5;
      } else {
        score = Math.max(20, Math.round(70 - (delta - tol) * 3));
      }

      let feedback = "";
      if (isWithinTolerance) {
        feedback = `Exquisite Le Chatelier equilibrium control! You achieved ${this.bluePercent.toFixed(1)}% blue complex (target: ${target.toFixed(1)}% ±${tol}%), balancing temperature at ${this.temperature} °C and chloride concentration with precision.`;
      } else {
        feedback = `Equilibrium deviation: Reached ${this.bluePercent.toFixed(1)}% blue complex, whereas target was ${target.toFixed(1)}% ±${tol}%. Remember: higher temperature and chloride drive right (turn blue); cooling and water dilution drive left (turn pink).`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: Math.min(100, score),
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          finalBluePercent: this.bluePercent,
          targetBluePercent: target,
          finalTemperature: this.temperature,
          chlorideDrops: this.chlorideDrops
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
              <span>Blue Complex %</span>
              <strong style="color:#2563eb;">${res.parameters.finalBluePercent.toFixed(1)}%</strong>
            </div>
            <div class="metric-box">
              <span>Target %</span>
              <strong>${res.parameters.targetBluePercent.toFixed(1)}%</strong>
            </div>
            <div class="metric-box">
              <span>Final Temp</span>
              <strong>${res.parameters.finalTemperature} °C</strong>
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
        new CobaltEquilibriumSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new CobaltEquilibriumSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab07.js ---

// --- START challenge_case_lab08.js ---
/* ============================================================
   BALANCE Chemistry — Lab 08 Interactive Challenge Case
   "Gas Equilibrium Control" (2 NO2 (Brown) <=> N2O4 (Colorless) + Heat)
   Gas Syringe Compression Piston, Thermostat Bath, Instantaneous Optical Shift,
   Kinetic Relaxation Canvas, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab08 = (function() {
  'use strict';

  // 10 Procedural Syringe Gas Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Atmospheric Smog Clarification",
      targetNO2Percent: 12.0,
      tolerance: 4.0,
      briefing: "Clear the toxic brown nitrogen dioxide smog to <15% optical density: 2 NO2(g) (dark brown) <=> N2O4(g) (colorless) + 57.2 kJ. Compress the gas syringe (decrease volume) and submerge into a chilling cryo-bath to shift equilibrium toward colorless N2O4.",
      hint: "Compression increases pressure, shifting equilibrium to the side with fewer gas molecules (N2O4, 1 mole vs 2 moles). Cooling favors the exothermic forward dimerization."
    },
    {
      id: "mission_02",
      title: "Dinitrogen Tetroxide Dissociation",
      targetNO2Percent: 88.0,
      tolerance: 4.0,
      briefing: "Decompress the syringe and heat the gas mixture to >70 °C to dissociate dinitrogen tetroxide into intense dark reddish-brown nitrogen dioxide gas (>85% NO2).",
      hint: "Heating favors the endothermic reverse dissociation; expanding volume lowers pressure, driving the system toward the 2-mole brown NO2 side."
    },
    {
      id: "mission_03",
      title: "Instantaneous vs Relaxation Shift",
      targetNO2Percent: 30.0,
      tolerance: 5.0,
      briefing: "Execute a rapid compression from 100 mL down to 40 mL. Observe the immediate concentration darkening followed by the gradual chemical lightening as Le Chatelier shifts equilibrium.",
      hint: "Physical concentration change is instantaneous; chemical bond reformation requires molecular collisions over 2-4 seconds."
    },
    {
      id: "mission_04",
      title: "Cryo-Quench Boundary Lock",
      targetNO2Percent: 8.0,
      tolerance: 3.5,
      briefing: "Minimize optical absorbance by freezing the equilibrium mixture in an ice-salt bath (-10 °C) at maximum plunger compression (25 mL).",
      hint: "At -10 °C and high pressure, over 92% of gas molecules exist as dimerized colorless N2O4."
    },
    {
      id: "mission_05",
      title: "Isobaric Thermal Expansion",
      targetNO2Percent: 65.0,
      tolerance: 5.0,
      briefing: "Maintain constant pressure while heating from 20 °C to 60 °C. Adjust plunger position to keep pressure at 1.00 atm as gas expands.",
      hint: "Charles's law expansion combined with NO2 dissociation increases total mole count."
    },
    {
      id: "mission_06",
      title: "Isochoric Cooling Shift",
      targetNO2Percent: 20.0,
      tolerance: 4.0,
      briefing: "Lock the syringe volume at 50 mL and cool to 5 °C. Observe pressure drop and color fading simultaneously.",
      hint: "Converting 2 moles of NO2 into 1 mole of N2O4 decreases pressure inside the locked chamber."
    },
    {
      id: "mission_07",
      title: "Equimolar Colorimetric Calibration",
      targetNO2Percent: 50.0,
      tolerance: 4.0,
      briefing: "Fine-tune syringe volume and temperature to balance the mole fractions at exactly 50% NO2 and 50% N2O4.",
      hint: "Room temperature (~22 °C) at 60 mL syringe volume balances the two species."
    },
    {
      id: "mission_08",
      title: "High-Pressure Quench Verification",
      targetNO2Percent: 15.0,
      tolerance: 4.0,
      briefing: "Achieve rapid bleaching using compression only (without changing temperature from 20 °C). Compress to 30 mL.",
      hint: "High pressure alone forces dimerization by Boyle's law concentration increase."
    },
    {
      id: "mission_09",
      title: "Thermal Dissociation Kinetics",
      targetNO2Percent: 75.0,
      tolerance: 5.0,
      briefing: "Measure the rate of brown color intensification as heat flows through the syringe glass wall into the gas mixture.",
      hint: "Watch optical density climb smoothly as temperature reaches 55 °C."
    },
    {
      id: "mission_10",
      title: "Thermodynamic Enthalpy Audit",
      targetNO2Percent: 85.0,
      tolerance: 4.0,
      briefing: "Final Oxford MYP examination: maximize NO2 brown intensity to prove Delta H < 0 for the forward reaction.",
      hint: "Exothermic reactions are suppressed by high temperature, releasing brown NO2."
    }
  ];

  class GasEquilibriumSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB08_${attemptNumber}_${Date.now() % 10000}`;

      // Scientific State
      this.syringeVolume = 80; // mL (20 to 100)
      this.temperature = 22; // °C (-10 to 80)
      this.currentNO2Percent = 50.0;
      this.opticalDensity = 0.5;

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
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 08</span>
              <h2 class="mission-title">Gas Equilibrium: ${this.scenario.title}</h2>
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
            <!-- Left: Precision Gas Syringe Canvas -->
            <div class="canvas-panel">
              <canvas id="syringeCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Syringe Volume</span>
                  <strong id="readoutVol">80 mL</strong>
                </div>
                <div class="readout-item">
                  <span>Temperature</span>
                  <strong id="readoutT">22 °C</strong>
                </div>
                <div class="readout-item">
                  <span>NO2 (Brown)</span>
                  <strong id="readoutNO2" style="color:#b45309;">50%</strong>
                </div>
                <div class="readout-item">
                  <span>N2O4 (Colorless)</span>
                  <strong id="readoutN2O4" style="color:#0284c7;">50%</strong>
                </div>
              </div>
            </div>

            <!-- Right: Syringe Volume & Thermostat Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label for="volRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg> Syringe Plunger Position (Volume)</label>
                  <span class="control-val" id="volVal">80 mL</span>
                </div>
                <input type="range" id="volRange" min="20" max="100" step="5" value="80">
                <small class="control-note">Compression (smaller volume) shifts equilibrium to N2O4 (1 mole vs 2 moles NO2).</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label for="tempRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> Thermostat Bath Temperature</label>
                  <span class="control-val" id="tempVal">22 °C</span>
                </div>
                <input type="range" id="tempRange" min="-10" max="80" step="1" value="22">
                <small class="control-note">Exothermic Delta H = -57.2 kJ/mol: Low temperature shifts toward colorless N2O4.</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Le Chatelier Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Lock &amp; Submit Gas State</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const volRange = this.container.querySelector('#volRange');
      const volVal = this.container.querySelector('#volVal');
      volRange.oninput = (e) => {
        this.syringeVolume = parseInt(e.target.value, 10);
        volVal.textContent = `${this.syringeVolume} mL`;
        this.adjustmentsCount++;
        this.recalculateEquilibrium();
      };

      const tempRange = this.container.querySelector('#tempRange');
      const tempVal = this.container.querySelector('#tempVal');
      tempRange.oninput = (e) => {
        this.temperature = parseInt(e.target.value, 10);
        tempVal.textContent = `${this.temperature} °C`;
        this.adjustmentsCount++;
        this.recalculateEquilibrium();
      };

      this.container.querySelector('#hintBtn').onclick = () => {
        const box = this.container.querySelector('#chalHintBox');
        box.textContent = this.scenario.hint;
        box.classList.remove('hidden');
        this.adjustmentsCount++;
      };

      this.container.querySelector('#submitChallengeBtn').onclick = () => this.submitMission();
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

    recalculateEquilibrium() {
      // Le Chatelier gas equilibrium model:
      // T factor: higher T increases NO2 dissociation (+Delta H reverse)
      const tFactor = (this.temperature - 20) * 0.95;
      // Volume factor: higher V (lower P) increases NO2 (2 moles vs 1 mole)
      const vFactor = (this.syringeVolume - 50) * 0.65;

      const raw = 45 + tFactor + vFactor;
      this.currentNO2Percent = Math.max(3.0, Math.min(97.0, raw));

      // Optical density depends on concentration = moles / Volume
      const conc = (this.currentNO2Percent / this.syringeVolume) * 70;
      this.opticalDensity = Math.max(0.05, Math.min(0.95, conc / 100));

      this.updateReadouts();
    }

    updateReadouts() {
      const rVol = this.container.querySelector('#readoutVol');
      const rT = this.container.querySelector('#readoutT');
      const rNO2 = this.container.querySelector('#readoutNO2');
      const rN2O4 = this.container.querySelector('#readoutN2O4');

      if (rVol) rVol.textContent = `${this.syringeVolume} mL`;
      if (rT) rT.textContent = `${this.temperature} °C`;
      if (rNO2) rNO2.textContent = `${this.currentNO2Percent.toFixed(1)}%`;
      if (rN2O4) rN2O4.textContent = `${(100 - this.currentNO2Percent).toFixed(1)}%`;
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#syringeCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lab bench gradient
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Thermostat water bath background around syringe
        const bathX = 40;
        const bathY = 90;
        const bathW = 340;
        const bathH = 160;

        ctx.fillStyle = this.temperature > 40 ? 'rgba(254, 215, 170, 0.45)' : (this.temperature < 10 ? 'rgba(224, 242, 254, 0.5)' : 'rgba(241, 245, 249, 0.45)');
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(bathX, bathY, bathW, bathH);
        ctx.fillRect(bathX, bathY, bathW, bathH);

        // Glass Gas Syringe
        const sx = 60;
        const sy = 135;
        const maxSyringeLen = 220;
        const barrelH = 65;

        // Syringe barrel outline
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.strokeRect(sx, sy, maxSyringeLen, barrelH);

        // Syringe nozzle at left tip
        ctx.fillStyle = '#64748b';
        ctx.fillRect(sx - 18, sy + 22, 18, 20);

        // Plunger position: 20 mL to 100 mL
        const gasLen = (this.syringeVolume / 100) * maxSyringeLen;
        const plungerX = sx + gasLen;

        // Gas Chamber Color: Rich dark reddish-brown for NO2, fading to clear for N2O4
        // Color: rgba(146, 64, 14, alpha)
        const alpha = this.opticalDensity;
        ctx.fillStyle = `rgba(146, 64, 14, ${alpha})`;
        ctx.fillRect(sx + 1, sy + 1, gasLen - 1, barrelH - 2);

        // Plunger Seal Rubber Ring
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(plungerX - 6, sy + 2, 10, barrelH - 4);

        // Plunger Shaft
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(plungerX + 4, sy + 20, 85, 24);

        // Plunger Handle
        ctx.fillStyle = '#475569';
        ctx.fillRect(plungerX + 85, sy + 5, 12, barrelH - 10);

        // Graduation Marks on Syringe Glass
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        for (let v = 20; v <= 100; v += 10) {
          const gx = sx + (v / 100) * maxSyringeLen;
          ctx.beginPath();
          ctx.moveTo(gx, sy + 2);
          ctx.lineTo(gx, sy + 14);
          ctx.moveTo(gx, sy + barrelH - 14);
          ctx.lineTo(gx, sy + barrelH - 2);
          ctx.stroke();
        }

        // Live Optical Absorbance Readout Banner
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#78350f';
        ctx.textAlign = 'center';
        ctx.fillText(`Optical Density: ${(this.opticalDensity * 100).toFixed(0)}% Absorbance · Dynamic Equilibrium Steady`, canvas.width / 2, 60);

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

      const target = this.scenario.targetNO2Percent;
      const tol = this.scenario.tolerance;
      const delta = Math.abs(this.currentNO2Percent - target);
      const isWithinTolerance = delta <= tol;

      let score = 0;
      if (isWithinTolerance) {
        score = 85;
        if (delta <= tol * 0.5) score += 10;
        if (this.simulatedTime <= 60) score += 5;
      } else {
        score = Math.max(20, Math.round(70 - (delta - tol) * 3));
      }

      let feedback = "";
      if (isWithinTolerance) {
        feedback = `Masterful gas equilibrium control! You achieved ${this.currentNO2Percent.toFixed(1)}% NO2 (target: ${target.toFixed(1)}% ±${tol}%), balancing syringe compression (${this.syringeVolume} mL) and thermal thermostat (${this.temperature} °C) in accordance with Le Chatelier's principle.`;
      } else {
        feedback = `Equilibrium deviation: Reached ${this.currentNO2Percent.toFixed(1)}% NO2, target was ${target.toFixed(1)}% ±${tol}%. Remember: compression shifts to colorless N2O4 (fewer moles); cooling favors the exothermic forward reaction (turns colorless).`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: Math.min(100, score),
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          finalNO2Percent: this.currentNO2Percent,
          targetNO2Percent: target,
          syringeVolume: this.syringeVolume,
          temperature: this.temperature
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
              <span>NO2 %</span>
              <strong style="color:#b45309;">${res.parameters.finalNO2Percent.toFixed(1)}%</strong>
            </div>
            <div class="metric-box">
              <span>Target %</span>
              <strong>${res.parameters.targetNO2Percent.toFixed(1)}%</strong>
            </div>
            <div class="metric-box">
              <span>Syringe Volume</span>
              <strong>${res.parameters.syringeVolume} mL</strong>
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
        new GasEquilibriumSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new GasEquilibriumSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab08.js ---

// --- START challenge_case_lab09.js ---
/* ============================================================
   BALANCE Chemistry — Lab 09 Interactive Challenge Case
   "Industrial Optimization Mission" (The Haber-Bosch Ammonia Process)
   N2(g) + 3 H2(g) <=> 2 NH3(g) + 92 kJ/mol
   Reactor Temperature, Pressure, Catalyst & Recycle Ratio Controls,
   Animated Chemical Plant Flow Loop Canvas, Timer & Multi-Dimensional Scoring
   ============================================================ */

window.ChallengeLab09 = (function() {
  'use strict';

  // 10 Procedural Industrial Plant Scenarios
  const SCENARIOS = [
    {
      id: "mission_01",
      title: "Commercial Benchmark Production",
      targetDailyTons: 1200,
      maxAllowedPressure: 220,
      briefing: "Optimize the commercial Haber synthesis: achieve at least 1,200 metric tons/day of ammonia at lowest possible electricity cost. Balance the kinetic rate (demanding high temperature) against thermodynamic equilibrium yield (demanding low temperature and high pressure) using an iron catalyst and recycling loop.",
      hint: "Compromise conditions of 400-450 °C, 200 atm, iron catalyst, and 95% unreacted gas recycling yield optimal daily output."
    },
    {
      id: "mission_02",
      title: "High Safety Pressure Cap",
      targetDailyTons: 1000,
      maxAllowedPressure: 180,
      briefing: "An older reactor vessel has a maximum certified pressure cap of 180 bar. Optimize temperature and recycle loop efficiency to maintain >1,000 tons/day without triggering safety alarms.",
      hint: "Compensate for lower pressure by raising gas recycling to 98% and using promoted nano-iron catalyst."
    },
    {
      id: "mission_03",
      title: "Energy Crisis Cost Economy",
      targetDailyTons: 1100,
      maxAllowedPressure: 200,
      briefing: "Electricity rates increased by 40%. Minimize compression power while maintaining plant production above 1,100 tons/day.",
      hint: "Lowering pressure to 160 bar cuts compressor power; adjust temperature to 425 °C with full gas recycling."
    },
    {
      id: "mission_04",
      title: "Catalyst Aging Compensation",
      targetDailyTons: 1150,
      maxAllowedPressure: 240,
      briefing: "The iron catalyst bed has degraded by 25%. Adjust plant operating parameters to preserve contract output specifications.",
      hint: "A slight increase in operating pressure and temperature compensates for reduced catalyst surface area."
    },
    {
      id: "mission_05",
      title: "Peak Harvest Fertilizer Demand",
      targetDailyTons: 1500,
      maxAllowedPressure: 250,
      briefing: "Spring planting season demands maximum plant throughput (>1,450 tons/day). Maximize production safely using promoted nano-iron catalyst.",
      hint: "Use 240 bar, 440 °C, promoted catalyst, and 100% recycling."
    },
    {
      id: "mission_06",
      title: "Zero-Waste Atom Economy",
      targetDailyTons: 1200,
      maxAllowedPressure: 210,
      briefing: "Environmental regulations mandate >95% overall reactant conversion. Ensure the unreacted N2 and H2 recycling loop operates at peak recovery.",
      hint: "Recycling unreacted gas converts ~15% per pass into >98% overall plant conversion."
    },
    {
      id: "mission_07",
      title: "Cold-Start Reactor Commissioning",
      targetDailyTons: 900,
      maxAllowedPressure: 190,
      briefing: "Commission a freshly started reactor from 250 °C up to operating temperature. Settle steady-state synthesis.",
      hint: "The reaction rate is near zero below 350 °C because reactant molecules lack sufficient activation energy."
    },
    {
      id: "mission_08",
      title: "Promoted Nano-Iron Deployment",
      targetDailyTons: 1400,
      maxAllowedPressure: 230,
      briefing: "Evaluate high-surface-area nano-iron promoted with K2O and Al2O3. Determine the lowest temperature that maintains target output.",
      hint: "Advanced catalysts lower activation energy, enabling lower operating temperatures with higher equilibrium yields."
    },
    {
      id: "mission_09",
      title: "Equilibrium vs Kinetics Trade-off Audit",
      targetDailyTons: 1250,
      maxAllowedPressure: 220,
      briefing: "Demonstrate that neither 250 °C (too slow) nor 600 °C (equilibrium yield too low) can succeed. Find the golden compromise window.",
      hint: "400-450 °C represents the exact sweet spot between kinetics and thermodynamics."
    },
    {
      id: "mission_10",
      title: "Final Chemical Engineering Certification",
      targetDailyTons: 1300,
      maxAllowedPressure: 220,
      briefing: "Complete the full plant optimization certification against Oxford MYP criteria. Achieve target output, safety rating, and cost efficiency.",
      hint: "Balance thermodynamics (Le Chatelier), kinetics (Arrhenius rate), and engineering safety."
    }
  ];

  class HaberIndustrialSimulation {
    constructor(containerElement, attemptNumber = 1, onCompleteCallback = null) {
      this.container = containerElement;
      this.attemptNumber = attemptNumber;
      this.onComplete = onCompleteCallback;

      const scenarioIndex = (this.attemptNumber - 1) % SCENARIOS.length;
      this.scenario = SCENARIOS[scenarioIndex];
      this.seed = `SEED_LAB09_${attemptNumber}_${Date.now() % 10000}`;

      // Scientific & Engineering State
      this.temperature = 425; // °C (250 to 600)
      this.pressure = 200; // bar (50 to 300)
      this.selectedCatalyst = 'Magnetite'; // 'None', 'Magnetite', 'Promoted'
      this.recycleRatio = 90; // % (0 to 100)

      this.reactionRate = 0; // % / s
      this.equilibriumYieldPerPass = 0; // %
      this.dailyTons = 0; // Tons/day

      this.simulatedTime = 0;
      this.timerInterval = null;
      this.animFrame = null;
      this.adjustmentsCount = 0;
      this.isSubmitted = false;

      this.flowParticles = [];

      this.initUI();
      this.startTimer();
      this.startAnimationLoop();
    }

    initUI() {
      this.container.innerHTML = `
        <div class="challenge-mission-card">
          <div class="mission-header">
            <div>
              <span class="mission-tag">INTERACTIVE CHALLENGE · LAB 09</span>
              <h2 class="mission-title">Haber Process: ${this.scenario.title}</h2>
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
            <!-- Left: Flow Loop Schematic Canvas -->
            <div class="canvas-panel">
              <canvas id="plantCanvas" width="420" height="340"></canvas>
              <div class="live-readouts">
                <div class="readout-item">
                  <span>Daily Output</span>
                  <strong id="readoutTons" style="color:#16a34a;">0 Tons/day</strong>
                </div>
                <div class="readout-item">
                  <span>Equil. Yield</span>
                  <strong id="readoutYield">0%</strong>
                </div>
                <div class="readout-item">
                  <span>Reaction Rate</span>
                  <strong id="readoutRate">0% / s</strong>
                </div>
                <div class="readout-item">
                  <span>Safety Status</span>
                  <strong id="readoutSafety" style="color:#0284c7;">Optimal</strong>
                </div>
              </div>
            </div>

            <!-- Right: Reactor & Recycle Engineering Controls -->
            <div class="controls-panel">
              <div class="control-card">
                <div class="control-head">
                  <label for="tempRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> Reactor Temperature</label>
                  <span class="control-val" id="tempVal">425 °C</span>
                </div>
                <input type="range" id="tempRange" min="250" max="600" step="5" value="425">
                <small class="control-note">High T increases kinetic rate; low T increases thermodynamic equilibrium yield (Delta H < 0).</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label for="pressRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4-4 4M12 16V8"/></svg> Operating Pressure</label>
                  <span class="control-val" id="pressVal">200 bar</span>
                </div>
                <input type="range" id="pressRange" min="50" max="300" step="5" value="200">
                <small class="control-note">High pressure favors NH3 synthesis (4 moles -> 2 moles), but requires reinforced steel.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Catalyst Bed Selection</label>
                  <span class="control-val" id="catVal">Standard Magnetite (Fe3O4)</span>
                </div>
                <div class="stirrer-buttons">
                  <button type="button" class="stir-btn" data-cat="None">None</button>
                  <button type="button" class="stir-btn active" data-cat="Magnetite">Fe3O4 Iron</button>
                  <button type="button" class="stir-btn" data-cat="Promoted">Promoted Nano-Fe</button>
                </div>
                <small class="control-note">Catalyst accelerates rate without affecting equilibrium yield.</small>
              </div>

              <div class="control-card">
                <div class="control-head">
                  <label for="recycleRange"><svg class="inline-svg" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg> Unreacted Gas Recycle Loop</label>
                  <span class="control-val" id="recycleVal">90% Recycle</span>
                </div>
                <input type="range" id="recycleRange" min="0" max="100" step="5" value="90">
                <small class="control-note">Recycling unreacted N2 + H2 converts 15% per pass into >98% overall yield.</small>
              </div>

              <div class="challenge-actions">
                <button type="button" class="btn secondary" id="hintBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  <span>Engineering Hint</span>
                </button>
                <button type="button" class="btn primary" id="submitChallengeBtn">
                  <svg class="inline-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Lock &amp; Submit Plant Output</span>
                </button>
              </div>
              <div id="chalHintBox" class="hint-display hidden"></div>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const tempRange = this.container.querySelector('#tempRange');
      const tempVal = this.container.querySelector('#tempVal');
      tempRange.oninput = (e) => {
        this.temperature = parseInt(e.target.value, 10);
        tempVal.textContent = `${this.temperature} °C`;
        this.adjustmentsCount++;
        this.recomputePlantPhysics();
      };

      const pressRange = this.container.querySelector('#pressRange');
      const pressVal = this.container.querySelector('#pressVal');
      pressRange.oninput = (e) => {
        this.pressure = parseInt(e.target.value, 10);
        pressVal.textContent = `${this.pressure} bar`;
        this.adjustmentsCount++;
        this.recomputePlantPhysics();
      };

      const catBtns = this.container.querySelectorAll('[data-cat]');
      const catVal = this.container.querySelector('#catVal');
      catBtns.forEach(b => {
        b.onclick = () => {
          catBtns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.selectedCatalyst = b.dataset.cat;
          catVal.textContent = b.textContent;
          this.adjustmentsCount++;
          this.recomputePlantPhysics();
        };
      });

      const recycleRange = this.container.querySelector('#recycleRange');
      const recycleVal = this.container.querySelector('#recycleVal');
      recycleRange.oninput = (e) => {
        this.recycleRatio = parseInt(e.target.value, 10);
        recycleVal.textContent = `${this.recycleRatio}% Recycle`;
        this.adjustmentsCount++;
        this.recomputePlantPhysics();
      };

      this.container.querySelector('#hintBtn').onclick = () => {
        const box = this.container.querySelector('#chalHintBox');
        box.textContent = this.scenario.hint;
        box.classList.remove('hidden');
        this.adjustmentsCount++;
      };

      this.container.querySelector('#submitChallengeBtn').onclick = () => this.submitMission();
    }

    startTimer() {
      const timerEl = this.container.querySelector('#chalTimer');
      this.timerInterval = setInterval(() => {
        this.simulatedTime++;
        const mins = String(Math.floor(this.simulatedTime / 60)).padStart(2, '0');
        const secs = String(this.simulatedTime % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 1000);
      this.recomputePlantPhysics();
    }

    recomputePlantPhysics() {
      // 1. Thermodynamic Equilibrium Yield (%)
      // Delta H < 0 (favors low T). Fewer moles (favors high P).
      const tKelvin = this.temperature + 273.15;
      const tFactor = Math.max(0.02, 1.0 - (this.temperature - 250) / 450); // drops from 1.0 at 250C to 0.2 at 600C
      const pFactor = Math.pow(this.pressure / 200, 0.7);
      this.equilibriumYieldPerPass = Math.min(85, Math.max(3, tFactor * pFactor * 25));

      // 2. Kinetic Reaction Rate (mol / s)
      // Arrhenius rate: increases exponentially with T.
      let catMultiplier = 1.0;
      if (this.selectedCatalyst === 'None') catMultiplier = 0.08;
      else if (this.selectedCatalyst === 'Promoted') catMultiplier = 1.45;

      const kineticFactor = Math.pow((this.temperature - 200) / 250, 2.5);
      this.reactionRate = Math.min(95, Math.max(0.5, kineticFactor * (this.pressure / 150) * catMultiplier * 6));

      // 3. Overall Daily Output (Tons / day)
      // Overall Output = Rate * Yield * Recycle Efficiency
      const recycleFactor = 1.0 + (this.recycleRatio / 100) * 4.5;
      const combinedThroughput = (this.reactionRate / 50) * (this.equilibriumYieldPerPass / 15) * recycleFactor * 320;
      this.dailyTons = Math.round(combinedThroughput);

      this.updateReadouts();
    }

    updateReadouts() {
      const rTons = this.container.querySelector('#readoutTons');
      const rYield = this.container.querySelector('#readoutYield');
      const rRate = this.container.querySelector('#readoutRate');
      const rSafety = this.container.querySelector('#readoutSafety');

      if (rTons) rTons.textContent = `${this.dailyTons} Tons/day`;
      if (rYield) rYield.textContent = `${this.equilibriumYieldPerPass.toFixed(1)}%`;
      if (rRate) rRate.textContent = `${this.reactionRate.toFixed(1)}% / s`;
      if (rSafety) {
        if (this.pressure > this.scenario.maxAllowedPressure) {
          rSafety.textContent = "PRESSURE WARNING";
          rSafety.style.color = "#dc2626";
        } else if (this.temperature > 550) {
          rSafety.textContent = "THERMAL DEGRADATION";
          rSafety.style.color = "#f59e0b";
        } else {
          rSafety.textContent = "Optimal Operating Region";
          rSafety.style.color = "#16a34a";
        }
      }
    }

    startAnimationLoop() {
      const canvas = this.container.querySelector('#plantCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lab bench gradient
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Industrial Pipeline Loop:
        // 1. Compressor (Left, 50, 160)
        // 2. Catalytic Converter Reactor (Center, 170, 70)
        // 3. Condenser Chiller (Right, 310, 150)
        // 4. Ammonia Storage Tank (Bottom, 310, 260)
        // 5. Recycle Loop (Bottom returning to Compressor)

        // Draw Pipelines
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 6;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Compressor to Reactor
        ctx.moveTo(80, 170);
        ctx.lineTo(80, 110);
        ctx.lineTo(170, 110);
        // Reactor to Condenser
        ctx.moveTo(250, 110);
        ctx.lineTo(340, 110);
        ctx.lineTo(340, 150);
        // Condenser to Storage Tank
        ctx.moveTo(340, 210);
        ctx.lineTo(340, 260);
        // Recycle pipeline from Condenser back to Compressor
        ctx.moveTo(340, 180);
        ctx.lineTo(260, 180);
        ctx.lineTo(260, 240);
        ctx.lineTo(80, 240);
        ctx.lineTo(80, 190);
        ctx.stroke();

        // 1. Compressor Vessel
        ctx.fillStyle = '#334155';
        ctx.fillRect(50, 150, 60, 50);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 150, 60, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('COMPRESSOR', 80, 180);

        // 2. Catalytic Converter Reactor (Center)
        const rx = 170;
        const ry = 80;
        const rw = 80;
        const rh = 70;

        // Internal Reactor Bed Temperature Glow
        const tAlpha = Math.min(0.85, Math.max(0.2, (this.temperature - 250) / 350));
        ctx.fillStyle = `rgba(239, 68, 68, ${tAlpha})`;
        ctx.fillRect(rx, ry, rw, rh);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.strokeRect(rx, ry, rw, rh);

        // Catalyst bed representation inside reactor
        ctx.fillStyle = '#475569';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(rx + 10, ry + 15 + i * 12, rw - 20, 6);
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('CATALYST', rx + rw / 2, ry + rh / 2 + 3);

        // 3. Ammonia Condenser / Chiller
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(310, 150, 60, 60);
        ctx.strokeStyle = '#0369a1';
        ctx.strokeRect(310, 150, 60, 60);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('CONDENSER', 340, 185);

        // 4. Ammonia Storage Tank (Liquid NH3)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(340, 270, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#047857';
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('NH3 LIQ', 340, 273);

        // Animated Gas Flow Particles along pipelines
        if (Math.random() < 0.4) {
          this.flowParticles.push({
            x: 80,
            y: 150,
            targetNode: 1,
            color: '#38bdf8'
          });
        }

        for (let p = this.flowParticles.length - 1; p >= 0; p--) {
          const pt = this.flowParticles[p];
          if (pt.targetNode === 1) {
            pt.y -= 2.5;
            if (pt.y <= 110) pt.targetNode = 2;
          } else if (pt.targetNode === 2) {
            pt.x += 2.5;
            if (pt.x >= 250) pt.targetNode = 3;
          } else if (pt.targetNode === 3) {
            pt.x += 2.5;
            if (pt.x >= 340) pt.targetNode = 4;
          } else if (pt.targetNode === 4) {
            pt.y += 2.5;
            if (pt.y >= 260) {
              this.flowParticles.splice(p, 1);
              continue;
            }
          }

          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Telemetry readout banner on canvas
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText(`Target Contract: ${this.scenario.targetDailyTons} Tons/day · Safety Limit: ${this.scenario.maxAllowedPressure} bar`, canvas.width / 2, 35);

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

      const targetTons = this.scenario.targetDailyTons;
      const isOverpressured = this.pressure > this.scenario.maxAllowedPressure;
      const outputRatio = this.dailyTons / targetTons;

      let score = 0;
      if (isOverpressured) {
        score = 40;
      } else {
        score = Math.min(85, Math.round(outputRatio * 75));
        if (outputRatio >= 1.0) score += 10;
        if (this.simulatedTime <= 75) score += 5;
      }

      let feedback = "";
      if (score >= 75) {
        feedback = `Masterful chemical plant optimization! You delivered ${this.dailyTons} metric tons/day (contract target: ${targetTons} tons/day) under safe pressure (${this.pressure} bar vs max ${this.scenario.maxAllowedPressure} bar). You engineered the optimal compromise between reaction kinetics and thermodynamic equilibrium!`;
      } else {
        feedback = `Production deficit: Plant output is ${this.dailyTons} tons/day (target: ${targetTons} tons/day). ${isOverpressured ? 'CRITICAL: Operating pressure exceeded maximum safety limit!' : ''} Balance temperature around 400-450 °C, ensure catalyst is active, and maximize the unreacted gas recycling ratio to achieve commercial yield.`;
      }

      const results = {
        scenarioId: this.scenario.id,
        scenarioSeed: this.seed,
        score: Math.min(100, score),
        timeSeconds: this.simulatedTime,
        actionsCount: this.adjustmentsCount,
        parameters: {
          dailyOutputTons: this.dailyTons,
          targetDailyTons: targetTons,
          operatingPressure: this.pressure,
          reactorTemp: this.temperature,
          recycleRatio: this.recycleRatio
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
              <span>Daily Output</span>
              <strong style="color:#16a34a;">${res.parameters.dailyOutputTons} Tons/day</strong>
            </div>
            <div class="metric-box">
              <span>Target Output</span>
              <strong>${res.parameters.targetDailyTons} Tons/day</strong>
            </div>
            <div class="metric-box">
              <span>Plant Pressure</span>
              <strong style="color:${res.parameters.operatingPressure > 220 ? '#dc2626' : '#0284c7'};">${res.parameters.operatingPressure} bar</strong>
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
        new HaberIndustrialSimulation(this.container, this.attemptNumber + 1, this.onComplete);
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
      return new HaberIndustrialSimulation(containerElement, attemptNumber, onCompleteCallback);
    },
    getScenariosCount: function() {
      return SCENARIOS.length;
    }
  };
})();

// --- END challenge_case_lab09.js ---


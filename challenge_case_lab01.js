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

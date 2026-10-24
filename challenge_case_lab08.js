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

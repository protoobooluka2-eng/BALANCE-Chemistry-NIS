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

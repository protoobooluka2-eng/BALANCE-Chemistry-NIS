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

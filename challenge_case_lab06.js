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

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

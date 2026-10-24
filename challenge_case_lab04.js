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

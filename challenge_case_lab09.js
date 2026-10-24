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

/* ============================================================
   BALANCE Chemistry — Full Intelligent AI Teacher Architecture
   Components:
     1. LiveTutorProvider Interface & GeminiLiveAdapter (Google GenAI Live SDK / WebSocket)
     2. CompliantHybridTutorProvider (Compliance-Gated Rollout & Provider Abstraction)
     3. ScientificStateEngine (Grounded Chemical Laws & Simulation Source of Truth)
     4. HybridNarrationOrchestrator (Route A Cached vs Route B Live AI Decision Matrix)
     5. AudioPlaybackManager (9 States, Sub-Millisecond Barge-In Interruption, Single Audible Source)
     6. Student Voice & Text Inquiry Interface (Permission-Gated Microphone + Text Fallback)
     7. Teacher Dashboard Pedagogical Misconception & Usage Analytics
   ============================================================ */

// -------------------------------------------------------------
// Component State Machine Enums
// -------------------------------------------------------------
const TutorState = {
  DISABLED: 'DISABLED',
  ACTIVE_IDLE: 'ACTIVE_IDLE',
  LISTENING: 'LISTENING',
  RESOLVING: 'RESOLVING',
  PLAYING_CACHED_AUDIO: 'PLAYING_CACHED_AUDIO',
  STREAMING_AI_AUDIO: 'STREAMING_AI_AUDIO',
  INTERRUPTING: 'INTERRUPTING',
  RECOVERING: 'RECOVERING',
  OFFLINE_FALLBACK: 'OFFLINE_FALLBACK'
};

// -------------------------------------------------------------
// Component B: Scientific State Engine
// Maintains verified chemical and experimental state across all 9 labs
// -------------------------------------------------------------
class ScientificStateEngine {
  constructor() {
    this.resetAll();
  }

  resetAll() {
    this.labStates = {
      lab01: {
        phase: 'intro',
        crystalMoved: false,
        crystalInWater: false,
        dissolvingActive: false,
        microViewActive: false,
        inspectedIons: { na: false, cl: false },
        quizAttempted: false,
        quizPassed: false,
        massConserved: true,
        version: 1
      },
      lab02: {
        tubes: [
          { ion: 'Cu2+', reagentAdded: false, precipitate: null, color: null },
          { ion: 'Fe2+', reagentAdded: false, precipitate: null, color: null },
          { ion: 'Fe3+', reagentAdded: false, precipitate: null, color: null }
        ],
        pipetteSelected: false,
        allTested: false,
        version: 1
      },
      lab03: {
        equation: 'Fe + O2 -> Fe2O3',
        coefficients: { Fe: 1, O2: 1, Fe2O3: 1 },
        atomCounts: { left: { Fe: 1, O: 2 }, right: { Fe: 2, O: 3 } },
        isBalanced: false,
        microView: false,
        version: 1
      },
      lab04: {
        ammoniaAddedMl: 0,
        isNeutralized: false,
        evaporating: false,
        crystalsFormed: false,
        temperatureC: 25,
        version: 1
      },
      lab05: {
        coolingCollar: false,
        heaterTempC: 25,
        decomposed: false,
        recombined: false,
        reversibilityProven: false,
        microZone: null,
        version: 1
      },
      lab06: {
        naohAdded: false,
        heated: false,
        litmusTested: false,
        litmusBlue: false,
        hclTested: false,
        whiteSmokeFormed: false,
        version: 1
      },
      lab07: {
        reagentAdded: null,
        complexState: 'pink_hydrated', // or 'blue_chloride'
        pinkObserved: false,
        blueObserved: false,
        equilibriumShift: 'none',
        version: 1
      },
      lab08: {
        temperatureBath: 'none',
        temperatureC: 25,
        dominantGas: 'equimolar', // 'brown_no2' or 'colourless_n2o4'
        microActive: false,
        version: 1
      },
      lab09: {
        catalystActive: false,
        pressureAtm: 100,
        temperatureC: 300,
        ammoniaYield: 15,
        reactionRate: 'slow',
        optimalReached: false,
        version: 1
      }
    };
  }

  getLabState(labId) {
    return this.labStates[labId] || { version: 1 };
  }

  update(event) {
    const lab = event.labId || 'lab01';
    const state = this.labStates[lab];
    if (!state) return { lab, stateVersion: 1 };

    state.version = (state.version || 1) + 1;
    const id = event.actionId || event.type;

    if (lab === 'lab01') {
      if (id === 'crystal_drag_start') state.crystalMoved = true;
      if (id === 'crystal_dropped') state.crystalInWater = true;
      if (id === 'dissolving_started') state.dissolvingActive = true;
      if (id === 'micro_entered') state.microViewActive = true;
      if (id === 'ion_tap_na') state.inspectedIons.na = true;
      if (id === 'ion_tap_cl') state.inspectedIons.cl = true;
      if (id === 'quiz_correct') state.quizPassed = true;
    } else if (lab === 'lab02') {
      if (id === 'pipette_drag_start') state.pipetteSelected = true;
      if (id === 'pipette_dispensed') {
        const t = event.value !== null && event.value !== undefined ? event.value : 0;
        if (state.tubes[t]) state.tubes[t].reagentAdded = true;
      }
      if (id === 'precipitate_copper') {
        state.tubes[0].precipitate = 'Cu(OH)2';
        state.tubes[0].color = 'blue';
      }
      if (id === 'precipitate_iron_2') {
        state.tubes[1].precipitate = 'Fe(OH)2';
        state.tubes[1].color = 'green';
      }
      if (id === 'precipitate_iron_3') {
        state.tubes[2].precipitate = 'Fe(OH)3';
        state.tubes[2].color = 'brown';
      }
      if (id === 'all_tubes_tested') state.allTested = true;
    } else if (lab === 'lab03') {
      if (id === 'coefficient_increased' || id === 'coefficient_decreased') {
        if (event.target && state.coefficients[event.target] !== undefined) {
          state.coefficients[event.target] = event.value || state.coefficients[event.target];
        }
      }
      if (id === 'equation_balanced') state.isBalanced = true;
      if (id === 'micro_entered') state.microView = true;
    } else if (lab === 'lab04') {
      if (id === 'ammonia_added') state.ammoniaAddedMl = event.value || 50;
      if (id === 'neutralization_complete') state.isNeutralized = true;
      if (id === 'temp_slider_changed') state.temperatureC = event.value || 65;
      if (id === 'crystals_formed') state.crystalsFormed = true;
    } else if (lab === 'lab05') {
      if (id === 'collar_attached') state.coolingCollar = true;
      if (id === 'burner_temp_changed') state.heaterTempC = event.value || 340;
      if (id === 'decomposition_started') state.decomposed = true;
      if (id === 'recombination_solid_formed') state.recombined = true;
      if (state.decomposed && state.recombined) state.reversibilityProven = true;
    } else if (lab === 'lab06') {
      if (id === 'naoh_drop_added') state.naohAdded = true;
      if (id === 'heat_slider_changed') state.heated = true;
      if (id === 'litmus_tested') { state.litmusTested = true; state.litmusBlue = true; }
      if (id === 'hcl_tested') { state.hclTested = true; state.whiteSmokeFormed = true; }
    } else if (lab === 'lab07') {
      if (id === 'reagent_added') {
        if (event.reagent === 'water' || event.shift === 'pink') {
          state.complexState = 'pink_hydrated';
          state.pinkObserved = true;
          state.equilibriumShift = 'left_exothermic';
        } else {
          state.complexState = 'blue_chloride';
          state.blueObserved = true;
          state.equilibriumShift = 'right_endothermic';
        }
      }
    } else if (lab === 'lab08') {
      if (id === 'bath_applied') state.temperatureBath = event.bath || 'cold';
      if (id === 'temp_slider_changed') {
        state.temperatureC = event.value || 25;
        state.dominantGas = state.temperatureC > 45 ? 'brown_no2' : (state.temperatureC < 20 ? 'colourless_n2o4' : 'equimolar');
      }
      if (id === 'micro_entered') state.microActive = true;
    } else if (lab === 'lab09') {
      if (id === 'catalyst_toggled') state.catalystActive = true;
      if (id === 'pressure_slider_changed') state.pressureAtm = event.value || 100;
      if (id === 'temperature_slider_changed') state.temperatureC = event.value || 300;
      if (id === 'optimal_conditions_reached') state.optimalReached = true;
    }

    return { lab, stateVersion: state.version, snapshot: JSON.parse(JSON.stringify(state)) };
  }
}

// -------------------------------------------------------------
// Component 1 & 2: Provider Abstraction & Compliance Gate
// -------------------------------------------------------------
class LiveTutorProvider {
  async connect(config) {}
  async sendLabState(state) {}
  async sendStudentAction(action) {}
  async sendStudentAudio(chunk) {}
  async interrupt(reason) {}
  async disconnect() {}
  onAudio(callback) {}
  onError(callback) {}
}

class GeminiLiveAdapter extends LiveTutorProvider {
  constructor(schoolId, backendUrl = '') {
    super();
    this.schoolId = schoolId;
    this.backendUrl = backendUrl || window.location.origin;
    this.ws = null;
    this.sessionId = null;
    this.audioCallback = null;
    this.errorCallback = null;
    this.connected = false;
  }

  async connect(config = {}) {
    try {
      // 1. Authenticate with backend & provision ephemeral session
      const res = await fetch(`${this.backendUrl}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: this.schoolId,
          role: config.role || 'student',
          ageGroup: config.ageGroup || 'under_18',
          isDeveloperDemo: config.isDeveloperDemo || false
        })
      });
      const data = await res.json();
      this.sessionId = data.sessionId;
      this.tutorMode = data.tutorMode;
      this.liveAiPermitted = data.liveAiPermitted;

      // 2. Open streaming WebSocket bridge if live AI permitted
      if (this.liveAiPermitted) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/tutor/live`;
        this.ws = new WebSocket(wsUrl);
        
        await new Promise((resolve, reject) => {
          this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
              type: 'INIT_SESSION',
              sessionId: this.sessionId,
              schoolId: this.schoolId
            }));
            this.connected = true;
            resolve();
          };
          this.ws.onerror = (e) => reject(e);
          setTimeout(() => resolve(), 1500); // gracefully timeout to cached mode
        });

        this.ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.type === 'AI_EXPLANATION_STREAM' && this.audioCallback) {
              this.audioCallback(msg.text, msg.fallbackClip);
            }
          } catch(err) {}
        };
      }
    } catch (err) {
      this.connected = false;
      if (this.errorCallback) this.errorCallback(err);
    }
  }

  async sendLabState(state) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'LAB_STATE_UPDATE',
        sessionId: this.sessionId,
        labId: state.lab,
        state: state.snapshot,
        stateVersion: state.stateVersion
      }));
    }
  }

  async sendStudentAction(action) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'STUDENT_ACTION',
        sessionId: this.sessionId,
        action: action
      }));
    }
  }

  async sendStudentQuestion(labId, state, question) {
    // Send to backend REST/Live bridge
    try {
      const res = await fetch(`${this.backendUrl}/api/tutor/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          schoolId: this.schoolId,
          labId: labId,
          question: question,
          labState: state
        })
      });
      return await res.json();
    } catch(e) {
      return { status: 'fallback', response: 'Observe the active simulation carefully to see the chemical shift.' };
    }
  }

  async interrupt(reason = 'barge_in') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'BARGE_IN_INTERRUPT',
        sessionId: this.sessionId,
        reason: reason
      }));
    }
  }

  async disconnect() {
    if (this.ws) {
      try { this.ws.close(); } catch(e) {}
      this.ws = null;
    }
    this.connected = false;
  }

  onAudio(callback) { this.audioCallback = callback; }
  onError(callback) { this.errorCallback = callback; }
}

// -------------------------------------------------------------
// Component 3 & 5: Hybrid Narration Orchestrator & Audio Manager
// -------------------------------------------------------------
class HybridNarrationOrchestrator {
  constructor(schoolId = 'NIS') {
    this.schoolId = schoolId;
    this.narratorEnabled = false;
    this.state = TutorState.DISABLED;
    this.activeLab = 0;
    this.generation = 0;
    this.currentAudio = null;
    this.currentClipKey = null;
    this.completedClips = new Set();
    this.hadMistake = false;

    // Subsystems
    this.stateEngine = new ScientificStateEngine();
    this.provider = new GeminiLiveAdapter(schoolId);

    // Rate limiting & batching
    this.actionBatchTimer = null;
    this.recentActions = [];
    this.previousAudioName = 'none';

    // Inquiry Voice UI state
    this.isListening = false;
    this.mediaRecorder = null;
  }

  async init() {
    await this.provider.connect({ role: 'student', ageGroup: 'under_18' });
  }

  transitionState(newState) {
    this.state = newState;
    this.updateUI();
  }

  updateUI() {
    const playBtn = el('narrateButton');
    if (playBtn) {
      const isPlaying = !!this.narratorEnabled;
      const playSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
      const stopSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>`;
      playBtn.innerHTML = `
        <span class="narrate-icon">${isPlaying ? stopSvg : playSvg}</span>
        <span class="narrate-label-full">${isPlaying ? 'Stop Explanation' : 'Play Explanation'}</span>
        <span class="narrate-label-short">${isPlaying ? 'Stop' : 'Play'}</span>
      `;
      if (isPlaying) {
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-pressed', 'true');
        playBtn.title = 'Stop Explanation';
      } else {
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-pressed', 'false');
        playBtn.title = 'Play Explanation';
      }
    }

    const statusEl = el('narrationStatus');
    if (!statusEl) return;

    if (!this.narratorEnabled) {
      statusEl.textContent = 'Interactive teacher paused. Press Play to start guidance.';
      return;
    }

    switch (this.state) {
      case TutorState.ACTIVE_IDLE:
        statusEl.textContent = 'Teacher observing: Watching your experiment...';
        break;
      case TutorState.RESOLVING:
        statusEl.textContent = 'Teacher observing: Analyzing student action...';
        break;
      case TutorState.LISTENING:
        statusEl.textContent = 'Teacher listening: Speak your Chemistry question...';
        break;
      case TutorState.PLAYING_CACHED_AUDIO:
        // Maintained by audio play callback
        break;
      case TutorState.STREAMING_AI_AUDIO:
        statusEl.textContent = 'Teacher explaining (Live AI Guidance)...';
        break;
      case TutorState.INTERRUPTING:
        statusEl.textContent = 'Teacher observing: Adapting to new action...';
        break;
      case TutorState.RECOVERING:
      case TutorState.OFFLINE_FALLBACK:
        statusEl.textContent = 'Teacher observing: Ready for next action.';
        break;
      default:
        break;
    }
  }

  safelyStopAudio(audio) {
    if (!audio) return;
    try {
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
    } catch (e) {}
    try {
      const p = audio.pause();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) {}
    try { audio.currentTime = 0; } catch (e) {}
    try { audio.removeAttribute('src'); audio.load(); } catch (e) {}
  }

  interruptCurrentAudio(reason = 'barge_in') {
    this.generation++;
    this.provider.interrupt(reason);
    if (this.currentAudio) {
      this.previousAudioName = this.currentClipKey || 'active_audio';
      this.transitionState(TutorState.INTERRUPTING);
      this.safelyStopAudio(this.currentAudio);
      this.currentAudio = null;
      this.currentClipKey = null;
    } else {
      this.previousAudioName = 'none';
    }
  }

  resolveAudioClip(clipKey) {
    return [
      `audio/${clipKey}.mp3`,
      `audio/${clipKey}.wav`,
      `${clipKey}.mp3`,
      `${clipKey}.wav`
    ];
  }

  playCachedClip(clipKey, token, onPlaying, onEnded, onError) {
    const candidates = this.resolveAudioClip(clipKey);
    let idx = 0;
    const self = this;

    function tryNext() {
      if (token !== self.generation || !self.narratorEnabled) return;
      if (idx >= candidates.length) {
        if (onError) onError();
        return;
      }
      const src = candidates[idx++];
      const audio = new Audio();
      audio._clipKey = clipKey;
      self.currentAudio = audio;
      self.currentClipKey = clipKey;

      audio.onplay = () => {
        if (token === self.generation && self.narratorEnabled) {
          if (onPlaying) onPlaying();
        }
      };

      audio.onended = () => {
        if (token === self.generation) {
          self.currentAudio = null;
          self.currentClipKey = null;
          if (onEnded) onEnded();
        }
      };

      audio.onerror = () => {
        if (token === self.generation) tryNext();
      };

      audio.src = src;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (token === self.generation) tryNext();
        });
      }
    }

    tryNext();
  }

  // -------------------------------------------------------------
  // Decision Matrix: Route A (Cached) vs Route B (Live AI)
  // -------------------------------------------------------------
  routeAction(event, labState, wasAggregated = false) {
    const id = event.actionId || event.type;
    const lab = event.labId || 'lab01';

    // Route A: Predictable milestones & actions (High performance cached neural library)
    const cachedMapping = this.resolveAdaptiveNarration(event, wasAggregated);
    if (cachedMapping) {
      return { route: 'CACHED', mapping: cachedMapping };
    }

    // Outcome Tier 3 Fallbacks
    const fallbackMapping = this.resolveFallbackNarration(event);
    if (fallbackMapping) {
      return { route: 'CACHED', mapping: fallbackMapping };
    }

    // Route B: Unexpected valid multi-variable exploration
    if (event.outcome === 'VALID_EXPLORATION' && this.provider.liveAiPermitted) {
      return { route: 'LIVE_AI', context: labState };
    }

    // Tier 4: Deliberate Silence
    return { route: 'SILENCE' };
  }

  resolveAdaptiveNarration(event, wasAggregated = false) {
    const id = event.actionId || event.type;
    const lab = event.labId;

    if (wasAggregated) {
      if (lab === 'lab01' && (event.observation === 'particle_lattice_separation' || id === 'micro_entered')) {
        return { clipKey: 'fast_salt_dissolve_micro', statusText: 'Salt dissolving into aqueous ions (Micro view)' };
      }
      if (lab === 'lab02') {
        if (id && id.startsWith('precipitate_')) return { clipKey: 'fast_precipitate_formed', statusText: 'Precipitate formed rapidly!' };
        if (id === 'pipette_dispensed') return { clipKey: 'fast_reagent_added', statusText: 'Reagent transferred rapidly' };
      }
      if (lab === 'lab03' && id === 'equation_balanced') {
        return { clipKey: 'fast_balance_micro', statusText: 'Equation balanced rapidly! Viewing molecular model' };
      }
      if (id === 'temp_slider_changed' || id === 'temperature_slider_changed' || id === 'burner_temp_changed') {
        return { clipKey: 'fast_temp_changed', statusText: 'Rapid temperature adjustment detected' };
      }
    }

    // LAB 01
    if (lab === 'lab01') {
      if (id === 'crystal_drag_start') return { clipKey: 'lab01_incomplete_drag', statusText: 'Moving salt crystal to beaker' };
      if (id === 'crystal_drop_failed') return { clipKey: 'general_drop_outside', statusText: 'Crystal released outside beaker', allowRepeat: true };
      if (id === 'crystal_dropped') return { clipKey: 'lab01_success_crystal_in_water', statusText: 'Salt crystal dropped into water' };
      if (id === 'dissolving_started') return { clipKey: 'lab01_dissolve', statusText: 'Observing salt crystal dissolving' };
      if (id === 'micro_entered') return { clipKey: 'lab01_micro', statusText: 'Exploring ions at particle level' };
      if (id === 'ion_tap_na') return { clipKey: 'lab01_ion_na', statusText: 'Sodium ion hydration shell', allowRepeat: true };
      if (id === 'ion_tap_cl') return { clipKey: 'lab01_ion_cl', statusText: 'Chloride ion hydration shell', allowRepeat: true };
      if (id === 'quiz_incorrect') return { clipKey: 'lab01_wrong_answer', statusText: 'Explaining particle conservation', allowRepeat: true };
      if (id === 'quiz_correct') return { clipKey: 'lab01_complete', statusText: 'Investigation completed — mass is conserved' };
    }
    // LAB 02
    if (lab === 'lab02') {
      if (id === 'pipette_drag_start') return { clipKey: 'general_pickup_pipette', statusText: 'Pipette selected' };
      if (id === 'pipette_drop_failed') return { clipKey: 'lab02_drop_outside', statusText: 'Pipette dropped outside tubes', allowRepeat: true };
      if (id === 'pipette_dispensed') return { clipKey: 'lab02_success_reagent_added', statusText: 'Sodium hydroxide added' };
      if (id === 'precipitate_copper') return { clipKey: 'lab02_cu', statusText: 'Light blue copper(II) hydroxide precipitate' };
      if (id === 'precipitate_iron_2') return { clipKey: 'lab02_fe2', statusText: 'Green iron(II) hydroxide precipitate' };
      if (id === 'precipitate_iron_3') return { clipKey: 'lab02_fe3', statusText: 'Rust-brown iron(III) hydroxide precipitate' };
      if (id === 'all_tubes_tested') return { clipKey: 'lab02_complete', statusText: 'All metal ions identified!' };
    }
    // LAB 03
    if (lab === 'lab03') {
      if (id === 'tile_drag_start') return { clipKey: 'lab03_pickup_tile', statusText: 'Formula tile selected' };
      if (id === 'tile_wrong_side') return { clipKey: 'lab03_wrong_side', statusText: 'Formula placed on wrong side', allowRepeat: true };
      if (id === 'tile_dropped') return { clipKey: 'lab03_success_tile_added', statusText: 'Formula tile placed' };
      if (id === 'coefficient_increased' || id === 'coefficient_decreased') {
        return { clipKey: 'lab03_adjust', statusText: `Adjusting coefficient for ${event.target || 'species'}`, allowRepeat: true };
      }
      if (id === 'equation_balanced') return { clipKey: 'lab03_balanced', statusText: 'Chemical equation balanced!' };
      if (id === 'equation_unbalanced') return { clipKey: 'lab03_unbalanced', statusText: 'Equation unbalanced — check atom counts' };
      if (id === 'micro_entered') return { clipKey: 'lab03_micro', statusText: 'Viewing balanced molecular model' };
    }
    // LAB 04
    if (lab === 'lab04') {
      if (id === 'tool_drag_start') return { clipKey: 'general_pickup_tool', statusText: 'Equipment selected' };
      if (id === 'ammonia_added') {
        if (event.value < 50) return { clipKey: 'lab04_incomplete_neutralize', statusText: 'Adding ammonia to neutralize nitric acid' };
        return { clipKey: 'lab04_success_neutralized', statusText: 'Neutralization complete' };
      }
      if (id === 'neutralization_complete') return { clipKey: 'lab04_success_neutralized', statusText: 'Neutralization complete — ready to concentrate' };
      if (id === 'temp_slider_changed') return { clipKey: 'lab04_heat', statusText: 'Evaporating water to concentrate solution' };
      if (id === 'crystals_formed') return { clipKey: 'lab04_crystals', statusText: 'Ammonium nitrate fertilizer crystals formed!' };
      if (id === 'micro_entered') return { clipKey: 'lab04_crystals', statusText: 'Viewing crystal lattice' };
    }
    // LAB 05
    if (lab === 'lab05') {
      if (id === 'collar_drag_start') return { clipKey: 'lab05_pickup_collar', statusText: 'Cooling collar selected' };
      if (id === 'collar_drop_failed') return { clipKey: 'general_drop_outside', statusText: 'Collar dropped outside tube', allowRepeat: true };
      if (id === 'collar_attached') return { clipKey: 'lab05_success_collar_attached', statusText: 'Cooling collar attached to tube' };
      if (id === 'burner_temp_changed') return { clipKey: 'lab05_heat', statusText: 'Heating ammonium chloride' };
      if (id === 'decomposition_started') return { clipKey: 'lab05_success_decomposing', statusText: 'Thermal decomposition into NH₃ and HCl' };
      if (id === 'recombination_solid_formed') return { clipKey: 'lab05_cool', statusText: 'Recombination into solid NH₄Cl in cool zone' };
      if (id === 'micro_view_hot') return { clipKey: 'lab05_micro_hot', statusText: 'Hot zone: NH₃ + HCl gases' };
      if (id === 'micro_view_cool') return { clipKey: 'lab05_micro_cool', statusText: 'Cool zone: solid NH₄Cl reforming' };
    }
    // LAB 06
    if (lab === 'lab06') {
      if (id === 'tool_drag_start') {
        if (event.target === 'litmus') return { clipKey: 'lab06_pickup_litmus', statusText: 'Selecting damp red litmus' };
        if (event.target === 'hcl') return { clipKey: 'lab06_pickup_hcl', statusText: 'Selecting HCl-tipped glass rod' };
        return { clipKey: 'general_pickup_pipette', statusText: 'Selecting reagent pipette' };
      }
      if (id === 'tool_drop_failed') return { clipKey: 'general_drop_outside', statusText: 'Reagent dropped outside tube', allowRepeat: true };
      if (id === 'naoh_drop_added') return { clipKey: 'lab06_naoh', statusText: 'Adding sodium hydroxide to sample' };
      if (id === 'heat_slider_changed') return { clipKey: 'lab06_02', statusText: 'Gentle heating to liberate ammonia gas' };
      if (id === 'litmus_tested') return { clipKey: 'lab06_litmus_blue', statusText: 'Damp red litmus turns BLUE (alkaline ammonia)' };
      if (id === 'hcl_tested') return { clipKey: 'lab06_hcl_fumes', statusText: 'White ammonium chloride smoke confirms NH₄⁺' };
    }
    // LAB 07
    if (lab === 'lab07') {
      if (id === 'reagent_drag_start') return { clipKey: 'lab07_pickup_reagent', statusText: 'Selecting equilibrium reagent' };
      if (id === 'reagent_drop_failed') return { clipKey: 'general_drop_outside', statusText: 'Reagent dropped outside beaker', allowRepeat: true };
      if (id === 'reagent_added') {
        if (event.reagent === 'water' || event.shift === 'pink') return { clipKey: 'lab07_water', statusText: 'Adding water: shift towards pink complex' };
        if (event.reagent === 'chloride' || event.shift === 'blue') return { clipKey: 'lab07_chloride', statusText: 'Adding chloride: shift towards blue complex' };
        return { clipKey: 'lab07_success_reagent', statusText: 'Equilibrium shifted by reagent' };
      }
      if (id === 'both_shifts_observed') return { clipKey: 'lab07_03', statusText: 'Reversible equilibrium demonstrated in both directions' };
      if (id === 'micro_complex_pink') return { clipKey: 'lab07_cold', statusText: 'Cooling favours pink hydrated cobalt complex' };
      if (id === 'micro_complex_blue') return { clipKey: 'lab07_hot', statusText: 'Heating favours blue tetrachloro cobalt complex' };
    }
    // LAB 08
    if (lab === 'lab08') {
      if (id === 'bath_drag_start') return { clipKey: 'lab08_pickup_bath', statusText: 'Selecting temperature bath' };
      if (id === 'bath_drop_failed') return { clipKey: 'general_drop_outside', statusText: 'Bath dropped outside tube', allowRepeat: true };
      if (id === 'bath_applied') {
        if (event.bath === 'hot') return { clipKey: 'lab08_hot', statusText: 'Hot bath: shift towards brown NO₂ gas' };
        if (event.bath === 'cold') return { clipKey: 'lab08_cold', statusText: 'Cold bath: shift towards colourless N₂O₄ gas' };
        return { clipKey: 'lab08_exploration_bath', statusText: 'Temperature bath applied to gas syringe' };
      }
      if (id === 'temp_slider_changed') {
        if (event.value > 45) return { clipKey: 'lab08_hot', statusText: `High temperature (${event.value}°C): dark brown NO₂ gas` };
        if (event.value < 20) return { clipKey: 'lab08_cold', statusText: `Low temperature (${event.value}°C): colourless N₂O₄ gas` };
        return { clipKey: 'lab08_success_temp', statusText: `Temperature set to ${event.value}°C` };
      }
      if (id === 'micro_entered') return { clipKey: 'lab08_micro', statusText: 'Observing NO₂ ⇌ N₂O₄ molecular equilibrium' };
    }
    // LAB 09
    if (lab === 'lab09') {
      if (id === 'catalyst_drag_start') return { clipKey: 'general_pickup_tool', statusText: 'Selecting iron catalyst cartridge' };
      if (id === 'catalyst_toggled') return { clipKey: 'lab09_success_catalyst', statusText: 'Iron catalyst active: increases reaction rate' };
      if (id === 'pressure_slider_changed') {
        if (event.value >= 190) return { clipKey: 'lab09_success_pressure', statusText: `High pressure (${event.value} atm): increases ammonia yield` };
        return { clipKey: 'lab09_slider_pressure', statusText: `Operating pressure: ${event.value} atm` };
      }
      if (id === 'temperature_slider_changed') return { clipKey: 'lab09_temp_tradeoff', statusText: `Temperature compromise: ${event.value}°C` };
      if (id === 'optimal_conditions_reached') return { clipKey: 'lab09_optimal', statusText: 'Optimal Haber Process industrial balance!' };
      if (id === 'micro_tab_reactants' || id === 'micro_tab_products') return { clipKey: 'lab09_03', statusText: 'Viewing molecular equilibrium bonds' };
    }

    if (id === 'lab_reset' || id === 'equation_reset' || id === 'step_undone') {
      return { isSilent: true, statusText: 'Laboratory reset to initial conditions' };
    }

    return null;
  }

  resolveFallbackNarration(event) {
    const outcome = event.outcome;
    const id = event.actionId || event.type || '';

    if (this.hadMistake && (outcome === 'SUCCESS' || id.includes('dropped') || id.includes('attached') || id.includes('dispensed'))) {
      this.hadMistake = false;
      return { clipKey: 'mistake_corrected', statusText: 'Mistake corrected! Back on track.', allowRepeat: true };
    }

    if (outcome === 'INCORRECT' || id.includes('failed') || id.includes('wrong')) {
      this.hadMistake = true;
      if (id.includes('holder') || id.includes('tube')) {
        return { clipKey: 'incorrect_tube_holder', statusText: 'Test tube placement correction', allowRepeat: true };
      }
      return { clipKey: 'general_drop_outside', statusText: 'Placement correction needed', allowRepeat: true };
    }

    if (outcome === 'INCOMPLETE') {
      return { clipKey: 'incomplete_action_continue', statusText: 'Continuing interaction', allowRepeat: true };
    }

    if (outcome === 'VALID_EXPLORATION') {
      return { clipKey: 'valid_exploration_variable', statusText: 'Exploring experimental variables', allowRepeat: true };
    }

    if (outcome === 'EXPERIMENT_COMPLETED') {
      return { clipKey: 'experiment_completed_summary', statusText: 'Experimental investigation complete!' };
    }

    return null;
  }

  handleAction(event) {
    if (!this.narratorEnabled || !event || event.source !== 'BALANCE_LAB') return;
    const labIdx = parseInt(String(event.labId).replace('lab', ''), 10) - 1;
    if (labIdx !== this.activeLab) return;

    // Continuous slider aggregation
    const isContinuous = event.actionId && (event.actionId.includes('slider') || event.actionId.includes('burner'));
    if (this.actionBatchTimer) {
      clearTimeout(this.actionBatchTimer);
      this.actionBatchTimer = null;
    }

    if (isContinuous) {
      this.recentActions.push(event);
      this.actionBatchTimer = setTimeout(() => {
        this.actionBatchTimer = null;
        const latest = this.recentActions.pop() || event;
        const wasAggregated = this.recentActions.length > 0;
        this.recentActions = [];
        this.processAction(latest, wasAggregated);
      }, 70);
    } else {
      const wasAggregated = this.recentActions.length > 0;
      this.recentActions = [];
      this.processAction(event, wasAggregated);
    }
  }

  processAction(event, wasAggregated = false) {
    if (!this.narratorEnabled) return;

    const labNum = String(event.labId || ('lab' + String(this.activeLab + 1).padStart(2, '0'))).replace('lab', '');
    const prevPlayback = this.state;
    this.transitionState(TutorState.RESOLVING);

    // 1. Update verified scientific state
    const stateUpdate = this.stateEngine.update(event);
    this.provider.sendLabState(stateUpdate);
    this.provider.sendStudentAction(event);

    // 2. Decision Matrix Routing
    const decision = this.routeAction(event, stateUpdate, wasAggregated);

    // Case A: Silence / Reset
    if (decision.route === 'SILENCE' || (decision.mapping && decision.mapping.isSilent)) {
      if (decision.mapping && decision.mapping.isSilent) {
        this.interruptCurrentAudio('deliberate_reset');
        this.completedClips.clear();
      }
      if (this.currentAudio && !this.currentAudio.paused) {
        this.transitionState(TutorState.PLAYING_CACHED_AUDIO);
      } else {
        this.transitionState(TutorState.ACTIVE_IDLE);
      }
      this.logDiagnostic({
        event: event.actionId || event.type,
        outcome: event.outcome || 'INTENTIONAL_SILENCE',
        lab: labNum,
        stateVersion: event.stateVersion || 1,
        enabled: this.narratorEnabled,
        prevPlayback: prevPlayback,
        cancelReason: 'none',
        newAudio: null,
        loadingStatus: 'idle',
        playbackResult: this.state,
        suppressionReason: 'INTENTIONAL_SILENCE',
        recoveryResult: 'ACTIVE_IDLE (READY)',
        nextActionReady: 'READY'
      });
      return;
    }

    // Case B: Route A — Cached Audio Clip
    const mapping = decision.mapping;
    const clipKey = mapping.clipKey;
    const clipId = `${this.activeLab}_${clipKey}`;

    // Deduplication check
    if (!mapping.allowRepeat && this.completedClips.has(clipId)) {
      if (this.currentAudio && !this.currentAudio.paused) {
        this.transitionState(TutorState.PLAYING_CACHED_AUDIO);
      } else {
        this.transitionState(TutorState.ACTIVE_IDLE);
      }
      this.logDiagnostic({
        event: event.actionId || event.type,
        outcome: event.outcome || 'ALREADY_EXPLAINED',
        lab: labNum,
        stateVersion: event.stateVersion || 1,
        enabled: this.narratorEnabled,
        prevPlayback: prevPlayback,
        cancelReason: 'none',
        newAudio: clipKey,
        loadingStatus: 'suppressed',
        playbackResult: this.state,
        suppressionReason: 'ALREADY_EXPLAINED',
        recoveryResult: 'ACTIVE_IDLE (READY)',
        nextActionReady: 'READY'
      });
      return;
    }

    // New explanation supersedes ongoing speech -> Sub-millisecond interruption
    const cancelReason = this.currentAudio ? 'superseded_by_action' : 'none';
    this.interruptCurrentAudio(cancelReason);

    const sessionToken = ++this.generation;
    this.transitionState(TutorState.RESOLVING);
    this.currentClipKey = clipKey;

    const statusEl = el('narrationStatus');
    if (statusEl && mapping.statusText) {
      statusEl.textContent = `Teacher explaining: ${mapping.statusText}`;
    }

    this.playCachedClip(
      clipKey,
      sessionToken,
      // onPlaying
      () => {
        if (sessionToken === this.generation && this.narratorEnabled) {
          this.transitionState(TutorState.PLAYING_CACHED_AUDIO);
          this.logDiagnostic({
            event: event.actionId || event.type,
            outcome: event.outcome || 'SUCCESS',
            lab: labNum,
            stateVersion: event.stateVersion || 1,
            enabled: this.narratorEnabled,
            prevPlayback: prevPlayback,
            cancelReason: cancelReason,
            newAudio: clipKey,
            loadingStatus: 'playing',
            playbackResult: 'PLAYING_CACHED_AUDIO',
            suppressionReason: 'none',
            recoveryResult: 'READY',
            nextActionReady: 'READY'
          });
        }
      },
      // onEnded
      () => {
        if (sessionToken === this.generation) {
          this.completedClips.add(clipId);
          this.currentAudio = null;
          this.currentClipKey = null;
          this.transitionState(TutorState.ACTIVE_IDLE);
        }
      },
      // onError -> Self-recovery
      () => {
        if (sessionToken === this.generation) {
          this.handlePlaybackError(clipKey, event, sessionToken, labNum, prevPlayback);
        }
      }
    );
  }

  handlePlaybackError(clipKey, event, sessionToken, labNum, prevPlayback) {
    if (sessionToken !== this.generation) return;

    this.safelyStopAudio(this.currentAudio);
    this.currentAudio = null;
    this.currentClipKey = null;
    this.transitionState(TutorState.RECOVERING);

    this.logDiagnostic({
      event: event.actionId || event.type || 'unknown',
      outcome: event.outcome || 'AUDIO_ERROR',
      lab: labNum,
      stateVersion: event.stateVersion || 1,
      enabled: this.narratorEnabled,
      prevPlayback: prevPlayback,
      cancelReason: 'none',
      newAudio: clipKey,
      loadingStatus: 'failed',
      playbackResult: 'RECOVERING',
      suppressionReason: 'AUDIO_ASSET_NOT_FOUND',
      recoveryResult: 'ACTIVE_IDLE (SELF_RECOVERED)',
      nextActionReady: 'READY'
    });

    setTimeout(() => {
      if (this.narratorEnabled && this.state === TutorState.RECOVERING) {
        this.transitionState(TutorState.ACTIVE_IDLE);
      }
    }, 50);
  }

  async handleStudentQuestion(question) {
    if (!question || !question.trim()) return;
    this.interruptCurrentAudio('student_question');

    const labId = 'lab' + String(this.activeLab + 1).padStart(2, '0');
    const labState = this.stateEngine.getLabState(labId);

    const statusEl = el('narrationStatus');
    if (statusEl) {
      statusEl.textContent = `Miss Balance thinking...`;
    }

    const res = await this.provider.sendStudentQuestion(labId, labState, question);
    const answerText = res.response || 'Let us observe the reaction carefully.';

    if (res.translation || res.bookPage) {
      showYouSaidTranscript(question, res.bookPage, res.translation);
    }

    // Display in question drawer with provider information
    displayTeacherAnswer(answerText, res.provider || 'Miss Balance (Google Gemini)', res.voice || 'Miss Balance (en-GB-LibbyNeural · Friendly Academic Voice)');

    // Play real dynamic neural voice audio if returned from backend
    if (res.audioUri && typeof res.audioUri === 'string' && res.audioUri.startsWith('data:audio/')) {
      const token = ++this.generation;
      this.currentClipKey = 'gemini_dynamic_voice';
      this.transitionState(TutorState.STREAMING_AI_AUDIO);

      const audio = new Audio(res.audioUri);
      this.currentAudio = audio;

      audio.onplay = () => {
        if (token === this.generation) {
          if (statusEl) {
            statusEl.textContent = `Miss Balance speaking...`;
          }
        }
      };
      audio.onended = () => {
        if (token === this.generation) {
          this.currentAudio = null;
          this.currentClipKey = null;
          this.transitionState(TutorState.ACTIVE_IDLE);
        }
      };
      audio.onerror = () => {
        if (token === this.generation) {
          this.currentAudio = null;
          this.currentClipKey = null;
          this.transitionState(TutorState.ACTIVE_IDLE);
        }
      };

      try {
        await audio.play();
      } catch (err) {
        // Autoplay policy fallback: use SpeechSynthesis if browser blocked Audio.play()
        if ('speechSynthesis' in window && token === this.generation) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(answerText);
          utterance.lang = (res.voice && res.voice.startsWith('ar')) ? 'ar-SA' : 'en-GB';
          utterance.rate = 0.95;
          utterance.onend = () => {
            if (token === this.generation) this.transitionState(TutorState.ACTIVE_IDLE);
          };
          window.speechSynthesis.speak(utterance);
        } else {
          this.transitionState(TutorState.ACTIVE_IDLE);
        }
      }
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(answerText);
      utterance.lang = (res.voice && res.voice.startsWith('ar')) ? 'ar-SA' : 'en-GB';
      utterance.rate = 0.95;
      utterance.onend = () => {
        this.transitionState(TutorState.ACTIVE_IDLE);
      };
      this.transitionState(TutorState.STREAMING_AI_AUDIO);
      window.speechSynthesis.speak(utterance);
    } else if (res.cachedAudioFallbackKey) {
      this.playCachedClip(res.cachedAudioFallbackKey, ++this.generation, () => {
        this.transitionState(TutorState.PLAYING_CACHED_AUDIO);
      }, () => {
        this.transitionState(TutorState.ACTIVE_IDLE);
      });
    }
  }

  startNarration(labIdx) {
    this.interruptCurrentAudio('user_started');
    this.narratorEnabled = true;
    activeSpeech = true;
    this.activeLab = labIdx;
    this.completedClips.clear();
    this.hadMistake = false;

    this.transitionState(TutorState.RESOLVING);

    const labNum = String(labIdx + 1).padStart(2, '0');
    const labId = 'lab' + labNum;
    const introKey = `${labId}_intro`;
    const token = ++this.generation;
    this.currentClipKey = introKey;

    const statusEl = el('narrationStatus');
    if (statusEl) {
      statusEl.textContent = `Teacher introducing: ${LABS[labIdx]?.name || 'Investigation'}`;
    }

    this.playCachedClip(
      introKey,
      token,
      () => {
        if (token === this.generation && this.narratorEnabled) {
          this.transitionState(TutorState.PLAYING_CACHED_AUDIO);
          this.logDiagnostic({
            event: 'intro_started',
            outcome: 'SUCCESS',
            lab: labNum,
            stateVersion: 1,
            enabled: this.narratorEnabled,
            prevPlayback: 'DISABLED',
            cancelReason: 'none',
            newAudio: introKey,
            loadingStatus: 'playing',
            playbackResult: 'PLAYING_CACHED_AUDIO',
            suppressionReason: 'none',
            recoveryResult: 'READY',
            nextActionReady: 'READY'
          });
        }
      },
      () => {
        if (token === this.generation) {
          this.completedClips.add(`${labIdx}_${introKey}`);
          this.currentAudio = null;
          this.currentClipKey = null;
          this.transitionState(TutorState.ACTIVE_IDLE);
        }
      },
      () => {
        if (token === this.generation) {
          const fallbackKey = `${labId}_01`;
          this.playCachedClip(fallbackKey, token, () => {
            this.transitionState(TutorState.PLAYING_CACHED_AUDIO);
          }, () => {
            this.transitionState(TutorState.ACTIVE_IDLE);
          });
        }
      }
    );
  }

  stopNarration() {
    this.interruptCurrentAudio('user_stopped');
    this.narratorEnabled = false;
    activeSpeech = false;
    this.transitionState(TutorState.DISABLED);
  }

  toggle() {
    if (this.narratorEnabled) {
      this.stopNarration();
    } else {
      this.startNarration(activeLab);
    }
  }

  cancelCurrentNarration(reason = 'superseded') {
    return this.interruptCurrentAudio(reason);
  }

  get enabled() { return this.narratorEnabled; }
  set enabled(v) { this.narratorEnabled = !!v; }

  logDiagnostic(d) {
    const isPlaying = d.playbackResult && d.playbackResult.includes('PLAYING');
    const isSuppressed = !!d.suppressionReason && d.suppressionReason !== 'none';
    const isError = d.playbackResult && d.playbackResult.includes('ERROR');

    let color = '#26b99a';
    if (isError) color = '#e74c3c';
    else if (isSuppressed) color = '#e67e22';

    console.log(`%c[BALANCE NARRATOR MONITOR]
EVENT RECEIVED: ${d.event || 'unknown'}
ACTION CLASSIFICATION: ${d.outcome || 'ACTION_DETECTED'}
CURRENT LABORATORY STATE: Lab ${d.lab} (v${d.stateVersion || 1})
NARRATOR ENABLED: ${d.enabled ? 'TRUE' : 'FALSE'}
PREVIOUS PLAYBACK STATE: ${d.prevPlayback || 'IDLE'}
CANCELLATION REASON: ${d.cancelReason || 'none'}
NEW SELECTED AUDIO: ${d.newAudio ? (d.newAudio + '.wav') : 'none'}
AUDIO LOADING STATUS: ${d.loadingStatus || 'idle'}
AUDIO PLAYBACK RESULT: ${d.playbackResult || 'none'}
SUPPRESSION REASON: ${d.suppressionReason || 'none'}
RECOVERY RESULT: ${d.recoveryResult || 'READY'}
NEXT-ACTION PLAYBACK RESULT: ${d.nextActionReady || 'READY'}`,
    `color: ${color}; font-weight: bold; line-height: 1.4;`);
  }
}

// -------------------------------------------------------------
// Global Instance & Backward-Compatible Integration Functions
// -------------------------------------------------------------
const narratorController = new HybridNarrationOrchestrator('NIS');
narratorController.init();

function stopSpeaking(fullDeactivate = true) {
  if (fullDeactivate) {
    narratorController.stopNarration();
  } else {
    narratorController.interruptCurrentAudio('view_change');
  }
}

function startNarration() {
  narratorController.startNarration(activeLab);
}

function toggleNarration() {
  narratorController.toggle();
}

window.addEventListener('message', (e) => {
  if (e.data && e.data.source === 'BALANCE_LAB') {
    narratorController.handleAction(e.data);
  }
});

function attachLabBridge(labIdx, frame) {
  try {
    const win = frame.contentWindow;
    if (win && !frame._eventBridgeAttached) {
      frame._eventBridgeAttached = true;
      win.addEventListener('balance-lab-action', (e) => {
        if (e.detail) narratorController.handleAction(e.detail);
      });
    }
  } catch (err) {}
}

function updateAskTeacherVoiceBtnState(mode) {
  const btn = document.getElementById('askTeacherVoiceBtn');
  if (!btn) return;

  const micSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
  const stopSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
  const spinSvg = `<svg class="spin-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`;

  btn.classList.remove('recording', 'processing');

  if (mode === 'recording') {
    btn.classList.add('recording');
    btn.title = 'Stop Recording';
    btn.innerHTML = `
      <span class="mic-icon">${stopSvg}</span>
      <span class="mic-label-full">Stop Recording</span>
      <span class="mic-label-short">Stop</span>
    `;
  } else if (mode === 'processing') {
    btn.classList.add('processing');
    btn.title = 'Processing…';
    btn.innerHTML = `
      <span class="mic-icon">${spinSvg}</span>
      <span class="mic-label-full">Processing…</span>
      <span class="mic-label-short">Processing…</span>
    `;
  } else {
    btn.title = 'Ask AI Teacher';
    btn.innerHTML = `
      <span class="mic-icon">${micSvg}</span>
      <span class="mic-label-full">Ask AI Teacher</span>
      <span class="mic-label-short">Ask AI</span>
    `;
  }
}
window.updateAskTeacherVoiceBtnState = updateAskTeacherVoiceBtnState;

// -------------------------------------------------------------
// Component 6: Live Student Voice & Text Inquiry Interface
// -------------------------------------------------------------
function setupVoiceInquiryUI() {
  const askVoiceBtn = el('askTeacherVoiceBtn');
  if (askVoiceBtn) {
    askVoiceBtn.onclick = () => {
      if (window.liveAudioClient && window.liveAudioClient.isRecording) {
        window.liveAudioClient.finishSpeechTurn();
      } else {
        const drawer = el('askTeacherDrawer');
        if (drawer && drawer.classList.contains('hidden')) {
          drawer.classList.remove('hidden');
        }
        toggleStudentMicrophone();
      }
    };
    updateAskTeacherVoiceBtnState('idle');
  }
  if (el('askTeacherDrawer')) return;

  // Ask Teacher Drawer / Modal
  const drawer = document.createElement('div');
  drawer.id = 'askTeacherDrawer';
  drawer.className = 'hidden';
  drawer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 380px;
    max-width: calc(100vw - 48px);
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(0, 32, 64, 0.22);
    border: 1px solid #dce8f5;
    z-index: 9999;
    padding: 20px;
    font-family: inherit;
    animation: slideUp 200ms ease-out;
  `;

  drawer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:#e0f2fe; color:#0369a1;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>
        </span>
        <div>
          <strong style="font-size:14px; color:#10284c; display:block;">Ask Your Chemistry Teacher</strong>
          <small style="font-size:11px; color:#60738e;">Oxford MYP Chemistry · Guided Inquiry</small>
        </div>
      </div>
      <button id="closeTeacherDrawer" style="background:none; border:none; font-size:20px; cursor:pointer; color:#8898aa;">&times;</button>
    </div>

    <!-- Quick Inquiry Chips -->
    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
      <button class="chip" onclick="submitQuickQuestion('Why did the colour change?')">Why colour change?</button>
      <button class="chip" onclick="submitQuickQuestion('What is happening to the particles?')">Particle view?</button>
      <button class="chip" onclick="submitQuickQuestion('Why does high pressure favour ammonia?')">Pressure effect?</button>
      <button class="chip" onclick="submitQuickQuestion('What should I try next?')">Next step?</button>
    </div>

    <!-- Input Form -->
    <div style="display:flex; gap:8px; margin-bottom:10px;">
      <input type="text" id="teacherQuestionInput" placeholder="Ask anything about this experiment..." style="
        flex:1; padding:10px 14px; border:1px solid #cfdbe8; border-radius:12px; font-size:13px; outline:none;
      " onkeydown="if(event.key==='Enter') submitTeacherQuestion()">
      <button id="sendQuestionBtn" onclick="submitTeacherQuestion()" style="
        background:#0066cc; color:#fff; border:none; border-radius:12px; padding:0 16px; font-weight:700; cursor:pointer; font-size:13px;
      ">Ask</button>
    </div>

    <!-- 5-State Real-Time Voice Status Card -->
    <div id="voiceStatusCard" class="hidden" style="
      margin-bottom: 12px;
      border-radius: 12px;
      padding: 10px 14px;
      transition: all 0.25s ease;
      border: 1px solid #6ee7b7;
      background: #ecfdf5;
    ">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div id="voiceStatusIconWrapper" style="
            width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;
            background:#10b981; color:#fff; font-size:16px; transition:all 0.2s ease;
          ">
            <span id="voiceStatusIcon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></span>
          </div>
          <div>
            <div id="voiceStatusTitle" style="font-size:13px; font-weight:700; color:#065f46; line-height:1.3;">
              Listening... I'm here!
            </div>
            <div id="voiceStatusSubtitle" style="font-size:11px; color:#64748b; line-height:1.3;">
              Speak naturally into your microphone
            </div>
          </div>
        </div>
        <!-- Real-Time Equalizer Waveform responding to microphone input levels -->
        <div id="liveWaveform" style="display:flex; align-items:center; gap:3px; height:24px;">
          <span class="vbar" style="width:3px; height:8px; background:#10b981; border-radius:2px; transition:height 0.08s ease;"></span>
          <span class="vbar" style="width:3px; height:14px; background:#10b981; border-radius:2px; transition:height 0.08s ease;"></span>
          <span class="vbar" style="width:3px; height:20px; background:#10b981; border-radius:2px; transition:height 0.08s ease;"></span>
          <span class="vbar" style="width:3px; height:12px; background:#10b981; border-radius:2px; transition:height 0.08s ease;"></span>
          <span class="vbar" style="width:3px; height:6px; background:#10b981; border-radius:2px; transition:height 0.08s ease;"></span>
        </div>
      </div>
    </div>

    <!-- Section 4: What the student actually said ("You said: ...") with Oxford Citation & Optional Translation -->
    <div id="youSaidIndicator" class="hidden" style="
      margin-bottom: 10px;
      padding: 8px 12px;
      background: #f0f7ff;
      border: 1px solid #bae0ff;
      border-radius: 10px;
      font-size: 12px;
      color: #003a8c;
      display: flex;
      flex-direction: column;
      gap: 6px;
    ">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
        <div style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:flex; align-items:center; gap:6px;">
          <strong style="color:#0050b3;">You said:</strong>
          <span id="youSaidText" style="font-style:italic;">"..."</span>
          <span id="youSaidBookPage" class="hidden" style="
            font-size:10px; padding:2px 6px; border-radius:6px; background:#e6f4ff; color:#0958d9; font-weight:600; border:1px solid #91caff;
          ">Chapter 1</span>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <button id="toggleTranslationBtn" class="hidden" title="Toggle English translation" style="background:#e6f4ff; border:1px solid #91caff; border-radius:6px; font-size:11px; padding:2px 6px; color:#0958d9; cursor:pointer;" onclick="toggleTranscriptTranslation()">Translate</button>
          <button id="editTranscriptBtn" title="Edit question text" style="background:none; border:none; cursor:pointer; font-size:11px; padding:2px 4px; font-weight:700; color:#0958d9;" onclick="editHeardTranscript()">Edit</button>
          <button id="retryAudioBtn" title="Retry voice question" style="background:none; border:none; cursor:pointer; font-size:11px; padding:2px 4px; font-weight:700; color:#0958d9;" onclick="retryVoiceQuestion()">Retry</button>
        </div>
      </div>
      <!-- Optional Translation Row (Faithful English Translation) -->
      <div id="youSaidTranslation" class="hidden" style="
        font-size: 11px;
        color: #0958d9;
        background: #ffffff;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px dashed #91caff;
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <strong style="color:#003a8c;">English translation:</strong>
        <span id="youSaidTranslationText" style="font-style:italic;"></span>
      </div>
    </div>
    <!-- Backwards compatible alias ID -->
    <div id="iHeardIndicator" class="hidden" style="display:none;"><span id="iHeardText"></span></div>

    <!-- Voice Control Bar with Immediate Done Button & Audio Diagnostics -->
    <div style="display:flex; align-items:center; justify-content:space-between; padding-top:8px; border-top:1px solid #edf2f8;">
      <div style="display:flex; align-items:center; gap:8px;">
        <button id="micToggleBtn" onclick="toggleStudentMicrophone()" style="
          display:inline-flex; align-items:center; gap:6px; background:#f5f8fb; border:1px solid #d0deec; border-radius:999px; padding:6px 14px; font-size:12px; font-weight:700; cursor:pointer; color:#304561; transition:all 0.2s ease;
        ">
          <span id="micDot" style="width:8px; height:8px; border-radius:50%; background:#8fa4b8; display:inline-block;"></span>
          <span id="micText">Voice Question</span>
        </button>
        <!-- Immediate Done Speaking Button (0ms silence latency) -->
        <button id="micDoneBtn" class="hidden" onclick="finishStudentSpeakingNow()" style="
          display:inline-flex; align-items:center; gap:4px; background:#10b981; color:#ffffff; border:none; border-radius:999px; padding:6px 14px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s ease; box-shadow:0 2px 6px rgba(16,185,129,0.3);
        ">
          <span style="display:flex; align-items:center;"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
          <span>Done</span>
        </button>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:10px; color:#879bb0;">Gemini Live 16kHz PCM</span>
        <button onclick="toggleDevDiagnostics()" title="Audio Pipeline Diagnostics (Ctrl+Shift+D)" style="background:none; border:none; cursor:pointer; font-size:11px; color:#879bb0; padding:2px; font-weight:700;">Diagnostics</button>
      </div>
    </div>

    <!-- Live Answer Output -->
    <div id="teacherAnswerBox" class="hidden" style="
      margin-top:12px; padding:12px; background:#f4f9ff; border-radius:12px; border-left:4px solid #0066cc; font-size:13px; color:#15325b; line-height:1.45;
    "></div>
  `;

  document.body.appendChild(drawer);

  // Developer Audio Diagnostics HUD
  const diagPanel = document.createElement('div');
  diagPanel.id = 'devAudioDiagPanel';
  diagPanel.className = 'hidden';
  diagPanel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    color: #38bdf8;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    padding: 16px;
    z-index: 100000;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    line-height: 1.6;
  `;
  diagPanel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;">
      <span style="font-weight:700; color:#f8fafc; font-size:12px;">AUDIO PIPELINE DIAGNOSTICS</span>
      <button onclick="toggleDevDiagnostics()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:16px;">&times;</button>
    </div>
    <div>MICROPHONE: <span id="diagMicStatus" style="color:#4ade80; font-weight:700;">IDLE</span></div>
    <div>INPUT DEVICE: <span id="diagInputDevice" style="color:#f8fafc;">Default Microphone</span></div>
    <div>INPUT SAMPLE RATE: <span id="diagSampleRate" style="color:#f8fafc;">16000 Hz</span></div>
    <div>PCM FORMAT: <span id="diagPcmFormat" style="color:#f8fafc;">Signed 16-bit LE (Mono)</span></div>
    <div>CHUNKS SENT: <span id="diagChunksSent" style="color:#f8fafc;">0</span> | DROPPED: <span id="diagChunksDropped" style="color:#f8fafc;">0</span></div>
    <div>WEBSOCKET: <span id="diagWsStatus" style="color:#facc15; font-weight:700;">CONNECTING</span></div>
    <div>SPEECH DETECTED: <span id="diagSpeechState" style="color:#f8fafc;">NO</span> (RMS: <span id="diagRms">0.000</span>)</div>
    <div style="margin-top:6px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.08);">
      INPUT TRANSCRIPT: <span id="diagInputTranscript" style="color:#f8fafc; font-weight:700;">(none)</span>
    </div>
    <div>FIRST AUDIO RECEIVED: <span id="diagFirstAudio" style="color:#38bdf8; font-weight:700;">-</span></div>
    <div>PLAYBACK STARTED: <span id="diagPlayback" style="color:#38bdf8; font-weight:700;">-</span></div>
    <div>ACTIVE MODEL: <span id="diagModel" style="color:#a78bfa;">models/gemini-3.8-live</span></div>
    <div>ZERO-PAID POLICY: <span style="color:#4ade80; font-weight:700;">STRICTLY ENFORCED (Free tier)</span></div>
  `;
  document.body.appendChild(diagPanel);

  // Add chip & pulse styling
  const style = document.createElement('style');
  style.textContent = `
    .chip {
      background: #edf5fc;
      border: 1px solid #d6e7f7;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      color: #1a4d80;
      cursor: pointer;
      transition: background 150ms ease;
    }
    .chip:hover { background: #dceefc; }
    @keyframes pulseRed { 0%{box-shadow:0 0 0 0 rgba(231,76,60,0.5);} 70%{box-shadow:0 0 0 8px rgba(231,76,60,0);} 100%{box-shadow:0 0 0 0 rgba(231,76,60,0);} }
    @keyframes pulseBlue { 0%{box-shadow:0 0 0 0 rgba(0,102,204,0.5);} 70%{box-shadow:0 0 0 8px rgba(0,102,204,0);} 100%{box-shadow:0 0 0 0 rgba(0,102,204,0);} }
  `;
  document.head.appendChild(style);

  el('closeTeacherDrawer').onclick = toggleAskTeacherDrawer;
}

function toggleAskTeacherDrawer() {
  const drawer = el('askTeacherDrawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
  if (!drawer.classList.contains('hidden')) {
    const input = el('teacherQuestionInput');
    if (input) input.focus();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const VoiceUIState = {
  LISTENING: 'LISTENING',         // State 1: Green mic, animated waves, "Listening... I'm here!"
  SPEECH_DETECTED: 'SPEECH_DETECTED', // State 2: "I can hear you...", shows real-time words
  THINKING: 'THINKING',           // State 3: "Got it! Let me explain...", consulting Chapter 1
  SPEAKING: 'SPEAKING',           // State 4: "AI Teacher is speaking...", subtle audio wave
  PROBLEM: 'PROBLEM',             // State 5: "I can't hear you. Check your microphone."
  IDLE: 'IDLE'                    // Hidden / resting
};

function setVoiceUIState(state, text = '', detail = '') {
  const card = el('voiceStatusCard');
  const iconWrap = el('voiceStatusIconWrapper');
  const icon = el('voiceStatusIcon');
  const title = el('voiceStatusTitle');
  const subtitle = el('voiceStatusSubtitle');
  const waveform = el('liveWaveform');
  const doneBtn = el('micDoneBtn');
  const bars = document.querySelectorAll('#liveWaveform .vbar');
  if (!card || !iconWrap || !title || !subtitle) return;

  if (state === VoiceUIState.IDLE) {
    card.classList.add('hidden');
    if (doneBtn) doneBtn.classList.add('hidden');
    updateAskTeacherVoiceBtnState('idle');
    return;
  }

  card.classList.remove('hidden');

  if (state === VoiceUIState.LISTENING) {
    updateAskTeacherVoiceBtnState('recording');
    card.style.background = '#ecfdf5';
    card.style.borderColor = '#6ee7b7';
    iconWrap.style.background = '#10b981';
    iconWrap.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.4)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
    title.textContent = "I'm listening...";
    title.style.color = '#065f46';
    subtitle.textContent = "I'm listening to your voice in real time — speak naturally";
    if (waveform) waveform.style.display = 'flex';
    if (doneBtn) doneBtn.classList.remove('hidden');
    bars.forEach(b => { b.style.background = '#10b981'; });
  } else if (state === VoiceUIState.SPEECH_DETECTED) {
    updateAskTeacherVoiceBtnState('recording');
    card.style.background = '#f0fdf4';
    card.style.borderColor = '#34d399';
    iconWrap.style.background = '#059669';
    iconWrap.style.boxShadow = '0 0 12px rgba(5, 150, 105, 0.5)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
    title.textContent = "I can hear you...";
    title.style.color = '#064e3b';
    subtitle.textContent = text || "Detecting your voice in real time — finish speaking when ready";
    if (waveform) waveform.style.display = 'flex';
    if (doneBtn) doneBtn.classList.remove('hidden');
    bars.forEach(b => { b.style.background = '#059669'; });
  } else if (state === VoiceUIState.THINKING) {
    updateAskTeacherVoiceBtnState('processing');
    card.style.background = '#eff6ff';
    card.style.borderColor = '#93c5fd';
    iconWrap.style.background = '#2563eb';
    iconWrap.style.boxShadow = '0 0 10px rgba(37, 99, 235, 0.4)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>';
    title.textContent = "Thinking...";
    title.style.color = '#1e40af';
    subtitle.textContent = text ? `Processing: "${text}"` : "Thinking...";
    if (waveform) waveform.style.display = 'flex';
    if (doneBtn) doneBtn.classList.add('hidden');
    bars.forEach(b => { b.style.background = '#2563eb'; });
  } else if (state === VoiceUIState.SPEAKING) {
    card.style.background = '#faf5ff';
    card.style.borderColor = '#c084fc';
    iconWrap.style.background = '#7c3aed';
    iconWrap.style.boxShadow = '0 0 10px rgba(124, 58, 237, 0.4)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
    title.textContent = "Speaking...";
    title.style.color = '#5b21b6';
    subtitle.textContent = "You can speak again anytime to interrupt";
    if (waveform) waveform.style.display = 'flex';
    if (doneBtn) doneBtn.classList.add('hidden');
    bars.forEach(b => { b.style.background = '#7c3aed'; });
  } else if (state === VoiceUIState.PROBLEM) {
    updateAskTeacherVoiceBtnState('idle');
    card.style.background = '#fef2f2';
    card.style.borderColor = '#fca5a5';
    iconWrap.style.background = '#dc2626';
    iconWrap.style.boxShadow = 'none';
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    title.textContent = "I can't hear you. Please check your microphone.";
    title.style.color = '#991b1b';
    subtitle.textContent = detail || "Microphone muted, disconnected, or permission denied.";
    if (waveform) waveform.style.display = 'none';
    if (doneBtn) doneBtn.classList.add('hidden');
  }
}

function showYouSaidTranscript(text, bookPage = null, translation = null) {
  const box = el('youSaidIndicator') || el('iHeardIndicator');
  const span = el('youSaidText') || el('iHeardText');
  const badge = el('youSaidBookPage');
  const transBox = el('youSaidTranslation');
  const transText = el('youSaidTranslationText');
  const transBtn = el('toggleTranslationBtn');
  
  if (box && span) {
    span.textContent = `"${text}"`;
    const isArabic = /[\u0600-\u06FF]/.test(text);
    span.style.direction = isArabic ? 'rtl' : 'ltr';
    if (badge) {
      if (bookPage) {
        badge.textContent = `Oxford MYP Chapter 1, p.${bookPage}`;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
    if (transBox && transText) {
      if (translation && translation !== text) {
        transText.textContent = `"${translation}"`;
        if (transBtn) transBtn.classList.remove('hidden');
        transBox.classList.remove('hidden');
      } else {
        transBox.classList.add('hidden');
        if (transBtn) transBtn.classList.add('hidden');
      }
    }
    box.classList.remove('hidden');
  }
}

function toggleTranscriptTranslation() {
  const transBox = el('youSaidTranslation');
  if (transBox) {
    transBox.classList.toggle('hidden');
  }
}
window.toggleTranscriptTranslation = toggleTranscriptTranslation;

function showHeardTranscript(text) {
  showYouSaidTranscript(text);
}

function editHeardTranscript() {
  const span = el('youSaidText') || el('iHeardText');
  const input = el('teacherQuestionInput');
  if (span && input) {
    const cleaned = span.textContent.replace(/^"|"$/g, '');
    input.value = cleaned;
    input.focus();
  }
}

function retryVoiceQuestion() {
  if (window.liveAudioClient) {
    window.liveAudioClient.startListening();
  }
}

function finishStudentSpeakingNow() {
  if (window.liveAudioClient && window.liveAudioClient.isRecording) {
    window.liveAudioClient.finishSpeechTurn();
  }
}

function toggleDevDiagnostics() {
  const panel = el('devAudioDiagPanel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
    e.preventDefault();
    toggleDevDiagnostics();
  }
});

function displayTeacherAnswer(text, provider = "Miss Balance (Google Gemini)", voice = "Miss Balance (en-GB-LibbyNeural · Friendly Academic Voice)") {
  const box = el('teacherAnswerBox');
  if (!box) return;
  const isArabic = /[\u0600-\u06FF]/.test(text);
  box.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(0,0,0,0.08);font-size:11px;">
      <span style="font-weight:700;color:#27ae60;display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#27ae60;box-shadow:0 0 6px rgba(39,174,96,0.6);"></span>
        ${escapeHtml(provider || 'Miss Balance (Google Gemini)')}
      </span>
      <span style="color:#7f8c8d;font-size:10px;">${escapeHtml(voice || 'Friendly Academic Voice')}</span>
    </div>
    <div style="line-height:1.55;color:#2c3e50;font-size:13px;direction:${isArabic ? 'rtl' : 'ltr'};text-align:${isArabic ? 'right' : 'left'};">${escapeHtml(text)}</div>
  `;
  box.classList.remove('hidden');
}

function submitTeacherQuestion() {
  const input = el('teacherQuestionInput');
  if (!input || !input.value.trim()) return;
  const q = input.value.trim();
  input.value = '';
  showHeardTranscript(q);
  narratorController.handleStudentQuestion(q);
}

function submitQuickQuestion(q) {
  showHeardTranscript(q);
  narratorController.handleStudentQuestion(q);
}

// -------------------------------------------------------------
// Component 7: High-Performance Web Audio 16kHz PCM Streamer
// -------------------------------------------------------------

function downsampleTo16kPCM(inputData, inputSampleRate, targetSampleRate = 16000) {
  if (inputSampleRate === targetSampleRate) {
    const pcm = new Int16Array(inputData.length);
    for (let i = 0; i < inputData.length; i++) {
      let s = Math.max(-1, Math.min(1, inputData[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm;
  }
  const ratio = inputSampleRate / targetSampleRate;
  const newLength = Math.round(inputData.length / ratio);
  const pcm = new Int16Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const originIdx = i * ratio;
    const idx0 = Math.floor(originIdx);
    const idx1 = Math.min(idx0 + 1, inputData.length - 1);
    const frac = originIdx - idx0;
    const sample = inputData[idx0] * (1 - frac) + inputData[idx1] * frac;
    const s = Math.max(-1, Math.min(1, sample));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return pcm;
}

class LiveAudioClient {
  constructor(schoolId = 'NIS') {
    this.schoolId = schoolId;
    this.ws = null;
    this.audioCtx = null;
    this.playbackCtx = null;
    this.mediaStream = null;
    this.sourceNode = null;
    this.processorNode = null;
    this.analyserNode = null;
    this.animFrameId = null;
    this.noSpeechTimeout = null;
    this.isRecording = false;
    this.isConnected = false;
    this.chunksSent = 0;
    this.chunksDropped = 0;
    this.speechDetected = false;
    this.speechSilenceSamples = 0;
    this.silenceThresholdSamples = Math.round(16000 * 0.50); // 500ms VAD silence timeout for ultra-fast turn-around
    this.vadEnergyThreshold = 0.012; // Tuned for student voice sensitivity
    this.preRollBuffer = []; // stores last 5 chunks (~200ms)
    this.activeSources = [];
    this.nextAudioPlayTime = 0;
    this.speechStartTime = null;
    this.speechEndTime = null;
    this.firstAudioTime = null;
    this.inputDeviceName = 'Default Microphone';
  }

  async connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live/stream`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.ws.binaryType = 'arraybuffer';
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.updateDiagWs('CONNECTED');
        const labId = 'lab' + String((window.activeLab || 0) + 1).padStart(2, '0');
        const labState = narratorController ? narratorController.stateEngine.getLabState(labId) : {};
        this.ws.send(JSON.stringify({
          type: 'INIT_SESSION',
          schoolId: this.schoolId,
          labId: labId,
          labState: labState
        }));
      };

      this.ws.onmessage = (e) => {
        if (typeof e.data === 'string') {
          try {
            const msg = JSON.parse(e.data);
            this.handleServerMessage(msg);
          } catch(err) {}
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.updateDiagWs('DISCONNECTED');
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.updateDiagWs('ERROR');
      };
    } catch(err) {
      console.error('[LIVE CLIENT] WS connect error:', err);
    }
  }

  handleServerMessage(msg) {
    const mtype = msg.type;
    if (mtype === 'SESSION_READY' || mtype === 'SESSION_INITIALIZED') {
      this.updateDiagWs('WARM READY');
      if (msg.model) this.updateDiagModel(msg.model);
    } else if (mtype === 'INPUT_TRANSCRIPTION') {
      const text = msg.text || '';
      showYouSaidTranscript(text, msg.bookPage, msg.translation);
      this.updateDiagTranscript(text);
      setVoiceUIState(VoiceUIState.THINKING, text);
    } else if (mtype === 'FIRST_AUDIO_MILESTONE') {
      const lat = msg.latencyMs;
      this.updateDiagFirstAudio(`${lat} ms`);
      setVoiceUIState(VoiceUIState.SPEAKING);
    } else if (mtype === 'AUDIO_CHUNK') {
      setVoiceUIState(VoiceUIState.SPEAKING);
      if (msg.format === 'pcm24k' && msg.pcmBase64) {
        this.playPcm24kChunk(msg.pcmBase64);
      } else if (msg.format === 'mp3' && msg.mp3Base64) {
        this.playMp3Chunk(msg.mp3Base64);
      }
    } else if (mtype === 'AI_ANSWER_READY') {
      const ans = msg.text || '';
      const voiceName = /[\u0600-\u06FF]/.test(ans) ? 'ar-EG-SalmaNeural' : 'Miss Balance (en-GB-LibbyNeural · Friendly Academic Voice)';
      displayTeacherAnswer(ans, 'Miss Balance (Google Gemini)', voiceName);
      if (msg.translation) {
        showYouSaidTranscript(msg.text || '', msg.bookPage, msg.translation);
      }
      if (msg.audioUri && typeof msg.audioUri === 'string' && msg.audioUri.startsWith('data:audio/')) {
        this.playMp3Chunk(msg.audioUri.replace(/^data:audio\/mp3;base64,/, ''));
      }
    } else if (mtype === 'TURN_COMPLETE') {
      const ans = msg.response || '';
      const voiceName = /[\u0600-\u06FF]/.test(ans) ? 'ar-EG-SalmaNeural' : 'Miss Balance (en-GB-LibbyNeural · Friendly Academic Voice)';
      displayTeacherAnswer(ans, 'Miss Balance (Google Gemini)', voiceName);
      if (msg.translation) {
        showYouSaidTranscript(msg.transcript || '', null, msg.translation);
      }
      narratorController.transitionState(TutorState.ACTIVE_IDLE);
      this.resetMicUI();
      setTimeout(() => {
        if (!this.isRecording && this.activeSources.length === 0) {
          setVoiceUIState(VoiceUIState.IDLE);
        }
      }, 4000);
    } else if (mtype === 'BARGE_IN_CONFIRMED') {
      console.log('[LIVE CLIENT] Barge-in confirmed by server');
    }
  }

  async startListening() {
    if (this.isRecording) return;
    await this.connect();
    
    // Stop any existing narration / audio playback before listening
    this.stopPlayback();
    narratorController.interruptCurrentAudio('student_speaking');
    narratorController.transitionState(TutorState.LISTENING);

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!this.audioCtx) {
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const track = this.mediaStream.getAudioTracks()[0];
      if (track) {
        this.inputDeviceName = track.label || 'Microphone';
        this.updateDiagInputDevice(this.inputDeviceName);
        track.onended = () => {
          setVoiceUIState(VoiceUIState.PROBLEM, '', 'Microphone device was disconnected.');
          this.stopRecordingNodes();
          this.resetMicUI();
        };
      }

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 32;
      this.sourceNode.connect(this.analyserNode);

      this.processorNode = this.audioCtx.createScriptProcessor(2048, 1, 1);

      this.isRecording = true;
      this.speechDetected = false;
      this.speechSilenceSamples = 0;
      this.chunksSent = 0;
      this.chunksDropped = 0;
      this.preRollBuffer = [];
      this.speechStartTime = null;

      this.updateDiagMic('ACTIVE (LISTENING)');
      this.setMicUIActive(true);
      setVoiceUIState(VoiceUIState.LISTENING);

      // Real-time animated equalizer waveform responding to actual microphone audio levels
      const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
      const bars = document.querySelectorAll('#liveWaveform .vbar');
      const renderWave = () => {
        if (!this.isRecording) return;
        this.analyserNode.getByteFrequencyData(freqData);
        let maxVal = 0;
        for (let i = 0; i < freqData.length; i++) {
          if (freqData[i] > maxVal) maxVal = freqData[i];
        }
        if (bars && bars.length >= 5) {
          bars[0].style.height = Math.max(4, Math.min(24, (freqData[0] || maxVal) / 10)) + 'px';
          bars[1].style.height = Math.max(4, Math.min(24, (freqData[1] || maxVal) / 8)) + 'px';
          bars[2].style.height = Math.max(4, Math.min(24, maxVal / 6)) + 'px';
          bars[3].style.height = Math.max(4, Math.min(24, (freqData[2] || maxVal) / 8)) + 'px';
          bars[4].style.height = Math.max(4, Math.min(24, (freqData[3] || maxVal) / 10)) + 'px';
        }
        this.animFrameId = requestAnimationFrame(renderWave);
      };
      this.animFrameId = requestAnimationFrame(renderWave);

      // 4.5-second silence detector: warn if no input audio is detected
      if (this.noSpeechTimeout) clearTimeout(this.noSpeechTimeout);
      this.noSpeechTimeout = setTimeout(() => {
        if (this.isRecording && !this.speechDetected) {
          setVoiceUIState(VoiceUIState.PROBLEM, '', "I can't hear you. Speak closer to your microphone or check if it is unmuted.");
        }
      }, 4500);

      const inputSampleRate = this.audioCtx.sampleRate;

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Resample and convert Float32 to 16kHz signed 16-bit PCM (little-endian)
        const pcm16 = downsampleTo16kPCM(inputData, inputSampleRate, 16000);
        
        // Compute RMS for Voice Activity Detection
        let sumSq = 0;
        for (let i = 0; i < pcm16.length; i++) {
          const norm = pcm16[i] / 32768.0;
          sumSq += norm * norm;
        }
        const rms = Math.sqrt(sumSq / pcm16.length);
        this.updateDiagRms(rms);

        const chunkBytes = new Uint8Array(pcm16.buffer, pcm16.byteOffset, pcm16.byteLength);

        // VAD State Machine
        if (rms > this.vadEnergyThreshold) {
          if (this.noSpeechTimeout) {
            clearTimeout(this.noSpeechTimeout);
            this.noSpeechTimeout = null;
          }
          if (!this.speechDetected) {
            this.speechDetected = true;
            this.speechStartTime = performance.now();
            this.updateDiagSpeechState('YES (TALKING)');
            setVoiceUIState(VoiceUIState.SPEECH_DETECTED);
            // Check for barge-in interruption if AI was playing
            if (this.activeSources.length > 0) {
              this.bargeIn();
            }
            // Send pre-roll buffer so opening phonemes are never clipped
            while (this.preRollBuffer.length > 0) {
              const preChunk = this.preRollBuffer.shift();
              this.sendPcmChunk(preChunk);
            }
          }
          this.speechSilenceSamples = 0;
          this.sendPcmChunk(chunkBytes);
        } else {
          if (this.speechDetected) {
            this.speechSilenceSamples += pcm16.length;
            this.sendPcmChunk(chunkBytes);
            // Check silence threshold (500ms = 8000 samples at 16kHz)
            if (this.speechSilenceSamples >= this.silenceThresholdSamples) {
              this.speechDetected = false;
              this.updateDiagSpeechState('NO (END DETECTED)');
              this.finishSpeechTurn();
            }
          } else {
            // Buffer pre-roll frames (keep at most 5 frames = ~200ms)
            this.preRollBuffer.push(chunkBytes);
            if (this.preRollBuffer.length > 5) {
              this.preRollBuffer.shift();
            }
          }
        }
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioCtx.destination);
    } catch(err) {
      console.error('[LIVE CLIENT] Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setVoiceUIState(VoiceUIState.PROBLEM, '', 'Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setVoiceUIState(VoiceUIState.PROBLEM, '', 'No microphone detected on your device.');
      } else {
        setVoiceUIState(VoiceUIState.PROBLEM, '', 'Could not access microphone: ' + err.message);
      }
      this.resetMicUI();
    }
  }

  sendPcmChunk(bytes) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(bytes);
      this.chunksSent++;
      this.updateDiagChunks(this.chunksSent, this.chunksDropped);
    } else {
      this.chunksDropped++;
      this.updateDiagChunks(this.chunksSent, this.chunksDropped);
    }
  }

  finishSpeechTurn() {
    this.speechEndTime = performance.now();
    this.stopRecordingNodes();
    this.setMicUIProcessing();
    setVoiceUIState(VoiceUIState.THINKING);
    this.updateDiagMic('PROCESSING (VAD SPEECH_END)');
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const labId = 'lab' + String((window.activeLab || 0) + 1).padStart(2, '0');
      const labState = narratorController ? narratorController.stateEngine.getLabState(labId) : {};
      this.ws.send(JSON.stringify({
        type: 'SPEECH_END',
        labId: labId,
        labState: labState
      }));
    }
  }

  stopListening() {
    if (this.speechDetected) {
      this.finishSpeechTurn();
    } else {
      this.stopRecordingNodes();
      this.resetMicUI();
      setVoiceUIState(VoiceUIState.IDLE);
      narratorController.transitionState(TutorState.ACTIVE_IDLE);
    }
  }

  stopRecordingNodes() {
    this.isRecording = false;
    if (this.noSpeechTimeout) {
      clearTimeout(this.noSpeechTimeout);
      this.noSpeechTimeout = null;
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.processorNode) {
      try { this.processorNode.disconnect(); } catch(e) {}
      this.processorNode.onaudioprocess = null;
      this.processorNode = null;
    }
    if (this.analyserNode) {
      try { this.analyserNode.disconnect(); } catch(e) {}
      this.analyserNode = null;
    }
    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch(e) {}
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(t => t.stop());
      } catch(e) {}
      this.mediaStream = null;
    }
    this.updateDiagMic('IDLE');
  }

  bargeIn() {
    this.stopPlayback();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'BARGE_IN' }));
    }
    setVoiceUIState(VoiceUIState.SPEECH_DETECTED, 'Interruption detected — listening...');
    console.log('[LIVE CLIENT] Barge-in triggered: speech playback halted.');
  }

  playPcm24kChunk(b64Data) {
    if (!this.playbackCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.playbackCtx = new AudioCtx({ sampleRate: 24000 });
    }
    if (this.playbackCtx.state === 'suspended') {
      this.playbackCtx.resume();
    }
    
    // Decode base64 to 16-bit PCM Int16Array
    const binary = atob(b64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(len / 2));
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const audioBuffer = this.playbackCtx.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);

    const source = this.playbackCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.playbackCtx.destination);

    const now = this.playbackCtx.currentTime;
    if (this.nextAudioPlayTime < now) {
      this.nextAudioPlayTime = now + 0.03; // 30ms jitter buffer
      if (!this.firstAudioTime) {
        this.firstAudioTime = performance.now();
        if (this.speechEndTime) {
          const lat = Math.round(this.firstAudioTime - this.speechEndTime);
          this.updateDiagPlayback(`${lat} ms`);
        }
      }
    }

    source.start(this.nextAudioPlayTime);
    this.nextAudioPlayTime += audioBuffer.duration;
    this.activeSources.push(source);

    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) this.activeSources.splice(idx, 1);
    };

    narratorController.transitionState(TutorState.STREAMING_AI_AUDIO);
  }

  playMp3Chunk(b64Data) {
    const audio = new Audio("data:audio/mp3;base64," + b64Data);
    this.activeSources.push(audio);
    audio.play().catch(() => {});
    audio.onended = () => {
      const idx = this.activeSources.indexOf(audio);
      if (idx !== -1) this.activeSources.splice(idx, 1);
    };
  }

  stopPlayback() {
    this.activeSources.forEach(s => {
      try {
        if (s.stop) s.stop();
        if (s.pause) s.pause();
        if (s.disconnect) s.disconnect();
      } catch(e) {}
    });
    this.activeSources = [];
    if (this.playbackCtx) {
      this.nextAudioPlayTime = this.playbackCtx.currentTime;
    }
    this.firstAudioTime = null;
  }

  setMicUIActive(isActive) {
    updateAskTeacherVoiceBtnState('recording');
    const btn = el('micToggleBtn');
    const dot = el('micDot');
    const text = el('micText');
    const doneBtn = el('micDoneBtn');
    if (dot) {
      dot.style.background = '#10b981';
      dot.style.animation = 'pulseRed 1.2s infinite';
    }
    if (text) text.textContent = 'Listening...';
    if (btn) btn.style.background = '#ecfdf5';
    if (doneBtn) doneBtn.classList.remove('hidden');
  }

  setMicUIProcessing() {
    updateAskTeacherVoiceBtnState('processing');
    const dot = el('micDot');
    const text = el('micText');
    const doneBtn = el('micDoneBtn');
    if (dot) {
      dot.style.background = '#0066cc';
      dot.style.animation = 'pulseBlue 1.2s infinite';
    }
    if (text) text.textContent = 'Understanding speech...';
    if (doneBtn) doneBtn.classList.add('hidden');
  }

  resetMicUI() {
    updateAskTeacherVoiceBtnState('idle');
    const btn = el('micToggleBtn');
    const dot = el('micDot');
    const text = el('micText');
    const doneBtn = el('micDoneBtn');
    if (dot) {
      dot.style.background = '#8fa4b8';
      dot.style.animation = 'none';
    }
    if (text) text.textContent = 'Voice Question';
    if (btn) btn.style.background = '#f5f8fb';
    if (doneBtn) doneBtn.classList.add('hidden');
  }

  updateDiagMic(val) { const e = el('diagMicStatus'); if (e) e.textContent = val; }
  updateDiagInputDevice(val) { const e = el('diagInputDevice'); if (e) e.textContent = val; }
  updateDiagChunks(sent, dropped) {
    const s = el('diagChunksSent'); if (s) s.textContent = sent;
    const d = el('diagChunksDropped'); if (d) d.textContent = dropped;
  }
  updateDiagWs(val) { const e = el('diagWsStatus'); if (e) e.textContent = val; }
  updateDiagSpeechState(val) { const e = el('diagSpeechState'); if (e) e.textContent = val; }
  updateDiagRms(rms) { const e = el('diagRms'); if (e) e.textContent = rms.toFixed(4); }
  updateDiagTranscript(val) { const e = el('diagInputTranscript'); if (e) e.textContent = `"${val}"`; }
  updateDiagFirstAudio(val) { const e = el('diagFirstAudio'); if (e) e.textContent = val; }
  updateDiagPlayback(val) { const e = el('diagPlayback'); if (e) e.textContent = val; }
  updateDiagModel(val) { const e = el('diagModel'); if (e) e.textContent = val; }
}

function toggleStudentMicrophone() {
  if (!window.liveAudioClient) {
    window.liveAudioClient = new LiveAudioClient(narratorController ? narratorController.schoolId : 'NIS');
  }
  if (!window.liveAudioClient.isRecording) {
    window.liveAudioClient.startListening();
  } else {
    window.liveAudioClient.stopListening();
  }
}

// Auto-mount Voice Inquiry UI on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupVoiceInquiryUI);
} else {
  setTimeout(setupVoiceInquiryUI, 300);
}


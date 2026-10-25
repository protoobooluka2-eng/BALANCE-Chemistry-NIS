/* ============================================================
   BALANCE Chemistry — Smart Narration Controller
   Pre-Generated Audio Library Edition

   Replaces real-time Gemini TTS for experiment narration with:
   - Pre-generated Sulafat MP3 library (audio_library/clips/)
   - Shuffle-bag variation selection (no consecutive repeats)
   - Immediate interruption on student action change
   - Zero real-time TTS during experiment explanation
   - Full fallback to text transcript when audio unavailable

   Only /api/tutor/question (Ask AI Teacher) uses real-time Gemini.
   ============================================================ */

// ──────────────────────────────────────────────────────────────────
// Library Manifest Loader
// The manifest is loaded once at startup and cached.
// If unavailable, the controller operates in graceful text-only mode.
// ──────────────────────────────────────────────────────────────────
class NarrationLibrary {
  constructor() {
    this.manifest   = null;   // { clips: { "lab01/crystal_dropped/v1": { path, text, ... } } }
    this.scripts    = null;   // narration_scripts.json — used for text fallback
    this.ready      = false;
    this.loadError  = null;
    this.lastTemperatures = new Map([['lab08', 25], ['lab09', 450]]);
  }

  async load(backendUrl = '') {
    // NOTE: backendUrl is intentionally NOT used for manifest/scripts fetches.
    // Audio assets are static files served from the same origin as the page.
    // Using relative paths (no base prefix) ensures correct resolution on both:
    //   localhost  → http://localhost:8085/audio_library/manifest.json
    //   GitHub Pages → https://protoobooluka2-eng.github.io/BALANCE-Chemistry-BISC/audio_library/manifest.json
    // The backendUrl parameter is kept in the signature so callers don't need changes.
    try {
      // Load manifest (tracks which clips exist as audio files)
      const mRes = await fetch('audio_library/manifest.json');
      if (mRes.ok) {
        this.manifest = await mRes.json();
      }

      // Load scripts for text fallback
      const sRes = await fetch('audio_library/narration_scripts.json');
      if (sRes.ok) {
        this.scripts = await sRes.json();
      }

      this.ready = true;
      const clipCount = this.manifest ? Object.keys(this.manifest.clips || {}).length : 0;
      const scriptCount = this._countScripts();
      console.log(`[NarrationLibrary] Ready — ${clipCount} audio clips, ${scriptCount} script entries`);
    } catch (e) {
      this.loadError = e;
      this.ready = true; // continue in text-only mode
      console.warn('[NarrationLibrary] Manifest unavailable — text-only mode:', e.message);
    }
  }

  _countScripts() {
    if (!this.scripts) return 0;
    let n = 0;
    for (const lab of Object.values(this.scripts)) {
      if (lab.events) n += Object.keys(lab.events).length;
    }
    return n;
  }

  /**
   * Resolve event ID, normalising dynamic field variants and scientific states.
   * Compares previous and current values for sliders (strictly delta comparison); never defaults blindly.
   */
  normaliseEventId(actionId, event, tempTracker = null) {
    if (!event) return actionId;
    const tracker = tempTracker || this.lastTemperatures;

    // Lab 07: Cobalt complex equilibrium shifts
    if (actionId === 'reagent_added') {
      const shift = event.shift || event.reagent;
      if (shift === 'pink' || shift === 'water') return 'reagent_added_water';
      if (shift === 'blue' || shift === 'chloride') return 'reagent_added_chloride';
      return 'reagent_added'; // Do not guess pink/blue if unspecified
    }

    // Lab 08: NO2 / N2O4 Temperature baths
    if (actionId === 'bath_applied') {
      const bath = event.bath;
      if (bath === 'hot') return 'bath_applied_hot';
      if (bath === 'cold') return 'bath_applied_cold';
      return 'bath_applied'; // Do not guess hot/cold if unspecified
    }

    // Lab 08: Temperature slider direction (Delta Comparison: previous vs current value)
    if (actionId === 'temp_slider_changed' && (event.labId === 'lab08' || !event.labId)) {
      if (typeof event.value === 'number' && tracker) {
        const prev = tracker.get('lab08');
        tracker.set('lab08', event.value);
        if (prev !== undefined) {
          const delta = event.value - prev;
          if (delta > 1) return 'temp_slider_heating';
          if (delta < -1) return 'temp_slider_cooling';
        }
      }
      return 'temp_slider_changed';
    }

    // Lab 09: Catalyst ON vs OFF (Explicit boolean check from payload)
    if (actionId === 'catalyst_toggled') {
      if (event.value === 1 || event.value === true) return 'catalyst_toggled_on';
      if (event.value === 0 || event.value === false) return 'catalyst_toggled_off';
      return 'catalyst_toggled'; // Unspecified state
    }

    // Lab 09: Furnace temperature direction (Delta Comparison: previous vs current value)
    if (actionId === 'temperature_slider_changed' && (event.labId === 'lab09' || !event.labId)) {
      if (typeof event.value === 'number' && tracker) {
        const prev = tracker.get('lab09');
        tracker.set('lab09', event.value);
        if (prev !== undefined) {
          const delta = event.value - prev;
          if (delta > 5) return 'temperature_slider_increasing';
          if (delta < -5) return 'temperature_slider_decreasing';
        }
      }
      return 'temperature_slider_changed';
    }

    // Lab 02: Excess reagent addition
    if (actionId === 'excess_reagent_added' || actionId === 'excessBtn') {
      return 'excess_reagent_added';
    }

    // Error and misconception events
    if (actionId === 'crystal_drop_failed') return 'crystal_drop_failed';
    if (actionId === 'tile_wrong_side') return 'tile_wrong_side';
    if (actionId === 'litmus_tested_unheated') return 'litmus_tested_unheated';

    // Direct ion inspections
    if (actionId === 'ion_tap_na' || actionId === 'ion_tap_cl') {
      return actionId;
    }

    return actionId;
  }

  /**
   * Get all variation texts for a lab/event.
   * Returns array of { text, audioPath, variationNum } objects.
   */
  getVariations(labId, eventId) {
    const variations = [];

    // Get texts from scripts
    const labScripts = this.scripts && this.scripts[labId];
    const eventTexts = labScripts && labScripts.events && labScripts.events[eventId];
    if (!eventTexts || eventTexts.length === 0) return [];

    for (let i = 0; i < eventTexts.length; i++) {
      const varNum = i + 1;
      const manifestKey = `${labId}/${eventId}/v${varNum}`;
      const clipData = this.manifest && this.manifest.clips && this.manifest.clips[manifestKey];

      variations.push({
        variationNum: varNum,
        text: eventTexts[i],
        audioPath: clipData ? clipData.path : null,
        hasAudio: !!(clipData && clipData.size_bytes > 5000),
      });
    }

    return variations;
  }

  hasEvent(labId, eventId) {
    return this.getVariations(labId, eventId).length > 0;
  }
}

// ──────────────────────────────────────────────────────────────────
// Shuffle-Bag: non-repeating variation selector
// Exhausts all options before recycling, never plays same variation twice in a row
// ──────────────────────────────────────────────────────────────────
class ShuffleBag {
  constructor() {
    this.bags = new Map(); // key → { remaining: [], played: [], lastPlayed: null }
  }

  pick(key, totalCount) {
    if (totalCount === 0) return 0;
    if (totalCount === 1) return 0;

    let bag = this.bags.get(key);
    if (!bag) {
      bag = { remaining: [], played: [], lastPlayed: null };
      this.bags.set(key, bag);
    }

    // Refill when exhausted (but never start with the last played)
    if (bag.remaining.length === 0) {
      const pool = Array.from({ length: totalCount }, (_, i) => i);
      // Shuffle Fisher-Yates
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      // Avoid starting with lastPlayed
      if (bag.lastPlayed !== null && pool[0] === bag.lastPlayed && pool.length > 1) {
        const swapIdx = Math.floor(Math.random() * (pool.length - 1)) + 1;
        [pool[0], pool[swapIdx]] = [pool[swapIdx], pool[0]];
      }
      bag.remaining = pool;
      bag.played = [];
    }

    const chosen = bag.remaining.shift();
    bag.played.push(chosen);
    bag.lastPlayed = chosen;
    return chosen;
  }

  reset(key) {
    this.bags.delete(key);
  }

  resetAll() {
    this.bags.clear();
  }
}

// ──────────────────────────────────────────────────────────────────
// Smart Narration Controller
// Drop-in replacement for the DYNAMIC_TTS route in HybridNarrationOrchestrator
// ──────────────────────────────────────────────────────────────────
class SmartNarrationController {
  constructor(orchestrator) {
    this.orchestrator = orchestrator; // HybridNarrationOrchestrator reference
    this.library      = new NarrationLibrary();
    this.shuffleBag   = new ShuffleBag();

    // Repeat-prevention: track the last event key played per-lab
    this.lastEventKey = null;

    // Scientific state tracker for context awareness
    this.currentLabId   = 'lab01';
    this.lastActionId   = null;
    this.lastEventTime  = 0;

    // Active audio reference (managed externally via orchestrator.currentAudio)
    this._backendUrl = '';

    // Preload cache: { audioPath → objectURL } for sub-millisecond start
    this.preloadCache = new Map();
    this.preloadQueue = [];
    this._preloading  = false;
  }

  async init(backendUrl = '') {
    this._backendUrl = backendUrl;
    await this.library.load(backendUrl);
    // Start preloading intro clip for the default lab
    this._schedulePreload('lab01', 'lab_intro_loaded');
  }

  // ── Public API ──────────────────────────────────────────────────

  /**
   * Called when the active lab changes.
   */
  onLabChanged(labId) {
    this.currentLabId = labId;
    this.lastEventKey = null;
    this.lastActionId = null;
    if (labId === 'lab08') this.library.lastTemperatures.set('lab08', 25);
    if (labId === 'lab09') this.library.lastTemperatures.set('lab09', 450);
    // Preload intro for new lab
    this._schedulePreload(labId, 'lab_intro_loaded');
  }

  /**
   * Main entry point. Called by the orchestrator instead of playDynamicNarration.
   * Returns true if handled, false if no library clip available.
   */
  async playLibraryClip(labId, actionId, event, sessionToken, labNum, prevPlayback) {
    const orch = this.orchestrator;
    if (!orch.narratorEnabled || sessionToken !== orch.generation) return false;

    const normId = this.library.normaliseEventId(actionId, event);
    const eventKey = `${labId}/${normId}`;

    // Prevent re-explaining the exact same event < 12s after last play
    // Exception: always play if this is a different *scientifically meaningful* state
    const now = Date.now();
    const sameEvent = (this.lastEventKey === eventKey);
    const tooSoon   = sameEvent && (now - this.lastEventTime) < 12000;
    if (tooSoon) {
      orch.transitionState(TutorState.ACTIVE_IDLE);
      return true; // handled (silence)
    }

    const variations = this.library.getVariations(labId, normId);
    if (variations.length === 0) {
      // Not in library — return false so caller can fall back
      return false;
    }

    // Pick variation via shuffle-bag
    const bagKey = eventKey;
    const chosenIdx = this.shuffleBag.pick(bagKey, variations.length);
    const chosen = variations[chosenIdx];

    // Track state
    this.currentTranscript = chosen.text;
    this.currentVariationNum = chosen.variationNum;
    orch.currentTranscript = chosen.text;
    orch.currentVariationNum = chosen.variationNum;
    this.lastEventKey  = eventKey;
    this.lastActionId  = normId;
    this.lastEventTime = now;

    // ── Interrupt any current audio immediately ──
    const cancelReason = orch.currentAudio ? 'superseded_by_action' : 'none';
    orch.interruptCurrentAudio(cancelReason);

    // Re-check after interrupt (generation may have changed)
    if (sessionToken !== orch.generation - 1 && sessionToken !== orch.generation) return true;
    const activeToken = orch.generation;

    // ── Update status bar ──
    const statusEl = (typeof el === 'function') ? el('narrationStatus') : document.getElementById('narrationStatus');
    if (statusEl) {
      statusEl.textContent = `Miss Balance: ${chosen.text.slice(0, 90)}${chosen.text.length > 90 ? '…' : ''}`;
    }
    const descEl = (typeof el === 'function') ? el('audioDescription') : document.getElementById('audioDescription');
    if (descEl) descEl.textContent = chosen.text;

    // ── Preload next likely variations ──
    this._schedulePreload(labId, normId);

    // ── Try audio ──
    if (chosen.hasAudio && chosen.audioPath) {
      const played = await this._playAudioFile(chosen.audioPath, activeToken, chosen.text, event, labNum, prevPlayback);
      if (played) return true;
    }

    // ── Audio unavailable — show text only ──
    if (statusEl) {
      statusEl.textContent = `🟣 Miss Balance: ${chosen.text} [Voice loading...]`;
    }
    orch.transitionState(TutorState.ACTIVE_IDLE);
    this._logLibraryDiagnostic(event, labNum, normId, chosenIdx, 'text_only', prevPlayback);
    return true;
  }

  // ── Internal helpers ─────────────────────────────────────────────

  _resolveUrl(path) {
    // Audio clips are static assets co-located with the page.
    // Always return a relative path so the browser resolves it correctly on:
    //   localhost  → http://localhost:8085/audio_library/clips/...
    //   GitHub Pages → https://.../BALANCE-Chemistry-BISC/audio_library/clips/...
    // this._backendUrl is preserved for any future use by other subsystems.
    return (path || '').replace(/^\/+/, '');
  }

  async _playAudioFile(audioPath, token, text, event, labNum, prevPlayback) {
    const orch = this.orchestrator;
    if (token !== orch.generation) return false;

    // Check preload cache first (sub-millisecond start)
    let src = this.preloadCache.get(audioPath);
    if (!src) {
      // Serve from backend URL or relative path
      src = this._resolveUrl(audioPath);
    }

    const audio = new Audio();
    orch.currentAudio  = audio;
    orch.currentClipKey = audioPath;

    return new Promise((resolve) => {
      audio.onplay = () => {
        if (token !== orch.generation) { orch.safelyStopAudio(audio); return; }
        orch.transitionState(TutorState.PLAYING_CACHED_AUDIO);
        this._logLibraryDiagnostic(event, labNum, audioPath, -1, 'playing', prevPlayback);
      };

      audio.onended = () => {
        if (token === orch.generation) {
          orch.currentAudio   = null;
          orch.currentClipKey = null;
          orch.transitionState(TutorState.ACTIVE_IDLE);
        }
        resolve(true);
      };

      audio.onerror = () => {
        if (token === orch.generation) {
          orch.currentAudio   = null;
          orch.currentClipKey = null;
        }
        resolve(false); // fall through to text-only
      };

      audio.src = src;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          if (token === orch.generation) {
            orch.currentAudio   = null;
            orch.currentClipKey = null;
          }
          resolve(false);
        });
      }
    });
  }

  _schedulePreload(labId, eventId) {
    this.preloadQueue.push({ labId, eventId });
    if (!this._preloading) this._processPreloadQueue();
  }

  async _processPreloadQueue() {
    this._preloading = true;
    while (this.preloadQueue.length > 0) {
      const { labId, eventId } = this.preloadQueue.shift();
      const normId = eventId;
      const variations = this.library.getVariations(labId, normId);
      for (const v of variations) {
        if (v.hasAudio && v.audioPath && !this.preloadCache.has(v.audioPath)) {
          try {
            const targetUrl = this._resolveUrl(v.audioPath);
            const resp = await fetch(targetUrl);
            if (resp.ok) {
              const blob = await resp.blob();
              const url  = URL.createObjectURL(blob);
              this.preloadCache.set(v.audioPath, url);
            }
          } catch (e) {
            // preload best-effort; no error propagation
          }
        }
      }
      // small yield between preloads
      await new Promise(r => setTimeout(r, 50));
    }
    this._preloading = false;
  }

  _logLibraryDiagnostic(event, labNum, clipKey, varIdx, status, prevPlayback) {
    const orch = this.orchestrator;
    if (typeof orch.logDiagnostic === 'function') {
      orch.logDiagnostic({
        event: event.actionId || event.type || 'unknown',
        outcome: event.outcome || 'LIBRARY_CLIP',
        lab: labNum,
        stateVersion: event.stateVersion || 1,
        enabled: orch.narratorEnabled,
        prevPlayback,
        cancelReason: 'none',
        newAudio: clipKey,
        loadingStatus: status,
        playbackResult: status === 'playing' ? 'PLAYING_CACHED_AUDIO' : 'ACTIVE_IDLE',
        suppressionReason: 'none',
        recoveryResult: 'READY',
        nextActionReady: 'READY',
        variantIndex: varIdx,
        source: 'PRE_GENERATED_LIBRARY'
      });
    }
  }

  /**
   * Reset shuffle-bags when student resets/changes lab.
   */
  resetForLab(labId) {
    this.currentLabId = labId;
    this.lastEventKey = null;
    this.lastActionId = null;
    this.shuffleBag.resetAll();
    this.preloadCache.clear();
    this.preloadQueue = [];
  }

  /**
   * Audit: returns coverage report for current library state.
   */
  getCoverageReport() {
    if (!this.library.scripts) return { error: 'Scripts not loaded' };
    const report = {};
    for (const [labId, lab] of Object.entries(this.library.scripts)) {
      if (labId.startsWith('_')) continue;
      report[labId] = { name: lab.name, events: {} };
      for (const [eventId, texts] of Object.entries(lab.events || {})) {
        const vars = this.library.getVariations(labId, eventId);
        const audioReady = vars.filter(v => v.hasAudio).length;
        report[labId].events[eventId] = {
          totalVariations: vars.length,
          audioReady,
          textOnly: vars.length - audioReady,
          covered: vars.length > 0
        };
      }
    }
    return report;
  }
}

// ──────────────────────────────────────────────────────────────────
// Export / Global Registration
// Loaded before hybrid_ai_engine.js — makes SmartNarrationController
// available globally so the orchestrator can use it.
// ──────────────────────────────────────────────────────────────────
window.SmartNarrationController = SmartNarrationController;
window.NarrationLibrary         = NarrationLibrary;
window.ShuffleBag               = ShuffleBag;

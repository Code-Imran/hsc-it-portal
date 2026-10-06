/**
 * Browser-only persistence for the mock exam. This is crash recovery and
 * single-tab coordination, not identity verification or tamper-proof storage.
 *
 * @typedef {import("../../types/exam-session").ExamSession} ExamSession
 * @typedef {import("../../types/exam-session").StudentProfile} StudentProfile
 */

const SESSION_KEY = "hsc_it_session";
const TAB_BINDING_KEY = "hsc_it_session_tab";
const TAB_LOCK_KEY = "hsc_it_session_tab_lock";
const LOCK_HEARTBEAT_MS = 20_000;
const LOCK_TTL_MS = 90_000;
const EXAM_DURATION_SECONDS = 150 * 60;

/**
 * @param {string} stream
 * @returns {97 | 99}
 */
export function subjectCodeForStream(stream) {
  if (stream === "science") return 97;
  if (stream === "commerce") return 99;
  throw new Error("Unsupported exam stream.");
}

function readSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const session = JSON.parse(raw);
  if (
    !session ||
    session.schemaVersion !== 1 ||
    typeof session.id !== "string" ||
    !session.student ||
    !session.answers?.draft ||
    !session.answers?.submitted ||
    !session.exam ||
    typeof session.exam.durationSeconds !== "number"
  ) {
    throw new Error("Saved exam session is invalid. Clear it before starting a new exam.");
  }
  return session;
}

function writeSession(session) {
  session.updatedAt = new Date().toISOString();
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createTabId() {
  return createId();
}

function readTabBinding() {
  const raw = sessionStorage.getItem(TAB_BINDING_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeTabBinding(sessionId) {
  const binding = { sessionId, tabId: createTabId() };
  sessionStorage.setItem(TAB_BINDING_KEY, JSON.stringify(binding));
  return binding;
}

/**
 * Return the current unfinished session, if any.
 * @returns {ExamSession | null}
 */
export function getActiveSession() {
  const session = readSession();
  return session?.status === "in_progress" ? session : null;
}

/**
 * Start a session, returning an existing same-roll session unless explicitly replaced.
 * @param {StudentProfile} studentData
 * @param {{ replaceExisting?: boolean }} [options]
 * @returns {ExamSession}
 */
export function initSession(studentData, { replaceExisting = false } = {}) {
  const studentName = studentData.studentName.trim();
  const rollNo = studentData.rollNo.trim().toUpperCase();
  const stream = studentData.stream;
  const subjectCode = subjectCodeForStream(stream);

  if (!studentName || !/^[A-Z0-9]{4,12}$/.test(rollNo)) {
    throw new Error("Enter a name and a valid 4–12 character alphanumeric seat number.");
  }

  const existing = getActiveSession();
  if (existing && !replaceExisting) {
    if (existing.student.rollNo === rollNo) return existing;
    throw new Error("Another student's exam is already in progress in this browser.");
  }

  if (existing && replaceExisting) {
    localStorage.removeItem(TAB_LOCK_KEY);
    sessionStorage.removeItem(TAB_BINDING_KEY);
  }

  const now = new Date().toISOString();
  /** @type {ExamSession} */
  const session = {
    schemaVersion: 1,
    id: createId(),
    student: { studentName, rollNo, stream, subjectCode },
    status: "in_progress",
    createdAt: now,
    updatedAt: now,
    examStartedAt: null,
    completedAt: null,
    answers: { draft: {}, submitted: {} },
    exam: {
      durationSeconds: EXAM_DURATION_SECONDS,
      secondsRemaining: EXAM_DURATION_SECONDS,
      totalMarks: 80,
      objectiveMarks: 50,
      activeSection: "q1",
      objectiveScore: null,
      tabSwitchCount: 0
    }
  };

  writeSession(session);
  writeTabBinding(session.id);
  return session;
}

/**
 * Bind this browser tab to the current unfinished session.
 * @param {string} sessionId
 * @returns {ExamSession}
 */
export function resumeSession(sessionId) {
  const session = getActiveSession();
  if (!session || session.id !== sessionId) {
    throw new Error("That unfinished exam session could not be found.");
  }

  const binding = readTabBinding();
  if (!binding || binding.sessionId !== sessionId) writeTabBinding(sessionId);
  return session;
}

/**
 * Set the actual exam start time once, after instructions are confirmed.
 * @returns {ExamSession}
 */
export function beginExam() {
  const session = getActiveSession();
  if (!session) throw new Error("No unfinished exam session is available.");
  if (!session.examStartedAt) {
    session.examStartedAt = new Date().toISOString();
    writeSession(session);
  }
  return session;
}

/**
 * Persist crash-recovery progress for the currently active session.
 * @param {Partial<ExamSession["answers"]> & { secondsRemaining?: number; activeSection?: string; tabSwitchCount?: number; paper?: ExamSession["exam"]["paper"] }} progress
 * @returns {ExamSession}
 */
export function saveSessionProgress(progress) {
  const session = getActiveSession();
  if (!session) throw new Error("No unfinished exam session is available.");

  if (progress.draft) session.answers.draft = progress.draft;
  if (progress.submitted) session.answers.submitted = progress.submitted;
  if (Number.isFinite(progress.secondsRemaining)) {
    session.exam.secondsRemaining = Math.max(0, Math.min(
      session.exam.durationSeconds,
      Number(progress.secondsRemaining)
    ));
  }
  if (typeof progress.activeSection === "string") session.exam.activeSection = progress.activeSection;
  if (progress.paper) session.exam.paper = progress.paper;
  if (Number.isFinite(progress.tabSwitchCount)) {
    session.exam.tabSwitchCount = Math.max(0, Number(progress.tabSwitchCount));
  }

  writeSession(session);
  return session;
}

/**
 * Mark an exam completed and persist its objective score.
 * @param {number} objectiveScore
 * @returns {ExamSession}
 */
export function completeSession(objectiveScore) {
  const session = getActiveSession();
  if (!session) throw new Error("No unfinished exam session is available.");

  session.status = "completed";
  session.completedAt = new Date().toISOString();
  session.exam.objectiveScore = Math.max(0, Math.min(session.exam.objectiveMarks, objectiveScore));
  writeSession(session);
  localStorage.removeItem(TAB_LOCK_KEY);
  sessionStorage.removeItem(TAB_BINDING_KEY);
  return session;
}

/**
 * Acquire and maintain a cross-tab lease; report focus changes without pretending
 * client-side storage can prevent a determined user from tampering with it.
 * @param {{ onLockout?: (message: string) => void; onActivityWarning?: (count: number) => void }} [callbacks]
 * @returns {() => void} Cleanup function for page teardown.
 */
export function bindTabProtection({ onLockout = () => {}, onActivityWarning = () => {} } = {}) {
  const session = getActiveSession();
  if (!session) {
    onLockout("No active exam session was found.");
    return () => {};
  }

  let binding = readTabBinding();
  if (!binding || binding.sessionId !== session.id) binding = writeTabBinding(session.id);

  let stopped = false;
  let lastActivityAt = 0;
  const now = Date.now;

  const loseLock = (message) => {
    if (stopped) return;
    stopped = true;
    clearInterval(heartbeatId);
    onLockout(message);
  };

  const readLock = () => {
    const raw = localStorage.getItem(TAB_LOCK_KEY);
    return raw ? JSON.parse(raw) : null;
  };

  const acquire = () => {
    const current = readLock();
    if (current && current.expiresAt > now() && current.tabId !== binding.tabId) return false;

    const next = {
      sessionId: session.id,
      tabId: binding.tabId,
      expiresAt: now() + LOCK_TTL_MS
    };
    localStorage.setItem(TAB_LOCK_KEY, JSON.stringify(next));
    return readLock()?.tabId === binding.tabId;
  };

  if (!acquire()) {
    onLockout("This exam is already open in another tab. Return to that tab to continue.");
    return () => {};
  }

  const heartbeatId = setInterval(() => {
    if (!acquire()) loseLock("This exam was opened in another tab. This tab is now locked.");
  }, LOCK_HEARTBEAT_MS);

  const onStorage = (event) => {
    if (event.key === TAB_LOCK_KEY) {
      const lock = readLock();
      if (lock && lock.expiresAt > now() && lock.tabId !== binding.tabId) {
        loseLock("This exam was opened in another tab. This tab is now locked.");
      }
    } else if (event.key === SESSION_KEY) {
      const latest = readSession();
      if (!latest || latest.id !== session.id || latest.status !== "in_progress") {
        loseLock("This exam session changed or was completed in another tab.");
      }
    }
  };

  const recordActivity = () => {
    const timestamp = now();
    if (timestamp - lastActivityAt < 1_000 || stopped) return;
    lastActivityAt = timestamp;
    const latest = getActiveSession();
    if (!latest || latest.id !== session.id) return;
    latest.exam.tabSwitchCount += 1;
    writeSession(latest);
    onActivityWarning(latest.exam.tabSwitchCount);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") recordActivity();
  };
  const onBlur = () => {
    if (document.visibilityState === "visible") recordActivity();
  };
  const onPageHide = () => {
    const lock = readLock();
    if (lock?.tabId === binding.tabId) localStorage.removeItem(TAB_LOCK_KEY);
  };

  window.addEventListener("storage", onStorage);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("blur", onBlur);
  window.addEventListener("pagehide", onPageHide);

  return () => {
    stopped = true;
    clearInterval(heartbeatId);
    window.removeEventListener("storage", onStorage);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("pagehide", onPageHide);
    const lock = readLock();
    if (lock?.tabId === binding.tabId) localStorage.removeItem(TAB_LOCK_KEY);
  };
}

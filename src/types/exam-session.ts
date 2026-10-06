export type ExamStream = "science" | "commerce";
export type ExamSessionStatus = "in_progress" | "completed";

export interface StudentProfile {
  studentName: string;
  rollNo: string;
  stream: ExamStream;
  subjectCode: 97 | 99;
}

export interface ExamAnswers {
  draft: Record<string, string | boolean | string[]>;
  submitted: Record<string, string | boolean | string[]>;
}

export interface ExamQuestion {
  id: string;
  q?: string;
  ans?: string | boolean | string[];
  opts?: string[];
  left?: string;
  title?: string;
}

export interface ExamSection {
  key: string;
  label: string;
  marks: string;
  sub: string;
  items: ExamQuestion[];
}

export interface ExamSession {
  schemaVersion: 1;
  id: string;
  student: StudentProfile;
  status: ExamSessionStatus;
  createdAt: string;
  updatedAt: string;
  examStartedAt: string | null;
  completedAt: string | null;
  answers: ExamAnswers;
  exam: {
    durationSeconds: number;
    secondsRemaining: number;
    totalMarks: 80;
    objectiveMarks: 50;
    activeSection: string;
    objectiveScore: number | null;
    tabSwitchCount: number;
    paper?: ExamSection[];
  };
}

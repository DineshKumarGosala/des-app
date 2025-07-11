// Type definitions for the Student Feedback System

export interface StudentData {
  joiningYear: string;
  branch: string;
  year: string;
  section: string;
  registrationNumber: string;
}

export interface FilteredOptions {
  joiningYears: string[];
  branches: string[];
  years: string[];
  sections: string[];
}

export interface SubjectTeacherData {
  subject: string;
  teacher: string;
  questions: string[];
}

export interface AdminConfig {
  subjects: SubjectTeacherData[];
  questions: string[];
}

export interface FeedbackResponse {
  subject: string;
  teacher: string;
  ratings: { [questionIndex: number]: number };
}

export interface FeedbackSubmission {
  studentData: StudentData;
  responses: FeedbackResponse[];
  submissionTime: string;
}

// Electron API types
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      showSaveDialog: () => Promise<{ canceled: boolean; filePath?: string }>;
      showErrorDialog: (title: string, content: string) => Promise<void>;
      showInfoDialog: (title: string, message: string) => Promise<{ response: number }>;
      onNavigateToHome: (callback: () => void) => void;
      platform: string;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
    };
  }
}

export {};

// Google Sheets API types
export interface SheetRow {
  JoiningYear: string;
  Branch: string;
  Year: string;
  Section: string;
  Subject: string;
  Teacher: string;
  [key: string]: string; // For dynamic question columns
}

export interface GoogleSheetsConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
}


export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  nim?: string;
  email?: string;
  role: UserRole;
  avatar?: string;
}

export interface Seminar {
  id: string;
  studentName: string;
  nim: string;
  type: 'Proposal' | 'Hasil' | 'Sidang';
  title: string;
  date: string;
  time: string;
  room: string;
  ketua: string;
  penguji1: string;
  penguji2?: string;
  pembimbing1: string;
  pembimbing2: string;
  status: 'Pending Scheduling' | 'Scheduled' | 'Finished' | 'Canceled';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Feedback {
  id: string;
  date: string;
  content: string;
  facultyName: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  topic: string;
  notes: string;
  status: 'Valid' | 'Revisi' | 'Pending';
}

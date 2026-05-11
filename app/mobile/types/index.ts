import type { TagTone } from '@/constants';

// ── User ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  studentId: string;
  department: string;
  year: number;
  gpa: number;
  initials: string;
}

// ── Course / Schedule ─────────────────────────────────────────────────────
export type CourseTone = 'blue' | 'sky' | 'purple' | 'gold';

export interface Course {
  id: string;
  name: string;
  room: string;
  professor: string;
  day: number;        // 0=Mon … 4=Fri
  startHour: number;  // e.g. 10.5 = 10:30
  duration: number;   // hours
  tone: CourseTone;
  isLive?: boolean;
  type: '전공필수' | '전공선택' | '교양필수' | '교양선택';
}

// ── Notice ────────────────────────────────────────────────────────────────
export interface Notice {
  id: string;
  tag: string;
  tone: TagTone;
  date: string;
  title: string;
  summary: string;
}

// ── Academic Event ────────────────────────────────────────────────────────
export interface AcademicEvent {
  id: string;
  date: string;
  tag: string;
  tone: TagTone;
  title: string;
  subtitle: string;
}

// ── Chat ──────────────────────────────────────────────────────────────────
export interface ChatSource {
  tag: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isTyping?: boolean;
  sources?: ChatSource[];
  timestamp: Date;
}

// ── Note ──────────────────────────────────────────────────────────────────
export interface Note {
  id: string;
  title: string;
  course: string;
  createdAt: string;
  tags: string[];
  linkedCount: number;
  isWeak?: boolean;
}

// ── Map ───────────────────────────────────────────────────────────────────
export type RouteProfile = 'fast' | 'balanced' | 'accessible';

export interface RouteStep {
  icon: string;
  description: string;
  time: string;
  isWarning?: boolean;
}

export interface RouteInfo {
  profile: RouteProfile;
  duration: string;
  stairs: number;
  elevators: number;
  slope: string;
  label: string;
  steps: RouteStep[];
}

// ── Navigation ────────────────────────────────────────────────────────────
export type TabRoute = 'home' | 'chat' | 'schedule' | 'map' | 'notes';

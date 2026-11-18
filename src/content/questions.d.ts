// Types for questions.js (plain JavaScript content, shared with the earlier app)
import type { Text } from '../lib/i18n';

// [value, label, picture code, only for this group]
export type QOpt = [string, Text, string?, string?];

export type Question = {
  text: Text;
  type?: 'text';
  opts?: QOpt[];
  grp?: 'A' | 'B';
  show?: (answers: Record<string, string>) => boolean;
  ans?: string;
  optional?: boolean;
};

export type Instrument = {
  audience: 'parent' | 'junior' | 'senior';
  title: Text;
  mins: number;
  qs: string[];
  optional?: boolean;
  icon?: string;
  color?: string;
};

export type StudyPlan = { base: [string, string][]; check: string; final: [string, string][] };

export declare const Q: Record<string, Question>;
export declare const INSTR: Record<string, Instrument>;
export declare const PLAN: Record<'junior' | 'senior', StudyPlan>;

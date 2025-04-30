import { board } from '@prisma/client';

export interface Board extends board {
  rn: number;
  id: number;
  content: string;
  created_at: Date | null;
  updated_at: Date | null;
}
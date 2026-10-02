import { z } from 'zod';

export const SUBJECTS = ['maths', 'english', 'science'] as const;
export const KEY_STAGES = ['KS2', 'KS3', 'KS4'] as const;

/** England National Curriculum key stage for each school year covered by the app. */
export const KEY_STAGE_BY_YEAR = {
  5: 'KS2',
  6: 'KS2',
  7: 'KS3',
  8: 'KS3',
  9: 'KS3',
  10: 'KS4',
} as const;

export const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z]+-y\d{1,2}-\d{3,}$/, 'id must look like maths-y5-001'),
    subject: z.enum(SUBJECTS),
    keyStage: z.enum(KEY_STAGES),
    year: z.number().int().min(5).max(10),
    topic: z.string().min(1),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(5),
    correctIndex: z.number().int().min(0),
    explanation: z.string().min(1),
  })
  .superRefine((q, ctx) => {
    if (q.correctIndex >= q.options.length) {
      ctx.addIssue({ code: 'custom', message: 'correctIndex is outside options' });
    }
    if (new Set(q.options).size !== q.options.length) {
      ctx.addIssue({ code: 'custom', message: 'options must be unique' });
    }
    const expected = KEY_STAGE_BY_YEAR[q.year as keyof typeof KEY_STAGE_BY_YEAR];
    if (expected !== q.keyStage) {
      ctx.addIssue({ code: 'custom', message: `Year ${q.year} belongs to ${expected}` });
    }
  });

export const questionFileSchema = z.array(questionSchema).min(1);

export type Question = z.infer<typeof questionSchema>;

import { z } from 'zod';
import { CHENNAI_LANDMARKS } from '@/lib/constants';

const landmarkSet = new Set<string>(CHENNAI_LANDMARKS);

export const planJourneySchema = z
  .object({
    start: z.string().min(1, 'Starting point is required'),
    end: z.string().min(1, 'Destination is required'),
    selectedMode: z.string(),
    preferTime: z.boolean(),
    preferCost: z.boolean(),
    timeWeight: z.number().min(0).max(1),
    costWeight: z.number().min(0).max(1),
  })
  .refine((data) => data.start !== data.end, {
    message: 'Start and destination must be different',
    path: ['end'],
  })
  .refine(
    (data) => landmarkSet.has(data.start) || data.start.length > 0,
    { message: 'Use a known Chennai landmark', path: ['start'] },
  )
  .refine(
    (data) => landmarkSet.has(data.end) || data.end.length > 0,
    { message: 'Use a known Chennai landmark', path: ['end'] },
  );

export type PlanJourneyFormValues = z.infer<typeof planJourneySchema>;

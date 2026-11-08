import { z } from "zod";

const id = z.string().min(1);
const text = z.string();
const amount = z.number().finite().nonnegative();

export const guestRowsSchema = z.array(
  z.object({
    id,
    name: text,
    side: text,
    partySize: z.number().finite().int().positive(),
    rsvp: text,
  }),
);
export const budgetRowsSchema = z.array(
  z.object({
    id,
    label: text,
    category: text,
    estimated: amount,
    actual: amount,
  }),
);
export const checklistRowsSchema = z.array(
  z.object({
    id,
    title: text,
    category: text,
    done: z.boolean(),
  }),
);

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;

export function readPlannerRows<T>(
  storage: StorageReader,
  key: string,
  legacyKeys: readonly string[],
  schema: z.ZodType<T[]>,
): T[] | undefined {
  for (const candidate of [key, ...legacyKeys]) {
    try {
      const saved = storage.getItem(candidate);
      if (saved === null) continue;
      const result = schema.safeParse(JSON.parse(saved));
      if (result.success) return result.data;
    } catch {
      // A blocked store or damaged record must not crash a planning tool.
    }
  }
  return undefined;
}

export function writePlannerRows<T>(storage: StorageWriter, key: string, rows: T[]) {
  try {
    storage.setItem(key, JSON.stringify(rows));
    return true;
  } catch {
    return false;
  }
}

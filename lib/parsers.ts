export function toInt(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

export function toFloat(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

export function toIntArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const parsed = value
    .map((item) => toInt(item))
    .filter((item): item is number => item !== undefined);
  return Array.from(new Set(parsed));
}

export function pickEnumValue<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | undefined {
  if (typeof value === "string") {
    const lowered = value.toLowerCase();
    const found = allowed.find((item) => item === lowered);
    if (found) {
      return found;
    }
  }
  return undefined;
}

export function toDecimalString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    return Number.isNaN(Number.parseFloat(trimmed)) ? undefined : trimmed;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString();
  }
  return undefined;
}

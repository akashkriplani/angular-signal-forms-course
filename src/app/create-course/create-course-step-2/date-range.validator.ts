import { SchemaPath, validateTree } from "@angular/forms/signals";

export function dateRange<T>(
  path: SchemaPath<T>,
  startPath: SchemaPath<Date | null>,
  endPath: SchemaPath<Date | null>,
  message = "Start date must be before the end date.",
) {
  validateTree(path, ({ valueOf }) => {
    const start = valueOf(startPath);
    const end = valueOf(endPath);
    if (start && end && start >= end) {
      return { kind: "dateRange", message };
    }
  });
}

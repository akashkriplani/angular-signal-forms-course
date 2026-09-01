import {
  RootFieldContext,
  SchemaPath,
  validateAsync,
  validateHttp,
} from "@angular/forms/signals";
import { CourseListResponse } from "./step1.model";
import { resource } from "@angular/core";

// This is valid for async HTTP requests (Angular recommended)
// validateHttp() internally calls validateAsync() for HTTP requests
export function courseTitleExists(path: SchemaPath<string>) {
  validateHttp<string, CourseListResponse>(path, {
    request: (ctx: RootFieldContext<string>) =>
      ctx.value() ? "/api/courses" : undefined,
    onSuccess: (result, ctx) => {
      const found = result?.payload?.find(
        (c) => c.description.toLowerCase() === ctx.value()?.toLowerCase(),
      );

      return found
        ? { kind: "titleExists", message: "This title is already being used." }
        : null;
    },
    onError: () => null,
  });
}

// Compatible with websockets along with HTTP requests, connection to firebase, etc.
// Prefer for non-HTTP based async operations
// In here we have just called HTTP API, but we can use it for another other non-HTTP async operations
// validateAsync() is more verbose version than validateHttp()
// To be used only for async non-HTTP requests like db connection, fetching something asynchronously
export function courseTitleExistsAsync(path: SchemaPath<string>) {
  validateAsync<string, string, CourseListResponse>(path, {
    params: (ctx) => ctx.value() ?? "",
    factory: (params) =>
      resource({
        params,
        loader: async ({ params: title }) => {
          if (!title) return undefined;
          const res = await fetch("/api/courses");
          return (await res.json()) as CourseListResponse;
        },
      }),
    onSuccess: (result, ctx) => {
      const found = result?.payload?.find(
        (c) => c.description.toLowerCase() === ctx.value()?.toLowerCase(),
      );

      return found
        ? { kind: "titleExists", message: "This title is already being used." }
        : null;
    },
    onError: () => null,
  });
}

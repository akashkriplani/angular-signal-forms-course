import {
  assertInInjectionContext,
  effect,
  WritableSignal,
} from "@angular/core";
import { FieldTree } from "@angular/forms/signals";

export function withDraft<T>(
  form: FieldTree<T>,
  model: WritableSignal<T>,
  key: string,
) {
  // If you will call withDraft function outside constructor, it will give you compile time error.
  // assertInInjectionContext() prevents you from providing it anywhere outside constructor.
  // This is done to avoid memory leaks.
  // Inside constructor, if you call this, it is automatically destroyed by Angular.
  assertInInjectionContext(withDraft);

  const saved = localStorage.getItem(key);

  if (saved) {
    model.set(JSON.parse(saved));
  }

  effect(() => {
    const value = form().value();

    if (form().dirty()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
}

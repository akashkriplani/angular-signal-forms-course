import { Component, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import {
  debounce,
  form,
  FormField,
  FormRoot,
  minLength,
  maxLength,
  required,
} from "@angular/forms/signals";
import { FieldErrorComponent } from "../../field-error/field-error.component";
import { CourseCategory, STEP1_DEFAULT, Step1Data } from "./step1.model";
import { courseTitleExistsAsync } from "./course-title.validator";
import { withDraft } from "../with-draft";

@Component({
  selector: "create-course-step-1",
  templateUrl: "./create-course-step-1.component.html",
  styleUrls: ["./create-course-step-1.component.scss"],
  imports: [FormField, FormRoot, FieldErrorComponent],
})
export class CreateCourseStep1Component {
  private categoriesResource = httpResource<CourseCategory[]>(
    () => "/api/course-categories",
    {
      parse: (res: any) => res.categories as CourseCategory[],
      defaultValue: [] as CourseCategory[],
    },
  );
  courseCategories = this.categoriesResource.value;

  step1Model = signal<Step1Data>({ ...STEP1_DEFAULT });

  step1Form = form(this.step1Model, (path) => {
    required(path.title, { message: "Title is required." });
    minLength(path.title, 5, {
      message: "Title must be at least 5 characters.",
    });
    maxLength(path.title, 60, {
      message: "Title must be at most 60 characters.",
    });
    debounce(path.title, "blur");
    // courseTitleExists(path.title);
    courseTitleExistsAsync(path.title);
    required(path.downloadsAllowed, { message: "You must allow downloads." });

    required(path.releasedAt, { message: "Release date is required." });
    required(path.category, { message: "Category is required." });

    required(path.longDescription, { message: "Description is required." });
    minLength(path.longDescription, 3, {
      message: "Description must be at least 3 characters.",
    });
  });

  constructor() {
    withDraft(this.step1Form, this.step1Model, "step1");
  }
}

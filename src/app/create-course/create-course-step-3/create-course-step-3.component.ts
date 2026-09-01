import { Component, signal } from "@angular/core";
import {
  applyEach,
  form,
  FormField,
  FormRoot,
  required,
} from "@angular/forms/signals";
import { Step3Data } from "./step3.model";
import { FieldErrorComponent } from "../../field-error/field-error.component";
import { withDraft } from "../with-draft";

@Component({
  selector: "create-course-step-3",
  templateUrl: "create-course-step-3.component.html",
  styleUrls: ["create-course-step-3.component.scss"],
  imports: [FormRoot, FormField, FieldErrorComponent],
})
export class CreateCourseStep3Component {
  step3Model = signal<Step3Data>({ lessons: [] });

  step3Form = form(this.step3Model, (path) => {
    applyEach(path.lessons, (lessonPath) => {
      required(lessonPath.title, { message: "Title is required." });
      required(lessonPath.level, { message: "Level is required." });
    });
  });

  constructor() {
    withDraft(this.step3Form, this.step3Model, "step3");
  }

  addLesson() {
    this.step3Model.update((m) => ({
      ...m,
      lessons: [...m.lessons, { title: "", level: "" }],
    }));
  }

  deleteLesson(i: number) {
    this.step3Model.update((m) => ({
      ...m,
      lessons: m.lessons.filter((_, idx) => idx !== i),
    }));
  }
}

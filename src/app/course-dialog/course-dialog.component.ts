import { Component, input, linkedSignal, output, signal } from "@angular/core";
import { form, FormField, FormRoot, required } from "@angular/forms/signals";
import { Course } from "../model/course";
import {
  CloseIconComponent,
  EditIconComponent,
  SaveIconComponent,
} from "./course-dialog-icons";

type CourseFormData = {
  description: string;
  category: string;
  releasedAt: Date;
  longDescription: string;
};

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  imports: [
    FormField,
    FormRoot,
    EditIconComponent,
    CloseIconComponent,
    SaveIconComponent,
  ],
})
export class CourseDialogComponent {
  course = input.required<Course>();
  saved = output<CourseFormData>();
  closed = output();

  // courseModel = signal<CourseFormData | null>(null);

  courseModel = linkedSignal<CourseFormData>(() => ({
    description: this.course().description,
    category: this.course().category,
    releasedAt: new Date(),
    longDescription: this.course().longDescription,
  }));

  form = form(
    this.courseModel,
    (schemaPath) => {
      required(schemaPath.description, { message: "Description is required." });
      required(schemaPath.category, { message: "Category is required." });
      required(schemaPath.releasedAt, { message: "Release date is required." });
      required(schemaPath.longDescription, {
        message: "Long description is required.",
      });
    },
    {
      submission: {
        action: async () => {
          this.saved.emit(this.courseModel());
        },
      },
    },
  );

  close() {
    this.closed.emit();
  }
}

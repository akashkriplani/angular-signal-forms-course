import { Component, signal } from "@angular/core";
import {
  applyWhen,
  disabled,
  form,
  FormField,
  FormRoot,
  hidden,
  max,
  min,
  required,
} from "@angular/forms/signals";
import { FileUploadComponent } from "../../file-upload/file-upload.component";
import { FieldErrorComponent } from "../../field-error/field-error.component";
import { STEP2_DEFAULT, Step2Data } from "./step2.model";
import { dateRange } from "./date-range.validator";
import { withDraft } from "../with-draft";

@Component({
  selector: "create-course-step-2",
  templateUrl: "create-course-step-2.component.html",
  styleUrls: ["create-course-step-2.component.scss"],
  imports: [FormField, FormRoot, FileUploadComponent, FieldErrorComponent],
})
export class CreateCourseStep2Component {
  step2Model = signal<Step2Data>({ ...STEP2_DEFAULT });

  step2Form = form(this.step2Model, (schema) => {
    required(schema.courseType, { message: "Course type is required." });

    required(schema.price, { message: "Price is required." });
    min(schema.price, 1, { message: "Price must be at least 1." });
    max(schema.price, 9999, { message: "Price must be at most 9999." });

    disabled(schema.price, {
      when: ({ valueOf }) => valueOf(schema.courseType) === "free",
    });

    // We can also hide price when course type is free, just like promo start and end date.
    // For this case, we have just disabled the price field on UI.
    // hidden(schema.price, {
    //   when: ({ valueOf }) => valueOf(schema.courseType) === "free",
    // });

    hidden(schema.promoStartAt, {
      when: ({ valueOf }) => valueOf(schema.courseType) === "free",
    });

    hidden(schema.promoEndAt, {
      when: ({ valueOf }) => valueOf(schema.courseType) === "free",
    });

    // Conditionally apply form level validation
    applyWhen(
      schema,
      ({ value }) => value().courseType === "premium",
      (schema) => {
        dateRange(
          schema,
          schema.promoStartAt,
          schema.promoEndAt,
          "Promo start date must be before the end date.",
        );
      },
    );
  });

  constructor() {
    withDraft(this.step2Form, this.step2Model, "step2");
  }
}

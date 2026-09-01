import { Component, signal } from "@angular/core";
import { CreateCourseStep1Component } from "./create-course-step-1/create-course-step-1.component";
import { CreateCourseStep2Component } from "./create-course-step-2/create-course-step-2.component";
import { CreateCourseStep3Component } from "./create-course-step-3/create-course-step-3.component";
import {
  ArrowLeftIconComponent,
  ArrowRightIconComponent,
  CheckIconComponent,
  CreateCourseHeroIconComponent,
} from "./create-course-icons";

@Component({
  selector: "create-course",
  templateUrl: "./create-course.component.html",
  styleUrls: ["./create-course.component.scss"],
  imports: [
    CreateCourseStep1Component,
    CreateCourseStep2Component,
    CreateCourseStep3Component,
    CreateCourseHeroIconComponent,
    ArrowRightIconComponent,
    ArrowLeftIconComponent,
    CheckIconComponent,
  ],
})
export class CreateCourseComponent {
  currentStep = signal(0);

  readonly steps = [
    { label: "Landing page" },
    { label: "Pricing" },
    { label: "Lessons" },
  ];

  submit(step1: any, step2: any, step3: any) {
    console.log(step1, step2, step3);
  }
}

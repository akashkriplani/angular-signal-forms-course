import { JsonPipe } from "@angular/common";
import { Component, signal, effect } from "@angular/core";
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
  SchemaPathTree,
  validateStandardSchema,
} from "@angular/forms/signals";
import { FieldErrorComponent } from "../field-error/field-error.component";
import { LOGIN_FORM_DEFAULT, LoginData } from "./login.model";
import { LoginLogoComponent } from "./login-logo.component";
import { ResetIconComponent, SignInIconComponent } from "./login-icons";
import { passwordStrength } from "../validators/password-strength.validator";
import { loginZodSchema } from "./login.schema.zod";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [
    FormField,
    FormRoot,
    FieldErrorComponent,
    JsonPipe,
    LoginLogoComponent,
    SignInIconComponent,
    ResetIconComponent,
  ],
})
export class LoginComponent {
  loginModel = signal({ ...LOGIN_FORM_DEFAULT });

  form = form(
    this.loginModel,
    (path: SchemaPathTree<LoginData>) => {
      // Alternate way to create form via Zod (standard library for form validation)
      // which can be shared across different tech stacks
      // Just remove Angular's way of declaring form and uncomment below line
      // validateStandardSchema(path, loginZodSchema);
      required(path.email, { message: "Email is required." });
      email(path.email, { message: "Enter a valid email address." });
      required(path.password, { message: "Password is required." });
      minLength(path.password, 8, {
        message: "Password must be atleast 8 characters.",
      });
      passwordStrength(path.password);
    },
    {
      submission: {
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        },
      },
    },
  );

  constructor() {
    effect(() => {
      console.log(`form`, this.loginModel());
    });
  }

  reset() {
    this.form().reset({ ...LOGIN_FORM_DEFAULT });
  }
}

import {
  apply,
  pattern,
  required,
  schema,
  SchemaPath,
} from "@angular/forms/signals";
import { AddressData } from "./address.model";

export const addressSchema = schema<AddressData>((path) => {
  required(path.addressLine1, { message: "Address Line 1 is required." });
  required(path.addressLine2, { message: "Address Line 2 is required." });
  required(path.zipCode, { message: "Zip code is required." });
  pattern(path.zipCode, /^\d{5}(-\d{4})?$/, {
    message: "Enter a valid US zip code.",
  });
  required(path.city, { message: "City is required." });
});

export function setupAddressField(path: SchemaPath<AddressData>) {
  apply(path, addressSchema);
}

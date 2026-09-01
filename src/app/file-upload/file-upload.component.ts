import {
  Component,
  computed,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  output,
  signal,
  effect,
} from "@angular/core";
import { HttpEventType, httpResource } from "@angular/common/http";
import { FormValueControl } from "@angular/forms/signals";

@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
})
export class FileUploadComponent implements FormValueControl<string> {
  readonly requiredFileType = input<string>("");

  // To convert this component into custom form value control
  // you have to implement FormValueControl interface and include
  // value as the field as done below.
  readonly value = model<string>("");
  readonly disabled = input<boolean>(false);
  readonly touch = output<void>();

  // readonly value = computed(() => this.uploadResource.value()?.url ?? null);
  // readonly disabled = signal(false);

  fileName = signal("");

  private readonly fileData = signal<FormData | null>(null);

  constructor() {
    effect(() => {
      const url = this.uploadResource.value()?.url;

      if (url) {
        this.value.set(url);
      }
    });
  }

  private readonly uploadResource = httpResource<{ url: string }>(() => {
    const body = this.fileData();
    if (!body) return undefined;
    return {
      url: "/api/upload",
      method: "POST",
      body,
      reportProgress: true,
    };
  });

  readonly uploadProgress = computed(() => {
    const progress = this.uploadResource.progress();
    if (!progress || progress.type !== HttpEventType.UploadProgress)
      return null;
    return progress.total
      ? Math.round((100 * progress.loaded) / progress.total)
      : null;
  });

  readonly fileUploadError = computed(() => !!this.uploadResource.error());

  onClick(fileUpload: HTMLInputElement) {
    this.touch.emit();
    fileUpload.click();
  }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    if (!file) return;

    this.fileName.set(file.name);

    const formData = new FormData();
    formData.append("file", file);
    this.fileData.set(formData);
  }
}

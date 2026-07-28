import type { InjectionKey, Ref } from "vue";

export interface FileUploadProvide {
  files: Readonly<Ref<readonly File[]>>;
  multiple: boolean;
  accept: string | undefined;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  openFilePicker: () => void;
  inputRef: Readonly<Ref<HTMLInputElement | undefined>>;
}

export const FILE_UPLOAD_ROOT_KEY = Symbol("FileUploadRoot") as InjectionKey<FileUploadProvide>;

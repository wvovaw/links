import { inject } from "vue";

import { FILE_UPLOAD_ROOT_KEY, type FileUploadProvide } from "./providers";

export function useFileUploadContext(): FileUploadProvide {
  const context = inject(FILE_UPLOAD_ROOT_KEY);
  if (!context) throw new Error("useFileUploadContext must be used within UIFileUpload.Root");
  return context;
}

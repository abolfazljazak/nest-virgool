import { ParseFilePipe, UploadedFiles } from "@nestjs/common";

export function UploadedOptionalFiles() {
    return UploadedFiles(
        new ParseFilePipe({
          fileIsRequired: false,
          validators: [],
        })
      )
}
import { multerStorage } from "@common/utils/multer.util";
import { FileInterceptor } from "@nestjs/platform-express";

export function UploadFile(filedName: string, folderName: string = "images") {
  return class UploadUtility extends FileInterceptor(filedName, {
    storage: multerStorage(folderName),
  }) {};
}

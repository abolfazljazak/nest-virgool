import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";
import { ValidationMessage } from "../enum/message.enum";
import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";

export type CallBackDestination = (error: Error, destination: string) => void;
export type CallBackFilename = (error: Error, filename: string) => void;

export type MulterFile = Express.Multer.File;
export function multerDestination(fieldName: string) {
  return function (
    req: Request,
    file: MulterFile,
    callback: CallBackDestination
  ): void {
    let path = join("public", "uploads", fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function multerFilename(
  req: Request,
  file: MulterFile,
  callback: CallBackDestination
): void {
  const ext = extname(file.originalname).toLowerCase();
  if (!isValidImageFormat(ext)) {
    callback(new BadRequestException(ValidationMessage.IvalidImageFormat), null);
  } else {
    const filename = `${Date.now()}${ext}`;
    callback(null, filename);
  }
}

function isValidImageFormat(ext: string) {
    return [".jpg", ".jpeg", ".png"].includes(ext)
}

export function multerStorage(folderName: string) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: () => {},
  })
}
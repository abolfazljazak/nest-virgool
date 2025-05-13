import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";

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
    const ext = extname(file.originalname)
    const filename = `${Date.now()}.${ext}`
    callback(null, filename)
  };
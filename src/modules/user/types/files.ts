import { MulterFile } from "@common/utils/multer.util";

export type ProfileImages = {
    bg_image: MulterFile[],
    image_profile: MulterFile[],
}
import { MulterFile } from "src/common/utils/multer.util";

export type ProfileImages = {
    bg_image: MulterFile[],
    image_profile: MulterFile[],
}
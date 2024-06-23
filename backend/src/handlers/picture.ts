import prisma from '../db'
import sharp from "sharp";
import fs from 'fs';
import { promisify } from 'util';
import path from "path";

const renameAsync = promisify(fs.rename);

const flipPicture = async (picturePath) => {
    const tempPath = picturePath + '.tmp';

    try {
        await sharp(picturePath)
            .flop()
            .toFile(tempPath);

        await renameAsync(tempPath, picturePath);

    } catch (error) {
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
    }
}

const mergePicture = async (picturePath, stickerPath, posX, posY, zoom) => {
    const tempPath = picturePath + '.tmp';
    const tempStickerPath = stickerPath + '.tmp';


    const stickerRelativePath = stickerPath;
    const stickerAbsolutePath = path.resolve(stickerRelativePath);

    try {
        await sharp(stickerAbsolutePath)
            .resize(200 * zoom, 200 * zoom)
            .toFile(tempStickerPath);

        await sharp(picturePath)
            .composite([{ input: tempStickerPath, top: Math.round(posY), left: Math.round(posX) }])
            .toFile(tempPath);

        await renameAsync(tempPath, picturePath);

        if (fs.existsSync(tempStickerPath)) {
            fs.unlinkSync(tempStickerPath);
        }

    } catch (error) {
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        if (fs.existsSync(tempStickerPath)) {
            fs.unlinkSync(tempStickerPath);
        }
        throw error;
    }
}

export const createPicture = async (req, res) => {
    await flipPicture(req.picturePath);
    await mergePicture(req.picturePath, req.body.stickerPath, req.body.posX, req.body.posY, req.body.zoom);

    const picture = await prisma.picture.create({
        data: {
            path: req.picturePath.replace('/usr/src/app/', ''),
            user: {
                connect: {
                    id: req.user.id
                }
            }
        }
    });
    return res.status(201).json(picture);
};

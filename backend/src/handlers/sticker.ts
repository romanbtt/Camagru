import prisma from '../db'

export const getAllStickers = async (req, res) => {

    const stcikers = await prisma.sticker.findMany();

    res.json(stcikers);
}
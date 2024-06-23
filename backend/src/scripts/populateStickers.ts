import prisma from '../db'

export const populateStickers = async () => {
  const MemesCategory = 'Memes'
  const MemesPath = [
    'stickers/memes/8f7c47ca-70f7-4f09-93bb-94b6cfaf7c71.png',
    'stickers/memes/19c39f2e-3fcd-46b1-946e-6dfa732234de.png',
    'stickers/memes/27e0e355-6529-4d58-8dc5-8b39864e92b9.png',
    'stickers/memes/664c9f5f-fa75-4e8b-b8dd-8876b93264c2.png',
    'stickers/memes/17794331-4867-413d-8f24-52d21042984.png',
    'stickers/memes/65428072-7a40-40d0-a465-8bde04c67fde.png',
    'stickers/memes/cb81d7b0-e8a1-40e7-a39b-2d339e4a41b2.png',
    'stickers/memes/e27d22b8-61b1-4a15-b6cc-a9ff8c00cc6b.png',
    'stickers/memes/e59c717c-5e41-4e58-b649-1537f09951ab.png'
  ]

  await prisma.sticker.upsert({
    where: {
      category: MemesCategory,
    },
    update: {
      paths: MemesPath,
    },
    create: {
      category: MemesCategory,
      paths: MemesPath,
    },
  });

  const GamesCategory = 'Games'
  const GamesPath = [
    'stickers/games/3fbee342-e97f-425e-8773-0b459d6c5b27.png',
    'stickers/games/6df802a4-8cff-40fe-a26b-1cb44dab8326.png',
    'stickers/games/8e089351-0b5d-4fda-96ef-be23af2fa446.png',
    'stickers/games/63ce4c21-4999-4d6a-a63c-8b13e571819d.png',
    'stickers/games/68f86775-1395-4623-a76a-c158d3c50585.png',
    'stickers/games/a5f7cd64-4407-488a-a533-9533c4e916b5.png',
    'stickers/games/c8090d0e-f1a4-4da0-afda-14081cac3bdf.png',
    'stickers/games/cb360c4d-e098-4461-b1fa-2011300ee1cb.png',
    'stickers/games/ec992e76-9a15-479b-9ecb-a3aa28f4f41c.png'
  ]

  await prisma.sticker.upsert({
    where: {
      category: GamesCategory,
    },
    update: {
      paths: GamesPath,
    },
    create: {
      category: GamesCategory,
      paths: GamesPath,
    },
  });
}

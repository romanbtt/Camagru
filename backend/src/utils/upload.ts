import fs from 'fs';
import path from 'path';

const uploadPicture = (req, res, next) => {
  const base64Data = req.body.picture;

  if (!base64Data) {
    return next(new Error('No file uploaded'));
  }

  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return next(new Error('Invalid base64 data'));
  }

  const fileExtension = matches[1].split('/')[1];
  const buffer = Buffer.from(matches[2], 'base64');

  const uploadPath = path.join(__dirname, '../../uploads');
  const fileName = `${req.user.id}-${Date.now()}.${fileExtension}`;
  const picturePath = path.join(uploadPath, fileName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  fs.writeFile(picturePath, buffer, (err) => {
    if (err) {
      return next(err);
    }

    req.picturePath = picturePath;
    next();
  });
};

export default uploadPicture;

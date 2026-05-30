const cloudinary = require("../config/cloudinary");
const AppError = require("./AppError");

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `maallem/${folder}`, resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
    stream.end(buffer);
  });

const uploadFile = async (file, folder) => {
  if (!file?.buffer) return null;
  const result = await uploadBuffer(file.buffer, folder);
  return result.secure_url;
};

const uploadMany = async (files, folder) => {
  if (!files?.length) return [];
  const urls = await Promise.all(files.map((f) => uploadFile(f, folder)));
  return urls.filter(Boolean);
};

const deleteByUrl = async (url) => {
  if (!url?.includes("cloudinary.com")) return;
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return;
  const pathAfterUpload = url
    .slice(uploadIndex + "/upload/".length)
    .replace(/^v\d+\//, "");
  const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // ignore cleanup failures
  }
};

const deleteManyByUrl = async (urls) => {
  if (!urls?.length) return;
  await Promise.all(urls.map((url) => deleteByUrl(url)));
};

const requireCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    require("../config/env");
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new AppError("Cloudinary is not configured", 500);
  }
};

module.exports = {
  uploadFile,
  uploadMany,
  deleteByUrl,
  deleteManyByUrl,
  requireCloudinary,
};

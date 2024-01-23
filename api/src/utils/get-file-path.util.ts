export const getFileName = (file: Express.Multer.File) => {
    return file.filename;
};

export const getFilePath = (filename?: string | null) => {
    return filename ? `${process.env.GET_IMAGE_URL}/files/${filename}` : '';
};

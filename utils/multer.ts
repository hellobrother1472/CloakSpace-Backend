import multer, { FileFilterCallback } from "multer";

type CustomFileFilterCallback = (
	error: Error | null,
	acceptFile: boolean
) => void;

const filter = function (req: Request,file: Express.Multer.File,cb: CustomFileFilterCallback) {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" ||file.mimetype === "image/png" ||file.mimetype === "image/webp"
	) {
		cb(null, true);
	} else {
		cb(new Error('Not an Image! Please upload an image'), false);
	}
};
const upload = multer({
	dest: "uploads/",
	fileFilter: filter as any,
});

export default upload;

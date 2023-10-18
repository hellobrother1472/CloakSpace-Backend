import cloudinary from "cloudinary";
import fs from "fs";
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});



export const uploadToCloudinary = async (filePath: string, originalName:string) => {
    const options = {
        public_id: originalName,
        folder: "cloakSpace/postsPics",
        format: "webp",
        fetch_format: "auto",
        quality: "auto",
        crop: "scale",
    };
	try {
		let result = await cloudinary.v2.uploader.upload(filePath, options);
		if (result) {
			return {
				message: "success",
				url: result?.secure_url,
			};
		}
	} catch (error) {
        console.log(error);
		return { message: "fail" };
	} finally {
		fs.unlinkSync(filePath);
	}
};

export default cloudinary;

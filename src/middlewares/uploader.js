const multer = require('multer');
const uuid = require('uuid').v4;
const fs = require('fs');

const getExtention = (filename = '') => {
	return filename.substr(filename.lastIndexOf('.'));
};

const storage = (path = 'uploads/') => multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true });
		}

		cb(null, path);
	},
	filename: (req, file, cb) => {
		const extension = getExtention(file.originalname);

		file.extension = extension;

		cb(null, `${uuid()}${extension}`);
	}
});

const upload = path => multer({
	storage: storage(path),
	limits: {
		fileSize: 1024 * 1024 * 80
	}
});

module.exports = upload();

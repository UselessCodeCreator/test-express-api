const router = require('express').Router();
const upload = require('../middlewares/uploader');
const { models } = require('../database/models');
const { FileModel } = require('../database/model-names');
const passport = require('passport');
const checkToken = require('../middlewares/black-list');

const authJwt = passport.authenticate('jwt', { session: false });

const fs = require('fs').promises;

router.post('/upload',
	checkToken,
	authJwt,
	upload.single('file'),
	async (req, res, next) => {
		const File = models[FileModel];

		const { file } = req;

		const filename = file.filename;
		const extension = file.extension;
		const mimetype = file.mimetype;
		const file_size = file.size;

		try {
			const newFile = await File.create({
				filename,
				extension,
				mimetype,
				file_size
			});

			res.status(201).json(newFile);
		} catch (error) {
			console.error(error);
			const err = new Error('Can\'t upload file');
			next(err);
		}
	}
);

router.put('/update/:id',
	checkToken,
	authJwt,
	upload.single('file'),
	async (req, res, next) => {
		const File = models[FileModel];

		const id = req.params.id;

		const newFile = req.file;

		if (!id) {
			const error = new Error('Id must be defined');
			return next(error);
		}

		try {
			const file = await File.findOne({ where: { id } });

			if (!file) {
				const error = new Error('File does not exists');
				return next(error);
			}

			await fs.unlink(`uploads/${file.filename}`);

			file.filename = newFile.filename;
			file.extension = newFile.extension;
			file.mimetype = newFile.mimetype;
			file.file_size = newFile.size;
			file.uploaded_at = Date.now();

			await file.save();

			res.send(file);
		} catch (error) {
			console.error(error);
			const err = new Error('Can\'t get file');
			next(err);
		}
	}
);

router.delete('/delete/:id',
	checkToken,
	authJwt,
	async (req, res, next) => {
		const File = models[FileModel];

		const id = req.params.id;

		if (!id) {
			const error = new Error('Id must be defined');
			return next(error);
		}

		try {
			const file = await File.findOne({ where: { id } });

			if (!file) {
				const error = new Error('File does not exists');
				return next(error);
			}

			await fs.unlink(`uploads/${file.filename}`);

			await file.destroy();

			res.send(file);
		} catch (error) {
			console.error(error);
			const err = new Error('Can\'t get file');
			next(err);
		}
	}
);

router.get('/:id',
	checkToken,
	authJwt,
	async (req, res, next) => {
		const File = models[FileModel];

		const id = req.params.id;

		if (!id) {
			const error = new Error('Id must be defined');
			return next(error);
		}

		try {
			const file = await File.findOne({ where: { id } });

			if (!file) {
				const error = new Error('File not exists');
				return next(error);
			}

			res.send(file);
		} catch (error) {
			console.error(error);
			const err = new Error('Can\'t get file');
			next(err);
		}
	}
);

router.get('/list',
	checkToken,
	authJwt,
	async (req, res, next) => {
		const File = models[FileModel];

		const { page, list_size } = req.query;

		let parsedPage = Number.parseInt(page, 10);
		let parsedLimit = Number.parseInt(list_size, 10);

		if (!Number.isSafeInteger(parsedPage) || parsedPage < 1) {
			parsedPage = 1;
		}

		if (!Number.isSafeInteger(parsedLimit) || parsedLimit < 1) {
			parsedLimit = 10;
		}

		try {
			const files = await File.findAll({ limit: parsedLimit, offset: parsedLimit * (parsedPage - 1) });

			res.send(files);
		} catch (error) {
			console.error(error);
			const err = new Error('Can\'t get files');
			next(err);
		}
	}
);

router.get('/download/:id',
	checkToken,
	authJwt,
	async (req, res, next) => {
		const File = models[FileModel];

		const id = req.params.id;

		if (!id) {
			const error = new Error('Id must be defined');
			return next(error);
		}

		try {
			const file = await File.findOne({ where: { id } });

			const filePath = `uploads/${file.filename}`;

			res.download(filePath);
		} catch (error) {
			console.error(error);
			const err = new Error('Can\'t get file');
			next(err);
		}
	}
);

module.exports = router;

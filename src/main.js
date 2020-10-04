const http = require('http');
const app = require('./app');
const db = require('./database/models');

const config = require('./config');

async function initDB () {
	try {
		await db.sequelize.authenticate();
	} catch (error) {
		console.error('Unable connect to database', error);

		throw error;
	}
}

function normalizePort (val) {
	const port = parseInt(val, 10);
	return isNaN(port)
		? val
		: (port >= 0)
			? port
			: false;
}

async function start () {
	try {
		await initDB();

		const port = normalizePort(config.get('port'));

		await new Promise((resolve, reject) => {
			const server = http.createServer(app);
			server.on('error', err => reject(err));
			server.listen(port, () => resolve());
		});

		console.info(`[SERVER] - Server started on port: ${port}`);
	} catch (error) {
		console.error('Can\'t start server', error);
	}
}

start();

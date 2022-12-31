import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import authorRoutes from './routes/Author';

const router = express();

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to Mongodb');
    })
    .catch((error) => {
        Logging.error('Unable to connect');
        Logging.error(error);
    });

// only start server if mongo connects

const StartServer = () => {
    router.use((req, res, next) => {
        //log the request
        Logging.info(`Incomming => Method: [${req.method}] - Url: [${req.url}]- IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            Logging.info(`Incomming => Method: [${req.method}] - Url: [${req.url}]- IP: [${req.socket.remoteAddress}] -Status: [${res.statusCode}]`);
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //Rules of an api

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Conntent-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH,DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    //Routes
    router.use('/authors', authorRoutes);

    //Healtcheck

    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    //Error handling
    router.use((req, res, next) => {
        const error = new Error('not Found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });
    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};

import http from 'http';
import express, { NextFunction } from 'express';
import logging from './config/logging';
import config from './config/config';
import { initDatabaseConnection } from './config/db';
import { authorRouter } from './routes/authorRouter';
import { categoryRouter } from './routes/categoryRouter';
import { customerRouter } from './routes/customerRouter';
import { publisherRouter } from './routes/publisherRouter';
import { bookRouter } from './routes/bookRouter';
import { purchaseRouter } from './routes/purchaseRouter';
import { subOrderRouter } from './routes/subOrderRouter';
import { reviewRouter } from './routes/reviewRouter';
import { usersRouter } from './routes/usersRouter';
import { UserRole } from './enums/UserRole';
import { paymentRouter } from './routes/paymentRouter';


const NAMESPACE: string = 'Server';
const app: express.Application = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const httpServer = http.createServer(app);

app.use(cors());

app.use(cookieParser("secretcode"));

/*Obsługa logów żądań */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METODA - [${req.method}], URL - [${req.url}, IP - [${req.socket.remoteAddress}]]`);

    res.on('finish', () => {
        logging.info(
            NAMESPACE,
            `METODA - [${req.method}], URL - [${req.url}, IP - [${req.socket.remoteAddress}]], 
        STATUS - [${res.statusCode}]`
        );
    });

    next();
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

/* Trasy (Routes) */
app.use("/api", authorRouter);
app.use("/api", categoryRouter);
app.use("/api", customerRouter);
app.use("/api", publisherRouter);
app.use("/api", bookRouter);
app.use("/api", purchaseRouter);
app.use("/api", subOrderRouter);
app.use("/api", reviewRouter);
app.use("/api", usersRouter);
app.use("/api", paymentRouter);

/* Obsługa błędów */
app.use((req, res, next) => {
    const error = new Error('Nie znaleziono');

    return res.status(404).json({
        message: error.message
    });
});

/* Uruchomienie bazy danych i serwera */
initDatabaseConnection().then(() =>
    httpServer.listen(config.server.port, () =>
        logging.info(NAMESPACE, `Serwer uruchomiono na: ${config.server.hostname}:${config.server.port}`)
    )
);

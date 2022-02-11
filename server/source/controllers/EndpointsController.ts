import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'Endpoint Controller';

const endpointHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Sprawdzam działanie kontrolera.');

    return res.status(200).json({
        message: 'Dziala'
    });
};

export default { endpointHealthCheck };

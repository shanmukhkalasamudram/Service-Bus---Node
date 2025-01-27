/* eslint-disable no-unused-vars */
const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const httpStatusCodes = require('http-status-codes');
const contextService = require('request-context');

const app = express();
const logger = require('./util/logger/logger.util');
const { connectBus } = require('./util/event-bus');
const setupRoutes = require('./modules');

// connectBus();

app.use(contextService.middleware('request'));

app.use(logger.successHandler);
app.use(logger.errorHandler);

app.use(helmet());

// CORS middleware 
app.use(cors());

// sanitize request data
app.use(xss());

// body-parser
app.use(bp.json({ limit: '5mb' }));
app.use(
    bp.urlencoded({
        extended: false,
    })
);

app.use('/api', setupRoutes());
app.use((data, req, res, _next) => res.json({ data, is_success: true }));

app.use('*', (req, res) =>
    res.status(httpStatusCodes.NOT_FOUND).json({
        error: {
            message: 'not found',
        },
        is_success: false,
    })
);

module.exports = app;


const admin = require('firebase-admin');
const firebase = require('firebase');

const express = require('express');
const Router = express.Router();

const {check, validationResult, header} = require('express-validator');

const middlewares = require('./middlewares');
const {authMiddleware} = require('../middlewares');

const {errorMessages} = require('../../config');

const BusBoy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

const {getImageURLConstructor} = require('../../config');

Router.route('/update/image')
    .post([
        header('authorization')
            .custom(
                authMiddleware(
                    admin
                )
            ).withMessage('user/update/image/' + errorMessages.TOKEN_ERROR),
        middlewares.uploadImage({
            admin,
            BusBoy,
            path,
            os,
            fs,
            getImageURLConstructor,
            imageError: 'user/update/image/' + errorMessages.IMAGE_ERROR
        }),
        middlewares.updateUpdatedCollection(
            admin
                .firestore()
                .collection('users')
        ),
        middlewares.displayValidationErrors(validationResult),
        (req, res, next) => {
            res.json(req.appData);
        }
    ]);

Router.route('/update')
    .post([
        header('authorization')
            .custom(
                authMiddleware(
                    admin
                )
            ).withMessage('user/update/' + errorMessages.TOKEN_ERROR),
        check('keys')
            .isJSON().withMessage('user/update/' + errorMessages.NOT_JSON)
            ,
        middlewares.displayValidationErrors(validationResult),
        (req, res, next) => {
            res.json(req.appData);
        }
    ]);

module.exports = Router;

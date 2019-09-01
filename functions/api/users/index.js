
const admin = require('firebase-admin');
const firebase = require('firebase');

const express = require('express');
const Router = express.Router();

const {check, validationResult, header} = require('express-validator');

const middlewares = require('./middlewares');
const {authMiddleware} = require('../middlewares');

const {errorMessages} = require('../../config');

Router.route('/info')
    .get([
        middlewares.realizeGetQuery(
            admin
                .firestore()
                .collection('users')
        ),
        (req, res, next) => {
            res.json(req.appData);
        }
    ]);

Router.route('/sign_up')
    .put([
        header('authorization')
            .not()
            .custom(
                authMiddleware(
                    admin
                )
            ).withMessage('user/sign_up/' + errorMessages.TOKEN_ERROR),
        check('email')
            .isEmail().withMessage('user/sign_up/email/' + errorMessages.INVALID)
            .trim()
            .normalizeEmail()
            .not()
            .custom(
                middlewares.emailIsInUse(
                    admin
                        .firestore()
                        .collection('users')
                )
            ).withMessage('user/sign_up/email/' + errorMessages.TAKEN),
        check('password')
            .not()
            .isEmpty().withMessage('user/sign_up/password/' + errorMessages.EMPTY)
            .isLength({
                min: 6,
                max: 18
            }).withMessage('user/sign_up/password/' + errorMessages.LENGTH)
            .trim()
            .escape(),
        check('confirmation_password')
            .not()
            .isEmpty().withMessage('user/sign_up/confirmation_password/' + errorMessages.EMPTY)
            .isLength({
                min: 6,
                max: 18
            }).withMessage('user/sign_up/confirmation_password/' + errorMessages.LENGTH)
            .trim()
            .escape(),
        check('confirmation_password').custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if (value !== req.body.password) {
                    reject();
                } else {
                    resolve();
                }
            })
        }).withMessage('user/sign_up/confirmation_password/' + errorMessages.MATCH),
        middlewares.displayValidationErrors(validationResult),
        middlewares.signUp(firebase),
        middlewares.createUserInCollection(
            admin
                .firestore()
                .collection('users')
        ),
        (req, res, next) => {
            res.json(req.appData);
        }
    ]);

Router.route('/sign_in')
    .post([
        header('authorization')
            .not()
            .custom(
                authMiddleware(
                    admin
                )
            ).withMessage('user/sign_in/' + errorMessages.TOKEN_ERROR),
        check('email')
           .isEmail().withMessage('user/sign_in/email/' + errorMessages.INVALID)
           .trim()
           .normalizeEmail()
            .custom(
                middlewares.emailIsInUse(
                    admin
                        .firestore()
                        .collection('users')
                )
            ).withMessage('user/sign_in/email/' + errorMessages.NOT_EXISTS),
        check('password')
            .not()
            .isEmpty().withMessage('user/sign_in/password/' + errorMessages.EMPTY)
            .isLength({
                min: 6,
                max: 18
            }).withMessage('user/sign_in/password/' + errorMessages.LENGTH)
            .trim()
            .escape(),
        middlewares.displayValidationErrors(validationResult),
        middlewares.signIn(
            firebase
        ),
        middlewares.updateSignInTime(
            admin
                .firestore()
                .collection('users')
        ),
        (req, res, next) => {
            res.json(req.appData);
        }
    ]);

module.exports = Router;

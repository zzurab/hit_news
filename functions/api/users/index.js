
const admin = require('firebase-admin');
const firebase = require('firebase');

const express = require('express');
const Router = express.Router();

const middlewares = require('./middlewares');

const {check, validationResult} = require('express-validator');

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
    .put(
        check('email')
            .isEmail().withMessage('user/sign_up/email/not_valid')
            .trim()
            .normalizeEmail()
            .not()
            .custom(
                middlewares.emailIsInUse(
                    admin
                        .firestore()
                        .collection('users')
                )
            ).withMessage('user/sign_up/email/already_in_use'),
        check('password')
            .not()
            .isEmpty().withMessage('user/sign_up/password/empty')
            .isLength({
                min: 6,
                max: 18
            }).withMessage('user/sign_up/password/length')
            .trim()
            .escape(),
        check('confirmation_password')
            .not()
            .isEmpty().withMessage('user/sign_up/confirmation_password/empty')
            .isLength({
                min: 6,
                max: 18
            }).withMessage('user/sign_up/confirmation_password/length')
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
        }).withMessage('user/sign_up/confirmation_password/does_not_match'),
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
    );

Router.route('/sign_in')
    .post([
        check('email')
           .isEmail().withMessage('user/sign_in/email/not_valid')
           .trim()
           .normalizeEmail()
            .custom(
                middlewares.emailIsInUse(
                    admin
                        .firestore()
                        .collection('users')
                )
            ).withMessage('user/sign_in/email/not_exists'),
        check('password')
            .not()
            .isEmpty().withMessage('user/sign_in/password/empty')
            .isLength({
                min: 6,
                max: 18
            }).withMessage('user/sign_in/password/length')
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

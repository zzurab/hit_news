
const admin = require('firebase-admin');
const firebase = require('firebase');

const express = require('express');
const Router = express.Router();

const {check, validationResult, header} = require('express-validator');

const middlewares = require('./middlewares');
const {postExistsById} = require('../posts/middlewares');
const {authMiddleware} = require('../middlewares');

const {errorMessages} = require('../../config');

Router.route('/add')
    .put([
        header('authorization')
            .custom(
                authMiddleware(
                    admin
                )
            ).withMessage('comments/add/message/' + errorMessages.UNAUTHORIZED),
        check('message')
            .not()
            .isEmpty().withMessage('comments/add/message/' + errorMessages.EMPTY)
            .trim()
            .escape(),
        check('postId')
            .not()
            .isEmpty().withMessage('comments/add/postId/' + errorMessages.EMPTY)
            .trim()
            .escape()
            .custom(
                postExistsById(
                    admin
                        .firestore()
                        .collection('posts')
                )
            ).withMessage('comments/add/postId/' + errorMessages.INVALID),
        middlewares.displayValidationErrors(validationResult),
        middlewares.publishComment(
            admin
                .firestore()
                .collection('comments')
        ),
        (req, res, next) => {
            res.json(req.appData)
        }
    ]);

module.exports = Router;

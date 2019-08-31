
const admin = require('firebase-admin');
const firebase = require('firebase');

const express = require('express');
const Router = express.Router();

const middlewares = require('./middlewares');
const {postExistsById} = require('../posts/middlewares');
const {authMiddleware} = require('../middlewares');

const {check, validationResult, header} = require('express-validator');


Router.route('/add')
    .put([
        header('authorization')
            .custom(
                authMiddleware(
                    admin
                )
            ).withMessage('comments/add/message/unauthorized'),
        check('message')
            .not()
            .isEmpty().withMessage('comments/add/message/empty')
            .trim()
            .escape(),
        check('postId')
            .not()
            .isEmpty().withMessage('comments/add/postId/empty')
            .trim()
            .escape()
            .custom(
                postExistsById(
                    admin
                        .firestore()
                        .collection('posts')
                )
            ).withMessage('comments/add/postId/invalid'),
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

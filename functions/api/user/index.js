
const admin = require('firebase-admin');
const firebase = require('firebase');

const express = require('express');
const Router = express.Router();

const middlewares = require('./middlewares');

const {check, validationResult, header} = require('express-validator');

Router.route('/update')
    .get([
        (req, res, next) => {
            res.json('test');
        }
    ]);

module.exports = Router;

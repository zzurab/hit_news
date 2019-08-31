
const express = require('express');

const Users = require('./users');
const User = require('./user');
const Comments = require('./comments');

const Router = express.Router();
Router.use('/users', Users);
Router.use('/user', User);
Router.use('/comments', Comments);

Router.use((err, req, res, next) => {
    res.json({
        from: 'server',
        error: err,
        message: err.message
    })
});

module.exports = Router;

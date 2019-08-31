
module.exports = {

    displayValidationErrors: validationResult => (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            next();
        }else{
            next(errors);
        }
    },

    publishComment: collection => (req, res, next) => {
        let comment = {
            message: req.body.message,
            postId: req.body.postId,
            userId: req.AuthorizedUserId,
            createdAt: (new Date()).toISOString()
        };

        collection
            .add(comment)
            .then(data => {
                req.appData = data.id;
                next();
            })
            .catch(error => {
                next(error);
            });
    }
};

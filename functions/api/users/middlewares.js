
module.exports = {
    userExistsById: collection => userId => new Promise((resolve, reject) => {
        collection
            .doc(userId)
            .get()
            .then(user => {
                return user.exists ? resolve() : reject();
            });
    }),

    // dependent

    realizeGetQuery: collection => (req, res, next) => {
        let query = req.query;
        switch(query.key){
            case 'id': {
                collection
                    .doc(query[query.key])
                    .get()
                    .then(data => {
                        req.appData = data.data();
                        next();
                    })
                    .catch(error => {
                        next(error);
                    });
                break;
            }
            default: {
                collection
                    .get()
                    .then(data => {
                        let result = [];
                        data.forEach(item => {
                            result.push(item.data());
                        });
                        req.appData = result;
                        next();
                    });
                break;
            }
        }
    },

    displayValidationErrors: validationResult => (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            next();
        }else{
            next(errors);
        }
    },
    emailIsInUse: collection => email => new Promise((resolve, reject) => {
        collection
            .where('email', '==', email)
            .limit(1)
            .get()
            .then(data => {
                return data.size ? resolve() : reject();
            })
            .catch(error => {
                reject(error);
            });
    }),
    signUp: firebase => (req, res, next) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(
                req.body.email,
                req.body.password
            )
            .then(data => {
                data.user.getIdToken()
                    .then(token => {
                        req.appData = {
                            user: data.user,
                            idToken: token
                        };
                        next();
                    })
                    .catch(error => {
                        next(error);
                    })
            })
            .catch(error => {
                next(error);
            })
    },
    createUserInCollection: collection => (req, res, next) => {
        let newUser = {
            email: req.body.email,
            createdAt: (new Date()).toISOString(),
            userId: req.appData.user.uid
        };
        collection
            .add(newUser)
            .then(user => {
                req.appData = req.appData.idToken;
                next();
            })
            .catch(error => {
                next(error);
            });
    },

    signIn: firebase => (req, res, next) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(
                req.body.email,
                req.body.password
            )
            .then(data => {
                return data.user.getIdToken();
            })
            .then(token => {
                req.appData = token;
                next()
            })
            .catch(error => {
                next(error);
            })
    },
    updateSignInTime: collection => (req, res, next) => {
        collection
            .where('email', '==', req.body.email)
            .get()
            .then(data => {
                return data.docs[0].id;
            })
            .then(id => {
                collection
                    .doc(id)
                    .update({
                        'sign_in_time': (new Date()).toISOString()
                    })
                    .then(data => {
                        next();
                    })
                    .catch(error => {
                        next(error);
                    })
            })
            .catch(error => {
                next(error);
            });
    }
};

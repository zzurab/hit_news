
module.exports = {
    authMiddleware: admin => (value, {req}) => new Promise((resolve, reject) => {
        let idToken;
        if (value && value.startsWith('__MOTHERFUCKER__-')) {
            idToken = value.split('__MOTHERFUCKER__-')[1];
        }else {
            reject();
        }

        admin
            .auth()
            .verifyIdToken(idToken)
            .then(decodedToken => {
                req.authorizationUserToken = decodedToken;

                return admin
                    .firestore()
                    .collection('users')
                    .where('userId', '==', decodedToken.user_id)
                    .limit(1)
                    .get();
            })
            .then(data => {
                req.authorizedUserId = data.docs[0].data().userId;
                req.authorizedUserCollectionId = data.docs[0].id;

                resolve();
            })
            .catch(error => {
                reject(error);
            });
    })
};

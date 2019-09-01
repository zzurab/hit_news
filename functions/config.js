
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

const storageBucket = "news-fc789.appspot.com";

module.exports = {
    adminConfig: {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://news-fc789.firebaseio.com",
        storageBucket
    },
    firebaseConfig: {
        apiKey: "AIzaSyBSTlSl8ouB6BL9i4Eg4_oEZ3DwdbKAEs4",
        authDomain: "news-fc789.firebaseapp.com",
        databaseURL: "https://news-fc789.firebaseio.com",
        projectId: "news-fc789",
        storageBucket,
        messagingSenderId: "652942736558",
        appId: "1:652942736558:web:dd864c39f929f1d5"
    },

    errorMessages: {
        TOKEN_ERROR: 'token_error',
        INVALID: 'invalid',
        TAKEN: 'taken',
        EMPTY: 'empty',
        LENGTH: 'length',
        MATCH: 'match',
        NOT_EXISTS: 'NOT_EXISTS',
        UNAUTHORIZED: 'unauthorized',
        IMAGE_ERROR: 'image_error'
    },

    getImageURLConstructor: function(imageFileName){
        return 'https://firebasestorage.googleapis.com/v0/b/' + storageBucket + '/o/' + imageFileName + '?alt=media'
    }
};

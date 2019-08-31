
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

module.exports = {
    adminConfig: {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://news-fc789.firebaseio.com"
    },
    firebaseConfig: {
        apiKey: "AIzaSyBSTlSl8ouB6BL9i4Eg4_oEZ3DwdbKAEs4",
        authDomain: "news-fc789.firebaseapp.com",
        databaseURL: "https://news-fc789.firebaseio.com",
        projectId: "news-fc789",
        storageBucket: "news-fc789.appspot.com",
        messagingSenderId: "652942736558",
        appId: "1:652942736558:web:dd864c39f929f1d5"
    }
};

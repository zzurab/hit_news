
module.exports = {
    displayValidationErrors: validationResult => (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            next();
        }else{
            next(errors);
        }
    },


    uploadImage: ({admin, BusBoy, path, os, fs, getImageURLConstructor, imageError}) => (req, res, next) => {
        const busBoy = new BusBoy({
            headers: req.headers,
            limits: {
                files: 1
            }
        });

        let imageFileName;
        let imageToBeUploaded = {};

        busBoy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const imageExtension = path.extname(filename).slice(1);
            imageFileName = req.authorizedUserId + '.' + imageExtension;

            const filePath = path.join(os.tmpdir(), imageFileName);

            imageToBeUploaded = {
                filePath,
                mimetype
            };
            if (!Object.keys(imageToBeUploaded).length) {
                return next(new Error(imageError));
            }
            file.pipe(fs.createWriteStream(filePath));
        });

        busBoy.on('finish', () => {
            if (!Object.keys(imageToBeUploaded).length) {
                return next(new Error(imageError));
            }
            admin
                .storage()
                .bucket()
                .upload(imageToBeUploaded.filePath, {
                    resumable: false,
                    metadata: {
                        metadata: {
                            contentType: imageToBeUploaded.mimetype
                        }
                    }
                })
                .then(() => {
                    req.appData = getImageURLConstructor(imageFileName);
                    next();
                })
                .catch(error => {
                    next(error);
                })
        });

        busBoy.end(req.rawBody);
    },

    updateUpdatedCollection: collection => (req, res, next) => {
        collection
            .doc(req.authorizedUserCollectionId)
            .update({
                'avatar': req.appData,
                'updatedAt': (new Date()).toISOString()
            })
            .then(data => {
                req.appData = data;
                next();
            })
            .catch(error => {
                next(error);
            })
    }
};

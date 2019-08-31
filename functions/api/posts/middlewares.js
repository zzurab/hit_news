
module.exports = {
    postExistsById: collection => postId => new Promise((resolve, reject) => {
        collection
            .doc(postId)
            .get()
            .then(post => {
                return post.exists ? resolve() : reject();
            })
            .catch(error => {
                reject(error);
            })
    })

    // dependent
};

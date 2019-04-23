const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({message: 'Feched posts.', posts: posts});
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        creator: {name: 'Emanuel'},
    });
    post.save()
    .then(() => {
        res.status(201).json({
            message: 'Post created successfully!',
            post: { id: new Date().toISOString(), title: title, content: content }
        });
    })
    .catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(err);
    });
};


exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then( post => {
            if (!post) {
                const error = new Error('Cold not find post!');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Post feched.', post: post});
        }).catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(err);
        });
};

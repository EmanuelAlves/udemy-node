const fs = require('fs');
const path = require('path');

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

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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

exports.updatePost = (req, res, next) => {
    if (!error.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        throw error;
    }

    if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
    }
    
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No image');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Cold not find post!');
                error.statusCode = 404;
                throw error;
            }

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;

            return post.save();
        })
        .then( result => {
            res.status(200).json({message: 'Post updated', post: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(err);
        });
        
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}
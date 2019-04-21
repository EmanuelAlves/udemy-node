const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/duck.jpg'
            }
        ]
    });
};

exports.createPost = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json(
            {
                message: 'Validation failed!',
                errors: error.array()
            });
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
        console.log(error)
    });
};

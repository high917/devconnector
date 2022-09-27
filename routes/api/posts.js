const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  POST api/posts
// @desc   Create a post
// @access Private

router.post(
    '/',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();

            await res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).json('Server Error');
        }
    },
);

// @route  GET api/posts
// @desc   Get all posts
// @access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return status(404).json({ msg: 'No post found' });
        }

        await res.json(post);
    } catch (err) {
        console.error(err.message);
        // Check if id is not valid
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No post found' });
        }
        res.status(500).json('Server Error');
    }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'No post found' });
        }
        // Check user isn't the owner of post
        if (post.user.toString() !== req.user.id) {
            // 401 = Non Autorized
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({ msg: 'Post Successfully Removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No post found' });
        }
        res.status(500).json('Server Error');
    }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
            post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post
// @access Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
            post.likes.filter(like => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "Post hasn't yet been liked" });
        }

        // Remove Index
        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

        await post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private

router.post(
    '/comment/:id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const post = await Post.findById(req.params.id);
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);
            await post.save();

            await res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).json('Server Error');
        }
    },
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete comment on a post
// @access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id,
        );

        // Making sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exists' });
        }

        // Check user is the owner of comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not Authorized' });
        }

        // Remove Index
        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        await post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc  Get current user's Profile
// @access Private

router.get('/me', auth, async (req, res) => {
    try {
        // Take profile model and findOne and find it by
        // UserId and here the user is pertain to
        // user in the ProfileSchema
        //
        // We will use populate method to add these to this query
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route POST api/profile
// @desc  Create or Update User Profile
// @access Private

router.post(
    '/',
    [
        auth,
        [
            check('status', 'status is required')
                .not()
                .isEmpty(),
            check('skills', 'skills are required')
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;

        // Build Profile Object
        // creating a profileFields and if there is a req.body.company
        // then assing the req.body.company to ProfileFields.company
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build Social Object
        // If we didnt initialized social to be a object,
        // It would come as undefined
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                // Update
                // If there is a profile then we are using this to find and update
                // it and set profile fields
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true },
                ).populate('user', ['name', 'avatar']);

                return res.json(profile);
            }
            // Create
            profile = new Profile(profileFields);
            // await profile.populate('user', ['name', 'avatar']);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
);

// @route GET api/profile
// @desc  Get all profiles
// @access Public

router.get('/', async (req, res) => {
    try {
        // Add the name and avatar from the user model by populate method

        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'Profile Not Found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile Not Found' });
        }
        res.status(500).json('Server Error');
    }
});

// @route DELETE api/profile
// @desc  Delete profile, user and posts
// @access Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove User Posts
        await Post.deleteMany({ user: req.user.id });

        // Remove Profile
        // FindByIdAndRemove can also be used
        const profile = await Profile.findOneAndRemove({ user: req.user.id });
        // Remove User
        const user = await User.findOneAndRemove({ _id: req.user.id });
        await res.status(200).json({ msg: 'User And Profile Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error');
    }
});

// @route  PUT api/profile/experience
// @desc   Add experience{} object to expirence[] array
// @access Private

router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required')
                .not()
                .isEmpty(),
            check('company', 'Company is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience object from expirence array in profile
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        await profile.experience.splice(removeIndex, 1);
        res.json(profile);
        await profile.save();
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route  PUT api/profile/education
// @desc   Add education{} object to education[] array
// @access Private

router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required')
                .not()
                .isEmpty(),
            check('degree', 'Degree is required')
                .not()
                .isEmpty(),
            check('fieldofstudy', 'Field of Study is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            description,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },
);

// @route  DELETE api/profile/education/edu_id
// @desc   Delete education object from expirence array in profile
// @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        await profile.education.splice(removeIndex, 1);
        res.json(profile);
        await profile.save();
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// @route GET api/profile/github/:username
// @desc  Get user repos from github
// @access Public because viewing profile is public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId',
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;

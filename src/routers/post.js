const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Post = require('../models/post')
const multer = require('multer')

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})



router.post('/posts', auth, upload.single('image'), async (req, res) => {

    const post = new Post({
        ...req.body,
        "image": req.file.buffer,
        owner: req.user._id
    })
    try {
        await post.save()
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/posts', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.compleated) {
        match.compleated = req.query.compleated === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'posts',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const post = await Post.findOne({ _id, owner: req.user._id })

        if (!post) {
            return res.status(404).send()
        }

        res.send(post)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/posts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'image']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const _id = req.params.id
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const post = await Post.findOne({ _id, owner: req.user._id })

        if (!post) {
            return res.status(404).send()
        }
        updates.forEach((update) => post[update] = req.body[update])

        await post.save()

        res.send(post)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const post = await Post.findOneAndDelete({ _id, owner: req.user._id })
        if (!post) {
            return res.status(404).send()
        }

        res.send(post)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router
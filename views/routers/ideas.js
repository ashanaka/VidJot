const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});


//Add Ideas Forum
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

//Edit Ideas
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});

//Process Form
router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please Add The Title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please Add Some Details'
        })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea was added successfully!');
                
                res.redirect('/ideas');
            });
    }
});

//Edit form process
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new Values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Video idea edited');
                // console.log(req.flash('success_msg'));
                res.redirect('/ideas');
            })
    });
});


//Delete form
router.delete('/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Video idea deleted');
        res.redirect('/ideas');
    });
});

app.listen(port, () => {
    console.log(`Server started port ${port}`);
});
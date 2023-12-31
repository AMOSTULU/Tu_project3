const express = require('express');
const app = express();
const port = 5002;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
require('dotenv').config();

const User = require('./models/User');
const Tweet = require('./models/Tweet');

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://amostulu:lvtu0329@tuluwebdev.igvzjpe.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'Twitter' })
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error('Error connecting to MongoDB', e));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ message: 'Login Successful', user: username });
        } else {
            res.status(401).json({ message: 'Login Failed' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email, registerDate: new Date() });
        await newUser.save();
        res.status(201).json({ message: 'User registered', userId: newUser._id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error registering user', error: e.message });
    }
});

app.get('/api/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find({}).sort({ createdTime: -1 }).exec();
        res.status(200).json(tweets);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching tweets', error: e.message });
    }
});

app.post('/api/tweets', upload.single('image'), async (req, res) => {
    try {
        const { username, content } = req.body;
        let tweetData = { username, content, createdTime: new Date() };
        if (req.file) {
            const imageBase64 = req.file.buffer.toString('base64');
            tweetData.image = `data:${req.file.mimetype};base64,${imageBase64}`;
        }
        const tweet = new Tweet(tweetData);
        await tweet.save();
        res.status(201).json({ message: 'Tweet created', tweetId: tweet._id });
    } catch (e) {
        res.status(500).json({ message: 'Error creating tweet', error: e.message });
    }
});

app.delete('/api/tweets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Tweet.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Tweet deleted' });
        } else {
            res.status(404).json({ message: 'Tweet not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error deleting tweet', error: e.message });
    }
});

app.patch('/api/tweets/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    let updateFields = { content, updatedTime: new Date() };
    if (req.file) {
        const imageBase64 = req.file.buffer.toString('base64');
        updateFields.image = `data:${req.file.mimetype};base64,${imageBase64}`;
    }
    try {
        const result = await Tweet.findByIdAndUpdate(id, updateFields, { new: true });
        if (result) {
            res.status(200).json({ message: 'Tweet updated', tweet: result });
        } else {
            res.status(404).json({ message: 'Tweet not found' });
        }
    } catch (e) {
        console.error('Error occurred:', e);
        res.status(500).json({ message: 'Error updating tweet', error: e.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (e) => {
    console.error('Error starting server: ', e);
});

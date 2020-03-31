const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);

const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const app = express();

const MongoDB_URI = 'mongodb+srv://jagmeet:jagmeet0151@cluster0-nptqk.mongodb.net/devconnector';

const store = new MongoDBStore({
    uri: MongoDB_URI,
    collection: 'sessions'
});

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'images');
    },
    filename: (req,file,cb) => {
        cb(null,new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'static')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(multer({ storage: storage }).single('image'));

app.use(flash());

app.get('/', (req,res,next) => {
    res.render('index', {
        isLoggedIn: req.session.isLoggedIn
    });
});

app.use(authRoutes);
app.use(profileRoutes);
app.use(postRoutes);

mongoose
    .connect(MongoDB_URI)
    .then(result => {
        console.log('connected to the database');
        app.listen(3000);
    })
    .catch(err => console.log(err));


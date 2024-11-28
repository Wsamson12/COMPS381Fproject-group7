const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/book'); // Ensure this is your Book model
const User = require('./models/user'); // Ensure this is your User model
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/graphics');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
dotenv.config();
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Samson:plks09113@cluster0.qnynx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Redirect root URL to login page
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to the login page
});

app.get('/logout',(req,res) => {
    req.session.destroy(err => {
        if(err){
            console.error(err);
        }
        res.redirect('/login');
    });
});
            
// Login route
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Initial no error
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        // Login successful, set session
        req.session.userId = user._id;
        req.session.username = user.username; // Store username in session
        res.redirect('/home'); // Redirect to home
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Home route
app.get('/home', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    res.render('home', { username: req.session.username }); // Pass username to the home page
});

// Register route
app.get('/register', (req, res) => {
    res.render('register', { message: null, messageType: '' });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('register', { 
                message: 'Username already exists', 
                messageType: 'error' 
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.render('register', { 
            message: 'User registered successfully!', 
            messageType: 'success' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

//search for recent registered user
app.get('/user/latestuser', async (req, res) => {
    try {
        const user = await User.findOne().sort({ _id: -1 });

        if(!user){
            return res.status(404).send('No user found');
        }
        //get all data from latest user created
        res.json(user);
    }catch (error){
        console.error(error); 
        res.status(500).send('Server error');
    }
});

// Book List route
app.get('/BookList', async (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    try {
        const books = await Book.find({});
        res.render('BookList', { books ,username: req.session.username}); // Pass books to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



// Create Book route
app.get('/create', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    res.render('create');
});

app.post('/create', upload.single('image'), async (req, res) => {
    const { bookName, bookType, bookDescription } = req.body;
    const image = `/graphics/${req.file.filename}`; // Path to the image

    try {
        const newBook = new Book({ name: bookName, type: bookType, image, description: bookDescription });
        await newBook.save();
        res.redirect('/BookList'); // Redirect to book list after creation
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update Book Route
app.put('/update/:id', upload.single('image'), async (req, res) => {
    const { bookName, bookType, bookDescription } = req.body;
    const updatedData = {
        name: bookName,
        type: bookType,
        description: bookDescription
    };

    if (req.file) {
        updatedData.image = `/graphics/${req.file.filename}`;
    }

    try {
        await Book.findByIdAndUpdate(req.params.id, updatedData);
        res.status(200).send('Book updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Delete Book Route
app.delete('/delete/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).send('Book deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Search Route
app.get('/search', async (req, res) => {
    const { bookName } = req.query;
    let query = {};

    if (bookName) {
        query.name = { $regex: bookName, $options: 'i' }; // Case-insensitive search
    }

    try {
        const books = await Book.find(query);
        res.json(books); // Return books as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect('/home');
        }
        res.redirect('/login'); // Redirect to login after logout
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

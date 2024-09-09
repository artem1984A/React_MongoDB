const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const Usersubmit = require('./models/usersubmit.model');
const User = require('./models/reactmodels/user.model');
const Event = require('./models/reactmodels/event.model');
const Category = require('./models/reactmodels/category.model');


const PORT = process.env.PORT || 3000;
const app = express();





app.use('/home', express.static(path.resolve(__dirname, 'build')));
// Serve specific index.html from the 'static' directory
app.get('/home/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});






app.get('/linkedin', (req, res) => {
  const linkedinURL = 'https://www.linkedin.com/in/artem-ryzhov-90560a2a0/';
  res.redirect(linkedinURL);
});


// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://***")
    .then(() => {
        console.log("Connected to MongoDB");
        // Start the server once connected to the database
        app.listen(PORT, '127.1.1.223', () => console.log("Server running on port " + PORT));
    })
    .catch((err) => {
        console.error("Connection to MongoDB failed:", err);
    });
    
    
    
// Routes for Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send('Error fetching events');
  }
});

// Routes for Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send('Error fetching categories');
  }
});

// Routes for Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send('Error fetching users');
  }
});



// Route to create a new user with avatar image link (optional)
app.post('/api/users', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    // Validate input
    if (!name || !file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get the next user ID (incremental)
    const lastUser = await User.findOne().sort({ id: -1 });
    const newUserId = lastUser ? lastUser.id + 1 : 1;

    // Construct image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    const newUser = new User({
      id: newUserId,
      name,
      image: imageUrl,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error saving user to database:", error);
    res.status(500).json({ message: 'Error saving user to the database', error: error.message });
  }
});

// Route to create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !startTime || !endTime || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newEvent = new Event({
      title,
      description,
      image,
      startTime,
      endTime,
      location,
      categoryIds,
      createdBy, // No need to convert to ObjectId manually
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error saving event to database:", error);
    res.status(500).json({ message: 'Error saving event to the database', error: error.message });
  }
});


// Route to update an existing event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;

    // Find the event by ID and update it with the new data
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        startTime,
        endTime,
        location,
        categoryIds,
        createdBy,
      },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});








    
    
    



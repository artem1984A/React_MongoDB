
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const Usersubmit = require('./models/usersubmit.model');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const multer = require('multer'); // Import multer for file uploads
const cors = require('cors');
const Message = require('./message');


const redis = require('redis');
const IpTracker = require('./IpTracker');

const ipTracker = new IpTracker(); // Initialize the class

const { MailtrapClient } = require("mailtrap");


const pdfToTextAddon = require('./addons/build/Release/pdf_to_text'); // Adjust the path as needed


const User = require('./models/reactmodels/user.model');
const Event = require('./models/reactmodels/event.model');
const Category = require('./models/reactmodels/category.model');
const { request } = require('http');

const PORT =  3000;
const app = express();
app.use(cookieParser());
app.use(cors());


// Initialize Redis client
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

redisClient.connect().catch(console.error);




// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage: storage });





// Serve static files from the 'static' directory
app.use(express.static(path.resolve(__dirname, 'static')));
// Serve specific index.html from the 'static' directory
app.get('/index.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
});


app.use('/home', express.static(path.resolve(__dirname, 'build')));
// Serve specific index.html from the 'static' directory
/*
app.get('/home/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});
*/
app.get('/home/*', 
  (req, res, next) => {
    ipTracker.handleRequest(req, res, next); // Track the IP using the class method
  },
  (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build/index.html')); // Serve React App
  }
);





app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
// Serve specific index.html from the 'static' directory
app.get('/uploads', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'uploads'));
});


/*
app.use('/txt_folder', express.static(path.join(__dirname, 'txt_folder')));


// Route to handle PDF to text conversion
app.post('/convert-to-text', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const pdfFilePath = path.join(__dirname, 'uploads', req.file.filename);
  const txtFilePath = path.join(__dirname, 'txt_folder', `${req.file.filename}.txt`);

  try {
    // Convert the PDF to text using the addon
    const extractedText = pdfToTextAddon.pdfToText(pdfFilePath);

    // Save the extracted text to a .txt file
    fs.writeFileSync(txtFilePath, extractedText);

    res.send({ message: 'PDF converted to text successfully', filePath: `/txt_folder/${req.file.filename}.txt` });
  } catch (error) {
    console.error('Error converting PDF to text:', error);
    res.status(500).send('Error converting PDF to text');
  }
});
*/


app.get('/check-cookie', (req, res) => {
  const username = req.cookies ? req.cookies.username : null;
  if (username) {
    res.send(`Cookie found: ${username}`);
  } else {
    res.send('Cookie not found');
  }
});



// Serve static files from the Angular app directory
app.use('/angular17', express.static(path.join(__dirname, 'built/angular17/browser')));

// Serve the index.html file for any unknown paths within the Angular app
app.get('/angular17/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'built/angular17/browser/index.html'));
});


// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

/*/ Route to get the list of uploaded files
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files!');
    }
    res.send(files);
  });
});
*/









// Route to get the list of uploaded files
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files!');
    }

    // Map the files to include both name and URL
    const fileInfos = files.map((file) => {
      return {
        name: file,
        url: `${req.protocol}://${req.get('host')}/uploads/${file}`
      };
    });

    res.send(fileInfos);
  });
});

// Route to delete a file
app.delete('/files/:filename', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  const filePath = path.join(directoryPath, req.params.filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send('Could not delete the file');
      }

      res.status(200).send({ message: 'File deleted successfully' });
    });
  });
});



app.get('/linkedin', (req, res) => {
  const linkedinURL = 'https://www.linkedin.com/in/artem-ryzhov-90560a2a0/';
  res.redirect(linkedinURL);
});



// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
/*
mongoose.connect("mongodb+srv://torbezpekabayerpost:w4arC3QScq3RoX6K@cluster0.85jy1zr.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server once connected to the database
    app.listen(PORT, '127.0.0.1', () => console.log("Server running on port " + PORT));
  })
  .catch((err) => {
    console.error("Connection to MongoDB failed:", err);
  });

  */

  mongoose.connect("mongodb+srv://torbezpekabayerpost:w4arC3QScq3RoX6K@cluster0.85jy1zr.mongodb.net/forReactFinal?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server once connected to the database
    app.listen(PORT, '127.0.0.1', () => console.log("Server running on port " + PORT));
  })
  .catch((err) => {
    console.error("Connection to MongoDB failed:", err);
  });


/*
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




// Routes for Events
app.get('/api/events', ipTracker.handleRequest.bind(ipTracker), async (req, res) => {
  try {
    // Get the client's IP address
    const clientIp = ipTracker.getClientIp(req);

    // Fetch events that match the client's IP address
    const events = await Event.find({ 'ip.ip': clientIp });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send('Error fetching events');
  }
});
*/

app.get('/api/events', ipTracker.handleRequest.bind(ipTracker), async (req, res) => {
  try {
    // Get the client's IP address using the new getClientIp method
    const clientIp = ipTracker.getClientIp(req);

    // Fetch events where the IP matches the client's IP or '127.0.0.1' (localhost)
    const events = await Event.find({
      $or: [
        { 'ip.ip': clientIp },
        { 'ip.ip': '127.0.0.1' }  // Allow localhost IP
      ]
    });

    // Update the access count for each event based on Redis
    const updatedEvents = await Promise.all(events.map(async (event) => {
      // Get access count from Redis for the current IP
      let accessCount = await ipTracker.getAccessCount(clientIp);
      if (!accessCount) {
        accessCount = 1; // Fallback to default if accessCount is not found
      }
      
      event.ip.accessCount = accessCount;  // Update access count from Redis
      await event.save();  // Save the updated event in MongoDB
      return event;
    }));

    res.json(updatedEvents);
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

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send('Error fetching users');
  }
});

/*/ Route to create a new event
app.post('/api/events', async (req, res) => {
  try {
    // Retrieve the IP address of the client making the request
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log(`Client IP: ${clientIp}`);

    // Increment the count of how many times this IP has accessed the route
    await ipTracker.handleRequest(req, res, async () => {
      const accessCount = await ipTracker.getAccessCount(clientIp); // Use public method to get access count

      // Extract data from the request body
      const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;

      // Validate required fields
      if (!title || !description || !startTime || !endTime || !location || !createdBy) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create the new event including the IP and access count
      const newEvent = new Event({
        title,
        description,
        image,
        startTime,
        endTime,
        location,
        categoryIds,
        createdBy,
        ip: {
          ip: clientIp, // Store the IP address
          accessCount: parseInt(accessCount) || 1, // Store access count
        },
      });

      // Save the new event to the database
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    });
  } catch (error) {
    console.error('Error saving event to database:', error);
    res.status(500).json({ message: 'Error saving event to the database', error: error.message });
  }
});
*/


app.post('/api/events', async (req, res) => {
  try {
    // Retrieve the IP address of the client making the request
    const clientIp = req.ip || req.connection.remoteAddress;
    const accessCount = await ipTracker.getAccessCount(clientIp);

    // Extract the necessary fields from the request body
    const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;

    // Ensure createdBy is converted to ObjectId using 'new'
    const createdByObjectId = new mongoose.Types.ObjectId(createdBy);

    const newEvent = new Event({
      title,
      description,
      image,
      startTime,
      endTime,
      location,
      categoryIds,
      createdBy: createdByObjectId,  // Use the converted ObjectId
      ip: {
        ip: clientIp,
        accessCount: accessCount,
      },
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error saving event to database:', error);
    res.status(500).json({ message: 'Error saving event to the database', error: error.message });
  }
});


app.get('/getip', (req, res) => {
  const ip = req.params.ip;

  client.get(ip, (err, count) => {
    if (err) {
      console.error('Error accessing Redis:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ ip, count: count || 0 });
  });
});


// Route to update an existing event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;

    // Ensure that createdBy is a valid ObjectId
    const createdByObjectId = new mongoose.Types.ObjectId(createdBy);

    // Retrieve the client's IP address and access count
    const clientIp = req.ip || req.connection.remoteAddress;
    const accessCount = await ipTracker.getAccessCount(clientIp);

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
        createdBy: createdByObjectId,
        ip: {
          ip: clientIp, // Store client IP in the event
          accessCount: accessCount, // Store access count in the event
        },
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


// Other routes (e.g., fetching events, categories, users)...

// Route to delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});







// Route to fetch user data and render usersTable.html

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.sendFile(path.resolve(__dirname, 'usersTable.html'), { users });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send('Error fetching user data');
  }
});







// Route to serve usersTable.html
app.get('/usersTable', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'usersTable.html'));
});

// Route to serve message.html
app.get('/message.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'message.html'));
});


// Route to handle form submissions
app.post('/submit', async (req, res) => {
  try {
    const { name, email } = req.body;
    const existingUser = await Usersubmit.findOne({ email });

    if (existingUser) {
      // Set a cookie with the user's name if they already exist
      res.cookie('username', existingUser.name, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(409).send('User already exists');
    }

    const user = new Usersubmit({ name, email });
    await user.save();

    // Set a cookie with the user's name upon successful submission
    res.cookie('username', user.name, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error("Error saving data to database:", error);
    return res.status(500).send('Error saving data to the database');
  }
});

// Example route to display personalized message
app.get('/welcome', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.send(`Hey, ${username}! Welcome back!`);
  } else {
    res.send('Welcome, guest!');
  }
});




app.post('/submitmesx', async (req, res) => {
  try {
    // Extract name, email, and message from the form data
    const { name, email, message } = req.body;

    // Check if any of the fields are empty
    if (!name && !email && !message) {
      console.log("No valid data provided, skipping processing.");
      return res.status(400).send('No valid data provided.');
    }

    // Instantiate the Message class with the form data
    const userMessage = new Message(name, email, message);

    // Use the formattedMessage method to convert the properties into a string
    const formattedMessage = userMessage.formattedMessage();

    const TOKEN = "da95d54c576369870c39b46f762ba713";
    const ENDPOINT = "https://send.api.mailtrap.io/";

    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

    const sender = {
      email: "mailtrap@arnhem-front-end.site",
      name: "arnhem front end",
    };

    const recipients = [
      { email: "torbezpeka.bayer.post@gmail.com" }
    ];

    // Send the primary email if there is a valid message
    if (message) {
      await client.send({
        from: sender,
        to: recipients,
        subject: "Hy from arnhem-front-end.site!",
        text: formattedMessage,
        category: "Integration Test",
      });

      console.log("Email sent successfully");
    }

    // Send the reply email only if the email is present and valid
    if (email) {
      await userMessage.sendReply();
      console.log("Reply email sent successfully");
    }

    // Write the message to a file only if the message text is present
    if (message) {
      const child = userMessage.writeToFile('user_message.txt');
      userMessage.catchErrorsMessage(child, res); // Handle child process errors
    } else {
      // If no file writing is necessary, still send the success response
      res.redirect('/profile.html');
    }

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send('Error processing your request');
  }
});

app.set('views', path.join(__dirname, 'views')); // Set the directory for views
app.set('view engine', 'ejs'); // Set EJS as the view engine

app.get('/fetch-and-render', async (req, res) => {
  try {
    const data = await Usersubmit.find({});
    res.render('users', { data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Error fetching data');
  }
});


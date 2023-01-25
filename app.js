const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
// const connectDB = require('./config/db')
const colors = require('colors');
const cors = require('cors')

// Routes Import
const contactRoutes = require('./routes/contactRoutes')
const accountRoutes = require('./routes/accountRoutes')
const occupancyRoutes = require('./routes/occupancyRoutes')
const propertyRoutes = require('./routes/propertyRoutes');
const caseRoutes = require('./routes/caseRoutes');
const userRoutes = require('./routes/userRoutes');

// Config File
dotenv.config()

// Connect DB
// connectDB()

const app = express();
app.use(express.json())

// CORS
app.use(cors())

// Set up router for routes
const router = express.Router();

// Default route for main page and possibly documentation for api
app.use("/", router);

// Routes
app.use('/api/contacts', contactRoutes.routes)
app.use('/api/accounts', accountRoutes.routes)
app.use('/api/occupancies', occupancyRoutes.routes)
app.use('/api/properties', propertyRoutes.routes)
app.use('/api/cases', caseRoutes.routes)
app.use('/api/users', userRoutes.routes)

router.get("/", function (req, res) {
  const __dirname = path.resolve();
  res.sendFile(path.join(__dirname + "/index.html"));
});

// Error Middleware


app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`.yellow.bold));

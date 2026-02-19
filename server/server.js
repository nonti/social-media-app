import express from 'express'; 
import 'dotenv/config';
import cors from 'cors';
import upload from 'express-fileupload';
import { connectDB } from './config/mongodb.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import routes from './routes/routes.js';
import { server, app } from './socket/socket.js';
 

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(upload());


//ROUTES
app.use('/api', routes);


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler)


// Basic health check route
app.get('/', (req, res) => res.send('API is running...'));
// Start Server Wrapper
const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();
    
    // 2. Start listening only after DB is ready
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

startServer();
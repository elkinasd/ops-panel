const express = require('express');
const cors = require('cors');
const awsRoutes = require('./routes/aws.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/aws', awsRoutes);

module.exports = app;
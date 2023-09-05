const express = require('express');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/home');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
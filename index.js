// Requires
require('dotenv').config();
const app = require('./app');

// initializes the app
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`It is alive on http://localhost:${PORT}`)); 

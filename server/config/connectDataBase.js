const mongoose = require('mongoose');

const connectDataBase = (dbURI, dbName) => {
    const connection = mongoose.createConnection(dbURI, {
        dbName: dbName,
    });

    connection.on('connected', () => {
        console.log(`Mongoose connected to database: ${dbName}`);
    });
    connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
    });
    connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });
    return connection;  
};


module.exports = {
    tradehub: connectDataBase(process.env.MONGO_URI, 'tradehub'),
};
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { tradehub } = require('./config/connectDataBase');

const closeConnections = async () => {
    try{
        await tradehub.close();
        console.log('Database connections closed.');
        process.exit(0);    
    }
    catch(err){
        console.error('Error closing database connections:', err);
        process.exit(1);
    }
};

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}
);

const handleExit = async (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    server.close(async () => {
        console.log('Server closed.');
        await closeConnections();
    });

}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await closeConnections();
}
);
process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await closeConnections();
}
);
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
}
);
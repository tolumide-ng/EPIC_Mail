import express from 'express';
import '@babel/polyfill';
import morgan from 'morgan';
import bodyParser from 'body-parser';


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    return res.status(200).json({ message: "'YAY!' Welcome to EPIC_Mail"});
});



// Handle unavailable routes
app.use((req, res, next) => {
    const error = new Error('Route not listed in endpoints, Not found');
    error.status = 400;
    next(err);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: { message: `This error is thrown from ${error.message}` }});
});

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`server is running on port ${port}` )});

export default app;

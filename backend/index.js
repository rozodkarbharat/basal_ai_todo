const express = require('express')
const cors = require('cors')
const app = express()
let cookieParser = require('cookie-parser'); 
const userRoute = require('./Routes/user.route');
const connection = require('./db');
const todoRoute = require('./Routes/todo.route');


app.use(express.json())
// app.use(cors())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser()); 


app.use("/auth",userRoute)
app.use("/todos",todoRoute)


app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})



app.listen(8000, async() => {
    try {
        await connection
        console.log('Server is running on port 8000')
    } catch (error) {
        console.log(error,'Error while listening on port 8000')
    }
 
})
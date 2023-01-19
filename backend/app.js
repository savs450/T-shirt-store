require('dotenv').config()      //used when we don't to expose our url and port as it is confidental things

const mongoose = require('mongoose');
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require('morgan')

//My routes
const authRoutes = require('./routes/authentication.js')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require("./routes/order")
const paymentBRoutes = require("./routes/paymentBRoutes")


//DB CONNECTION
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true
    }).then(()=> {
        console.log("DB CONNECTED")
    }) 
//myfun.run().then().catch() this run() works when then() have success otherwise it runs catch()

//MIDDLEWARE
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(morgan("dev"))

//MY ROUTES
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)
app.use("/api",paymentBRoutes)

//PORTS
const port = process.env.PORT || 8000

//STARTING A SERVER
app.listen(port,()=> {
    console.log(`app is running at ${port}`)
})

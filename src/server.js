import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

import articlesRouter from "./services/users/index.js"
import usersRoutes from "./services/users/index.js"

import { unauthorizedErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3001

// *************** MIDDLEWARES ****************

server.use(express.json())

// *************** ROUTES ***********************

server.use("/users", usersRoutes)
server.use("/articles", articlesRouter)

// *************** ERROR HANDLERS *****************

server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port: ", port)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})

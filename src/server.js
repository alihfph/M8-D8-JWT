import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import articlesRouter from "./services/articles/index.js" 
import authorRouter from "./services/authors/index.js";
import {
    notFoundErrorHandler,
    badRequestErrorHandler,
    catchAllErrorHandler,
  } from "./errorHandlers.js";

const server = express()
const PORT = process.env.PORT 

server.use(express.json())


server.use("/articles", articlesRouter);
server.use("/authors", authorRouter);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);
console.table(listEndpoints(server))

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
console.log(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(PORT, () => {
    console.log("Server is running on port: ", PORT)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})


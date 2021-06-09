import atob from "atob"

import AuthorModel from "../services/authors/schema.js"

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization){
    // if you don't provide credentials y ou are getting a 401
    const error = new Error("Please provide auth!")
    error.httpStatusCode = 401
    next(error)
  } else {
    const decoded = atob(req.headers.authorization.split(" ")[1])
   
    const [email, password] = decoded.split(":")

    // check the credentials

    const newauthor = await AuthorModel.checkCredentials(email, password)
    console.log(req.author)
    if (newauthor) {
      
      req.author = newauthor
      next()
    } else {
      const error = new Error("Credentials are wrong")
      error.httpStatusCode = 401
      next(error)
    }

    // const user = await UserModel.findOne({ email })
    // if (user) {
    //   // compare plainPW with hashedPW
    //   const isMatch = await bcrypt.compare(password, user.password)
    //   if (isMatch) {
    //     next()
    //   } else {
    //     const error = new Error("Credentials are wrong!")
    //     error.httpStatusCode = 401
    //     next(error)
    //   }
    // } else {
    //   const error = new Error("Credentials are wrong!")
    //   error.httpStatusCode = 401
    //   next(error)
    // }
  }
}

export const adminOnly = (req, res, next) => {
  if (req.author.role === "Admin") {
    next()
  } else {
    const error = new Error("Admin Only")
    error.httpStatusCode = 403
    next(error)
  }
}
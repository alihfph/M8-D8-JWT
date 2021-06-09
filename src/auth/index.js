import AuthorModel from "../services/authors/schema.js"
import { verifyJWT } from "./tools.js"

export const jwtAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = await verifyJWT(token)
    const author = await AuthorModel.findOne({
      _id: decoded._id,
    })

    if (!author) {
      throw new Error()
    }

    req.author = author
    next()
  } catch (e) {
    console.log(e)
    const err = new Error("Please authenticate")
    err.httpStatusCode = 401
    next(err)
  }
}

export const adminOnlyMiddleware = async (req, res, next) => {
  if (req.author && req.author.role === "Admin") next()
  else {
    const err = new Error("Only for admins!")
    err.httpStatusCode = 403
    next(err)
  }
}
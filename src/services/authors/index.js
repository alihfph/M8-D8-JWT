import express from "express";
import { adminOnlyMiddleware, jwtAuthMiddleware } from "../../auth/index.js"
import { authenticate, refreshToken } from "../../auth/tools.js"

import AuthorModel from "./schema.js";

const authorRouter = express.Router();

authorRouter.post("/register", async (req, res, next) => {
    try {
      const newAuthor = new AuthorModel(req.body)
      console.log(newAuthor)
     const {_id} = await newAuthor.save()
  
      res.status(201).send(_id)
    } catch (error) {
      console.log(error, "this is error")
      next(error)
    }
  })

  authorRouter.get("/", jwtAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
    try {
      const author = await AuthorModel.find()
      res.send(author)
    } catch (error) {
      next(error)
    }
  })

authorRouter.get("/me",jwtAuthMiddleware, async (req, res, next) => {
  try {

    res.send(req.author);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorRouter.put("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body)

    // req.user.name = req.body.name

    const updates = Object.keys(req.body)

    updates.forEach(u => (req.author[u] = req.body[u]))

    await req.author.save()

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

authorRouter.delete("/me", jwtAuthMiddleware, async (req, res, next) => {
  try {
    //const author = await AuthorModel.findByIdAndDelete(req.params.id);
    await req.author.deleteOne()
    res.status(204).send()
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const author = await AuthorModel.checkCredentials(email, password)
    const tokens = await authenticate(author)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

authorRouter.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken
  if (!oldRefreshToken) {
    const err = new Error("Refresh token missing")
    err.httpStatusCode = 400
    next(err)
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken)
      res.send(newTokens)
    } catch (error) {
      console.log(error)
      const err = new Error(error)
      err.httpStatusCode = 401
      next(err)
    }
  }
})

authorRouter.post("/logout", jwtAuthMiddleware, async (req, res, next) => {
  try {
    req.author.refreshToken = null
    await req.author.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

export default authorRouter;
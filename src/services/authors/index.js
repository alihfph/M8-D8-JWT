import express from "express";
import mongoose from "mongoose"
import q2m from "query-to-mongo";
import { basicAuthMiddleware, adminOnly } from "../../auth/index.js"
import AuthorModel from "./schema.js";

const authorRouter = express.Router();

authorRouter.post("/register", async (req, res, next) => {
    try {
      const newAuthor = new AuthorModel(req.body)
      console.log(newAuthor)
     const {_id} = await newAuthor.save()
  
      res.send(_id).status(2001)
    } catch (error) {
      console.log(error, "this is error")
      next(error)
    }
  })

authorRouter.get("/", basicAuthMiddleware, adminOnly, async (req, res, next) => {
  try {
    //const query = q2m(req.query);
    //const total = await AuthorModel.countDocuments(query.criteria);

    //const authors = await AuthorModel.find(query.criteria, query.options.fields)
      //.skip(query.options.skip)
      //.limit(query.options.limit)
      //.sort(query.options.sort);

    //res.send({ links: query.links("/author", total), authors });
    const author = await AuthorModel.find()
    res.send(author);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorRouter.get("/me",basicAuthMiddleware, async (req, res, next) => {
  try {
    // const author = await AuthorModel.findById(req.params.id);
    console.log(req.body, "this one here")
    const author = await AuthorModel.find()
    res.send(req.author);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorRouter.put("/me",basicAuthMiddleware, async (req, res, next) => {
  try {

    //const modifiedAuthor = await AuthorModel.findByIdAndUpdate(
      //req.params.id,
      //req.body,
      //{
        //runValidators: true,
        //new: true,
     // }
     const update = Object.keys(req.body)
     update.forEach(u=>(req.author[u]= req.author[u] ))
     await req.author.save()
     req.status(204).send()
    // );
    // if (modifiedAuthor) {
     // res.send(modifiedAuthor);
    //} else {
    //  next();
   // }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorRouter.delete("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    //const author = await AuthorModel.findByIdAndDelete(req.params.id);
    await req.author.deleteOne()
    if (req.author) {
      res.send("Deleted");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default authorRouter;
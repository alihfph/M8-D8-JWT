import express from "express";
import mongoose from "mongoose";
import articleModel from "./schema.js";

const articlesRouter = express.Router();

articlesRouter.get("/", async (req, res, next) => {
  try {
    const users = await articleModel.find().populate("authors");
    res.send(users);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await articleModel.findById(id).populate("authors");
    if (user) {
      res.send(user);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading users list a problem occurred!");
  }
});

articlesRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new articleModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

articlesRouter.put("/:id", async (req, res, next) => {
  try {
    const user = await articleModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (user) {
      res.send(user);
    } else {
      const error = new Error(`User with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = await articleModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.send("Deleted");
    } else {
      const error = new Error(`User with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.post("/:id/reviews/", async (req, res, next) => {
  try {
    // 1. obtain the book from the books collection
    const userReview = req.body;
    console.log(userReview);
    // const purchasedBook = await BookModel.findById(bookId, { _id: 0 })
    const addReviews = {
      ...userReview,
      date: new Date(),
    };
    // 2. update the specified user (userId) purchaseHistory by adding a new element to that array

    const updated = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: addReviews,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.send(updated);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.get("/:id/reviews/", async (req, res, next) => {
  try {
    const { reviews } = await articleModel.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews } = await articleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        reviews: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(req.params.reviewId),
          },
        },
      }
    ); // PROJECTION, elemMatch is a projection operator)

    // const { purchaseHistory } = await articleModel.findOne(
    //   { _id: mongoose.Types.ObjectId(req.params.userId) }, // QUERY
    //   { purchaseHistory: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.bookId) } } } // PROJECTION, elemMatch is a projection operator
    // )

    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const deleteReview = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          reviews: {
            _id: mongoose.Types.ObjectId(req.params.reviewId),
          },
        },
      },
      {
        new: true,
      }
    );
    res.send(deleteReview);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedreviews = await articleModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
        "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
      },
      {
        $set: {
          "reviews.$": {
            ...req.body,
            _id: req.params.reviewId,
          },
        },
      }, // The concept of the $ is pretty similar as having something like const $ = array.findIndex(el => el._id === req.params.bookId)
      {
        runValidators: true,
        new: true,
      }
    );

    if (modifiedreviews) {
      res.send(modifiedreviews);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default articlesRouter;
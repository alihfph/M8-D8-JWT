import mongoose from "mongoose";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    headLine: "string",
    subHead: "string",
    content: "string",
    category: {
      name: "string",
      img: "string",
    },
    authors: [{ type: Schema.Types.ObjectId, required: true, ref: "Author" }],
    reviews: [
      {
        type: new Schema(
          {
            text: {
              type: String,
              required: [true, "text field is required"],
              trim: true,
            },
            user: {
              type: String,
              required: [true, "user field is required"],
              trim: true,
            },
          }
          // { timestamps: true }
        ),
      },
    ],
  },
  { timestamps: true }
);

articleSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

// UserSchema.static("findArticleWithAuthors", async function (id) {
//   const article = await this.findOne({ _id: id }).populate("authors");
//   return article;
// });

// UserSchema.static("findArticlesWithAuthors", async function (query) {
//   const total = await this.countDocuments(query.criteria);
//   const books = await this.find(query.criteria)
//     // .skip(query.options.skip)
//     // .limit(query.options.limit)
//     // .sort(query.options.sort)
//     .populate("authors");

//   return { total, books };
// });

export default model("User", articleSchema);
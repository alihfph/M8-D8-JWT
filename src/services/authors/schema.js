import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const AuthorSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["Admin", "Writer"] },
  articles: [{ type: Schema.Types.ObjectId, required: true, ref: "article" }],
});


AuthorSchema.pre("save", async function (next) {
    const newAuthor = this
  
    const plainPW = newAuthor.password
    if (newAuthor.isModified("password")) {
        newAuthor.password = await bcrypt.hash(plainPW, 10)
    }
    next()
   })

  AuthorSchema.methods.toJSON = function () {
    const author = this
  
    const authorObject = author.toObject()
  
    delete authorObject.password
    delete authorObject.__v
    return authorObject
  }

  AuthorSchema.statics.checkCredentials = async function (email, plainPW) {
    const author = await this.findOne({ email })
    console.log(author)
  
    if (author) {
      console.log(plainPW)
      console.log(author.password)
      const isMatch = await bcrypt.compare(plainPW, author.password)
      if (isMatch) return author
      else return null
    } else return null
  }
export default model("Author", AuthorSchema);
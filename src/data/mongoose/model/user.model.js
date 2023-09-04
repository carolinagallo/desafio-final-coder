import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
const userCollection = "users";

const userSchema = new mongoose.Schema({
  firstName: { type: Schema.Types.String, required: true },
  lastName: { type: Schema.Types.String },
  email: { type: Schema.Types.String, unique: true, required: true },
  age: { type: Number, default: 18 },
  role: { type: Schema.Types.ObjectId, index: true, ref: "roles" },
  isAdmin: { type: Boolean, default: false },
  password: { type: Schema.Types.String },
  cart: { type: Schema.Types.ObjectId, index: true, ref: "carts" },
  lastConnection: { type: Schema.Types.Date },
  documents: [
    {
      name: { type: Schema.Types.String },
      reference: { type: Schema.Types.String },
    },
  ],
});

userSchema.plugin(paginate);

userSchema.pre("find", function () {
  this.populate(["role"]);
});

userSchema.pre("findOne", function () {
  this.populate(["role", "cart"]);
});

userSchema.pre("find", function () {
  this.populate(["cart"]);
});

export const userModel = mongoose.model(userCollection, userSchema);

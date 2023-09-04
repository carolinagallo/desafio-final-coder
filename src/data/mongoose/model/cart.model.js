import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: { type: Number },
    },
  ],
});

//cartSchema.pre("findOne", function () {
//  this.populate("products._id");
//});
//
//cartSchema.pre("find", function () {
//  this.populate("products._id");
//});

export const cartModel = mongoose.model(cartCollection, cartSchema);

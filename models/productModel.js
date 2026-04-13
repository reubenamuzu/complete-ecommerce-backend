import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    price: {type: Number, required:true},
    category: {type: String, required:true},
    image: {type: Array, required:true},
    sizes: {type: Array, required:true},
    description: {type:String, required:true},
    subCategory: {type: String, default: ''},
    bestseller: {type: Boolean, default: false},
    date: {type: Number, default: Date.now},
    stock: {type: Object, default: {}},
    avgRating: {type: Number, default: 0},
    reviewCount: {type: Number, default: 0}
})

productSchema.index({ name: 'text', description: 'text' })  


const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel

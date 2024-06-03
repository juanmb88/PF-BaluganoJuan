import mongoose from 'mongoose'
/* const usersCollection = "users";

 export const usuarioModelo = mongoose.model('users', new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    carrito: {  type: mongoose.Types.ObjectId, ref: "carts"   }
} ,
{
    timestamps: true, strict:false
} )) */

const userSchema = new mongoose.Schema({

    first_name: { type: String, required: true },
    last_name: { type: String},
    email: { type: String, required: true, unique: true },
    age: { type: Number},
    password: { type: String },
    carrito: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: { type: String, default: 'user' }

});

export const usuarioModelo = mongoose.model('users', userSchema);
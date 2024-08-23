import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    first_name: { type : String, required: true },
    last_connection: { type: Date },
    last_name: { type : String },
    email: { type : String, required: true, unique: true },
    age: { type : Number },
    password: { type : String },
    carrito: { type : mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: { type : String, default : "usuario" },
    documents: {
        type: [{
            name: String,
            reference: String
          },
        ],
        default: [{
          name:"identificacion",
          reference:""
        },
          {
          name:"comprobanteProducto",
          reference:""
          },
          {
          name:"comprobanteEstadoDeCuenta",
          reference:""
          },
        ]
    }
},
{
    timestamps: true, 
    strict: false 
},
);

export const usuarioModelo = mongoose.model('users', userSchema);
import mongoose, { isValidObjectId } from "mongoose";
import {CartManager} from "../../src/dao/cartManager.js";
import {afterEach, before, describe, it} from "mocha";
import {expect} from "chai";
import supertest from "supertest"



const connDB = async() =>{
    try {
        await mongoose.connect(
            "mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/?&dbName=ecommerce",
            
        )
        console.log("DB conectada...desde test carrito!!!")
    } catch (error) {
        console.log(`Error al conectar a DB: ${error}`)
    }
}
connDB()
const requester = supertest("http://localhost:8080")
afterEach(async function () {
    if (this.createdCartId) {
        await requester.delete(`/api/carts/${this.createdCartId}`);
    }
});

before(async function(){
    this.dao = new CartManager()
})
describe("Pruebas sobre carrito", function () { 
   
    //Traer carrito por id
    it("Debería traer un carrito por ID, verifica si carrito tiene un _id, Verifica que 'carrito' tiene un '_id' que coincide con el cartId, carrito cuenta con propiedad products, y verifica fecha de creacion", async function () {
        const cartId = "667df4fce16135a87bb44e43";
        const { body, status } = await requester.get(`/api/carts/${cartId}`);

        expect(status).to.be.equal(200);
        expect(body).to.have.property('carrito');  
        expect(body.carrito).to.have.property('_id').that.equals(cartId);  // Verifica que 'carrito' tiene un '_id' que coincide con el cartId
        expect(body.carrito).to.have.property('products').that.is.an('array');  // Verifica que 'carrito' tiene una propiedad 'products' que es un array
        expect(body.carrito).to.have.property('createdAt');  // Verifica que tiene una fecha de creación
    
    });
    it("Debería traer todos los carritos, verifica por respuesta exitosa, si tiene propiedad 'carts' que es un array, que cada carrito tenga un _id,cada carrito tiene un array de productos", async function () {
        const { body, status } = await requester.get("/api/carts");
        expect(status).to.be.equal(200);  
        expect(body).to.have.property('carts').that.is.an('array');  
    
        if (body.length > 0) {
            expect(body[0]).to.have.property('_id');  
            expect(body[0]).to.have.property('products').that.is.an('array');  
            expect(body[0]).to.have.property('createdAt'); 
          
        }
    }); 

//Crear carrito
     it("Debería crear un nuevo carrito", async function () {
        const { body, status } = await requester.post("/api/carts");
        expect(status).to.be.equal(201);  
        expect(body).to.be.an('object');  
        expect(body).to.have.property('status').that.equals('success'); 
        expect(body).to.have.property('cart').that.is.an('object'); 
    
        const cart = body.cart;
        expect(cart).to.have.property('_id');  
        expect(cart).to.have.property('products').that.is.an('array').that.is.empty;  
        expect(cart).to.have.property('createdAt');  
    }); 
    //debe agregar producto a carrito 
   
 }) 
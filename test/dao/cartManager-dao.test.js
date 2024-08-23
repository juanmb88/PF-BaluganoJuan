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
    } catch (error) {
        console.log(`Error al conectar a DB: ${error}`)
    }
}
connDB();

const requester = supertest("http://localhost:8080");



before(async function () {
    this.dao = new CartManager();
    
    const loginResponse = await requester.post("/api/sessions/login").send({
        email: "admincoder@coder.com",
        password: "admin"
    });
    
    const { body, headers } = loginResponse;
    this.token = body.token;
    
    if (headers["set-cookie"]) {
        this.cookie = headers["set-cookie"][0].split(";")[0];
    } else {
        console.error("No se encontró la cookie en la respuesta de inicio de sesión.");
    }
    
    const cartResponse = await requester.post("/api/carts")
    .set("Cookie", this.cookie);
    
    this.createdCartId = cartResponse.body.cart._id;
});

 after(async function () {
    if (this.createdCartId) {
        await requester.delete(`/api/carts/${this.createdCartId}`)
        .set("Cookie", this.cookie);
    }
}); 

/* afterEach(async function () {
   if (this.createdCartId) {
       await requester.delete(`/api/carts/${this.createdCartId}`);
   }
});  */
const authRequest = (requester, method, url, token, cookie) => {
    return requester[method](url).set('Cookie', cookie);
};

describe("Pruebas sobre carrito", function () { 
    
    it("Debería traer un carrito por ID, verifica si carrito tiene un _id, que coincide con el cartId, cuenta con propiedad products, y verifica fecha de creacion", async function () {
        const cartId = "66c7d78aefec9df00759cf94";
        const { body, status } = await requester.get(`/api/carts/${cartId}`);
        
        expect(status).to.be.equal(200);
        expect(body).to.have.property('carrito');  
        expect(body.carrito).to.have.property('_id').that.equals(cartId); 
        expect(body.carrito).to.have.property('products').that.is.an('array'); 
        expect(body.carrito).to.have.property('createdAt'); 
    
    });
    it("Debería traer todos los carritos, verifica por respuesta exitosa, si tiene propiedad 'carts' que sea array, que cada carrito tenga un _id,cada carrito tiene un array de productos", async function () {
        const { body, status } = await requester.get("/api/carts");
        expect(status).to.be.equal(200);  
        expect(body).to.have.property('carts').that.is.an('array');  
    
        if (body.length > 0) {
            expect(body[0]).to.have.property('_id');  
            expect(body[0]).to.have.property('products').that.is.an('array');  
            expect(body[0]).to.have.property('createdAt'); 
          
        }
    }); 
    
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
    it("Debería agregar un producto al carrito exitosamente", async function () {
        const pid = "66c7d92c301cfedea1b2dcac"; 
        const { body, status } = await authRequest(requester, 'post', `/api/carts/${this.createdCartId}/products/${pid}`, this.token, this.cookie);
    
        console.log("Response body:", body); // Agrega esto para ver el cuerpo de la respuesta
        console.log("Status:", status);
    
        expect(status).to.be.equal(200);
        expect(body).to.have.property('payload').that.equals("Carrito actualizado, se agregó producto exitosamente");
    
        const carrito = await authRequest(requester, 'get', `/api/carts/${this.createdCartId}`, this.token, this.cookie);
        
        expect(carrito.body.carrito.products).to.be.an('array').that.is.not.empty;
        expect(carrito.body.carrito.products[0]).to.have.property('product');
        expect(carrito.body.carrito.products[0].product).to.have.property('_id').that.equals(pid);
        expect(carrito.body.carrito.products[0]).to.have.property('quantity').that.equals(1);
    });
}) 
import mongoose from "mongoose";
import { describe, it, before, afterEach } from "mocha";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Pruebas sobre productos", function () {

    before(async function () {
        // Conectar a la base de datos antes de ejecutar las pruebas
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect("mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/?&dbName=ecommerce");
            console.log("DB conectada... desde test productos");
        }

        // Simula un login para obtener el token
        const loginResponse = await requester.post('/api/sessions/login').send({
            email: 'admincoder@coder.com',
            password: 'admin'
        });

        const { body, headers } = loginResponse;
        this.token = body.token;
    
        if (headers["set-cookie"]) {
            this.cookie = headers["set-cookie"][0].split(";")[0];
        } else {
            throw new Error("No se pudo obtener el token de autenticación o la cookie");
        }
    });

    afterEach(async function () {
        if (this.createdProductId) {
            await requester.delete(`/api/products/${this.createdProductId}`)
                .set("Cookie", this.cookie);
        }
    });

    it("Debería obtener la lista de productos, verifica las propiedades del producto, que sea un arreglo la propiedad de products", async function () {
        const { body, status } = await requester.get("/api/products")
            .set('Cookie', this.cookie);
    
        expect(status).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('products').that.is.an('array');
    
        if (body.products.length > 0) {
            const firstProduct = body.products[0];
            expect(firstProduct).to.have.property('_id');
            expect(firstProduct).to.have.property('title');
            expect(firstProduct).to.have.property('price');
            expect(firstProduct).to.have.property('description');
        }
    });
    
    it("Debería crear un nuevo producto y verificar la respuesta", async function () {
        const newProduct = {
            title: "Producto de ejemplo simple",
            description: "Descripción del producto de ejemplo",
            price: 100,
            stock: 10,
            code: `PROD${Date.now()}`,
            category: "Categoría de ejemplo"
        };
    
        const { body, status } = await requester.post("/api/products")
            .set('Cookie', this.cookie)
            .send(newProduct);
    
        expect(status).to.be.equal(201);
        expect(body).to.not.be.null;
        expect(body).to.be.an('object');
    
        const createdProduct = body.newProduct;
    
        expect(createdProduct).to.not.be.null;
        expect(createdProduct).to.have.property('_id');
        expect(createdProduct).to.have.property('title').that.equals(newProduct.title);
        expect(createdProduct).to.have.property('description').that.equals(newProduct.description);
        expect(createdProduct).to.have.property('price').that.equals(newProduct.price);
        expect(createdProduct).to.have.property('stock').that.equals(newProduct.stock);
        expect(createdProduct).to.have.property('code').that.equals(newProduct.code);
        expect(createdProduct).to.have.property('category').that.equals(newProduct.category);
    
        this.createdProductId = createdProduct._id;
    });

    it("Debería obtener un producto por ID válido", async function () {
        const pid = "66c7d92c301cfedea1b2dcac";
    
        const { body, status } = await requester.get(`/api/products/${pid}`)
            .set('Cookie', this.cookie);
    
        expect(status).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status').that.equals('success');
        expect(body).to.have.property('productfind').that.is.an('object');
    
        const product = body.productfind;
        expect(product).to.have.property('_id').that.equals(pid);
    });
    
    it("Debería devolver un error para un ID de producto inválido", async function () {
        const invalidPid = "1234";
    
        const { body, status } = await requester.get(`/api/products/${invalidPid}`)
            .set('Cookie', this.cookie);
    
        expect(status).to.be.equal(400);
        expect(body).to.be.an('object');
        expect(body).to.have.property('error').that.equals('ID de producto inválido');
    });
});

 
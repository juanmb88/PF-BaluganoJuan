import mongoose from "mongoose";
import { describe, it, before, afterEach } from "mocha";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Pruebas rutas de productos", function () {
    let token;

    before(async function () {
        // Conectar a la base de datos antes de ejecutar las pruebas
        await mongoose.connect("mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/?&dbName=ecommerce", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB conectada... desde test productos");

        // Simula un login para obtener el token
        const loginResponse = await requester.post('/api/sessions/login').send({
            email: 'adminCoder@coder.com',  // Usa un correo y contraseña válidos para un usuario con permisos
            password: 'admin'  // Asegúrate de usar la contraseña correcta
        });

        // Captura el token de la cookie
        if (loginResponse.status === 200 && loginResponse.headers['set-cookie']) {
            token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
        } else {
            throw new Error("No se pudo obtener el token de autenticación");
        }
    });

    afterEach(async function () {
        // Limpia la base de datos después de cada prueba eliminando el producto creado
        if (this.createdProductId) {
            await requester.delete(`/api/products/${this.createdProductId}`).set('Cookie', `CookiePrueba=${token}`);
        }
    });

     it("Debería obtener la lista de productos,  verifica las propiedades del producto, que sea un arreglo la propiedad de products", async function () {
        const { body, status } = await requester.get("/api/products").set('Cookie', `CookiePrueba=${token}`);

        expect(status).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('products').that.is.an('array');
        
        // Si hay productos en la lista, verifica las propiedades del primer producto
        if (body.products.length > 0) {
            const firstProduct = body.products[0];
            expect(firstProduct).to.have.property('_id');
            expect(firstProduct).to.have.property('title');
            expect(firstProduct).to.have.property('price');
            expect(firstProduct).to.have.property('description');
        }
    }); 

    it("Debería crear un nuevo producto verifica : respuesta código en estado 201,el producto creado no es nulo, producto creado tiene un '_id', que el 'stock' es correcto,Ajuste para el rol admin", async function () {
        const newProduct = {
            title: "Producto de ejemplo único",  // Asegúrate de que el título sea único
            description: "Descripción del producto de ejemplo",
            price: 100,
            stock: 10,
            code: "PROD1234",
            category: "Categoría de ejemplo",
            status: true,
            owner: "owner@example.com"
        };
    
        const { body, status } = await requester.post("/api/products")
            .set('Cookie', `CookiePrueba=${token}`)
            .send(newProduct);
        
        expect(status).to.be.equal(201);  
        expect(body).to.not.be.null;  // Asegúrate de que el cuerpo de la respuesta no es nulo
        expect(body).to.be.an('object');  // Verifica que el cuerpo de la respuesta es un objeto
    
        const createdProduct = body.newProduct;  // Accede a `newProduct` directamente
    
        expect(createdProduct).to.not.be.null;  // Asegúrate de que el producto creado no es nulo
        expect(createdProduct).to.have.property('_id');  // Verifica que el producto creado tiene un '_id'
        expect(createdProduct).to.have.property('title').that.equals(newProduct.title);  // Verifica que el 'title' es correcto
        expect(createdProduct).to.have.property('description').that.equals(newProduct.description);  // Verifica que la 'description' es correcta
        expect(createdProduct).to.have.property('price').that.equals(newProduct.price);  // Verifica que el 'price' es correcto
        expect(createdProduct).to.have.property('stock').that.equals(newProduct.stock);  // Verifica que el 'stock' es correcto
        expect(createdProduct).to.have.property('code').that.equals(newProduct.code);  // Verifica que el 'code' es correcto
        expect(createdProduct).to.have.property('category').that.equals(newProduct.category);  // Verifica que la 'category' es correcta
        expect(createdProduct).to.have.property('status').that.equals(newProduct.status);  // Verifica que el 'status' es correcto
        expect(createdProduct).to.have.property('owner').that.equals('admin');  // Ajuste para el rol "admin"
    
        // Guardar el ID del producto creado para su eliminación posterior
        this.createdProductId = createdProduct._id;
    }); 

    it("Debería obtener un producto por ID válido verifica si respuesta fue exitosa, respuesta es un objeto, el estado es 'success',ID del producto es el correcto", async function () {
        const pid = "667b5e018f0a2f2166ffc478";  // Reemplaza con un ID de producto válido en tu base de datos

        const { body, status } = await requester.get(`/api/products/${pid}`)
            .set('Cookie', `CookiePrueba=${token}`);

        expect(status).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status').that.equals('success');  
        expect(body).to.have.property('productfind').that.is.an('object');

        const product = body.productfind;
        expect(product).to.have.property('_id').that.equals(pid); 
     
    });

    it("Debería devolver un error para un ID de producto inválido", async function () {
        const invalidPid = "1234";  // Un ID de producto no válido

        const { body, status } = await requester.get(`/api/products/${invalidPid}`)
            .set('Cookie', `CookiePrueba=${token}`);
            
        expect(status).to.be.equal(400);  // Verifica que la respuesta tiene un código de estado 400
        expect(body).to.be.an('object');  // Verifica que el cuerpo de la respuesta es un objeto
        expect(body).to.have.property('error').that.equals('ID de producto inválido');  // Verifica que el error es el esperado
    });
});


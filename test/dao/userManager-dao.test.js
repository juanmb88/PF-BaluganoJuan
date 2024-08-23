import mongoose, { isValidObjectId } from "mongoose";
import {UsersManager} from "../../src/dao/userManager.js";
import {afterEach, before, describe, it} from "mocha";
import {expect} from "chai";
import supertest from "supertest"

const connDB = async() =>{
    try {
        await mongoose.connect(
            "mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/?&dbName=ecommerce",
            
        )
        console.log("DB conectada...!!!")
    } catch (error) {
        console.log(`Error al conectar a DB: ${error}`)
    }
}
connDB()

const requester = supertest("http://localhost:8080")

let {body,status,ok,headers} = await requester.get("/api/sessions")
describe("Pruebas sobre usuarios", function(){
  this.timeout(10000)
  
  before(async function(){
    this.timeout(8000);
    this.dao = new UsersManager()
    }) 

      afterEach(async function () {
        // Limpia la base de datos después de cada prueba eliminando el usuario de prueba
        await mongoose.connection.collection("users").deleteOne({ email: "test20@test.com" });
    }); 
  

     it("El dao con su método get, retorna un array de usuarios", async function(){
        let resultado=await this.dao.getBy()
         expect(Array.isArray(resultado)).to.be.equal(true)
         expect(Array.isArray(resultado)).to.be.true
         expect(Array.isArray(resultado)).not.to.be.false

          if(Array.isArray(resultado) && resultado.length>0){
            expect(resultado[0]._id).to.be.exists
            expect(resultado[0].email).to.be.ok

              let usuarioDeshidratado=resultado[0]
                expect(Object.keys(usuarioDeshidratado).includes("_id")).to.be.ok
                expect(Object.keys(usuarioDeshidratado).includes("email")).to.be.true
        }  
    }) 

      it("Del dao se debe crear un user en la DB", async function(){
        let resultado = await mongoose.connection.collection("users").findOne({email:"test20@test.com"})
      
        let mockUser = { first_name:"test", last_name:"test", email:"test20@test.com", age: "99", password:"123" }
        resultado = await this.dao.create(mockUser)

        expect(resultado._id).to.be.exists
        expect(isValidObjectId(resultado._id), true).to.be.ok
    
    })    

}) 
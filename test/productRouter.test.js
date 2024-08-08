import supertest from "supertest"
import mongoose from "mongoose"

const requester = supertest("http://localhost/8080")
const connDB = async()=>{
    await mongoose.connect("mongodb://localhost:27017/")
}

let resultado =await requester.get()
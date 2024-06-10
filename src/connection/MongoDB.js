import mongoose from "mongoose";
 import  {configEntornoClusterMDB} from "../config/config.js";


 const connectDB = async ()=>{
    
    try{
        await mongoose.connect(configEntornoClusterMDB.CLUSTER) 
        console.log("Conectado a la base de datos de MongoDB")
    }catch(error){
        console.log("Error conectar a la base de datos de MongoDB", error.message)
    }
}
 
export default connectDB;




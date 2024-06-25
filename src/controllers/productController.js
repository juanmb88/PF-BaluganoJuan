import { productService } from "../services/ProductService.js";


export class ProductController{

    static getProduct = async (req,res) => {
        const products= await productService.getProducts();
        res.json({products})
    }

    static getProductById = async (req, res) => {
        const productfind = await productService.getProductById(req.params);
        res.json({ status: "success", productfind });
    }

    static updateProduct = async (req, res) => {
        const updatedproduct = await productService.updateProduct( req.params, req.body );
         res.json({ status: "success", updatedproduct });
    }

    static deleteById = async (req, res) => {
        const id = req.params.pid
        const deleteproduct = await productService.deleteProductById(id);
         res.json({ status: "success",deleteproduct });
    }

    static addProduct = async(req, res)=>{

        let {title, ...otrasPropiedades}=req.body;
    
        if(!title){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`titulo es requerido`})
        }
    
        let existe;
    
        try {
            existe = await productService.getOneBy({title})
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Unexpected server error - Try later, or contact your administrator`,
                    detalle:`${error.message}`
                } )
        }
         if(existe) {
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe ${title} en BD`});
        } 
    
        try {
            let newProduct=await productService.create({title, ...otrasPropiedades});
            res.setHeader('Content-Type','application/json');
            return res.status(201).json({newProduct});
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Unexpected server error - Try later, or contact your administrator`,
                    detalle:`${error.message}`
                } )
        }
    }
}
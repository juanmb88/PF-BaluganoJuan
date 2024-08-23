import  {cartsModel}  from "./models/carts.model.js";

class CartManager {

  ID_FIELD = "_id";

  async createCart() {
    try {
     let carrito = await cartsModel.create({products:[]});
     return carrito.toJSON()
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  async getAllCarts() {
    const carts = await cartsModel.find().lean();
    return carts;
  };

  async getCartById(id) {
    return await cartsModel.findOne({ _id: id }).populate("products.product");
  };
 
  async getOneBy(filtro={}) {
    return await cartsModel.findOne(filtro).lean();
  };
 
  async update(id, carrito){
    return await cartsModel.updateOne({_id:id}, carrito)
  };
  
  async getOneByPopulate(filtro = {}) {
    return await cartsModel.findOne(filtro).populate("products.product").lean();
  };
  
  async deleteCartById(id) {
      return await cartsModel.findByIdAndDelete({[this.ID_FIELD]: id})
  }; 
  
  async decreaseProductQuantity(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const productIndex = cart.products.findIndex(product => product.product == pid);
      
      if (productIndex !== -1) {
        // Si el producto existe en el carrito, disminuir su cantidad
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
          await cart.save();
        } else {
          // Si la cantidad es 1, eliminar el producto del carrito
          cart.products.splice(productIndex, 1);
          await cart.save();
        }
      }
      
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

}

export { CartManager };
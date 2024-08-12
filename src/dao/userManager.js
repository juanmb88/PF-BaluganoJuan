import { usuarioModelo } from "../dao/models/usuarioModelo.js";

export class UsersManager {
    async create(usuario) {
        try {
            const nuevoUsuario = await usuarioModelo.create(usuario);
            return nuevoUsuario.toJSON();
        } catch (error) {
            console.error("Error en UsersManager.create:", error);
            throw new Error('Error al crear el usuario');
        }
    }
    async getAllUsers() {
        try{
            const usuarios = await usuarioModelo.find().lean();
            return usuarios;

        }catch(error){
            console.error("Error en UsersManager.getAllUsers:", error);
        }
    }

    async getBy(filter) {
        try {
            return await usuarioModelo.find(filter).lean();
        } catch (error) {
            console.error("Error en UsersManager.getBy:", error);
        }
    }

    async getByOne(filter){
        try{
            return await usuarioModelo.findOne(filter).lean();
        }catch(error){
            console.error("Error en UsersManager.getByOne:", error);
        }
    }

    async getByPopulate(filter = {}) {
        try {
            return await usuarioModelo.findOne(filter).populate("carrito").lean();
        } catch (error) {
            console.error("Error en UsersManager.getByPopulate:", error);
            throw new Error('Error al buscar el usuario con carrito');
        }
    }

    async update(id, updateData) {
        try {
            return await usuarioModelo.findByIdAndUpdate(id, updateData, {
                runValidators: true,
                returnDocument: "after"
            }).lean();
        } catch (error) {
            console.error("Error en UsersManager.update:", error);
            throw new Error('Error al actualizar el usuario');
        }
    }

    async updateRol(id, nuevoRol) {
        return this.update(id, { role: nuevoRol });
    }
}

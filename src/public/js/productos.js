//En este archivo se encuentra la logica manejada desde el front-end
//LOGICA BOTONES DE AGREGAR PRODUCTO A CARRITO 
const comprar = async (pid)=>{
    let inputCarrito = document.getElementById("inputCarrito");
    let cid = inputCarrito.value;
    
    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`,{
        method:"post"
    });
    
    if (respuesta.status === 200) {
        let datos = await respuesta.json()
        console.log(datos)
        alert("Producto agregado...!!!")
    }
};
//LOGICA MENSAJE DE BIENVENIDA
const mensajeBienvenida = document.getElementById('mensajeBienvenida');
if (mensajeBienvenida) {
    setTimeout(() => {
        mensajeBienvenida.remove(); 
    }, 2000); 
}

//LOGICA DE ELIMINAR PRODUCTO DEL CARRITO
const eliminar = async (cid, pid) => {
    try {
        console.log(`Carrito ID: ${cid}, Producto ID: ${pid}`); // Verifica si esta línea se imprime en la consola del navegador

        let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "DELETE"
        });

        if (respuesta.status === 200) {
            let datos = await respuesta.json();
            console.log(datos);
            alert("Producto eliminado con éxito.");
            // Actualiza la vista del carrito
            window.location.reload();
        } else {
            console.error("Error al eliminar el producto:", respuesta.status, respuesta.statusText);
            alert(`Hubo un error al eliminar el producto: ${respuesta.status} ${respuesta.statusText}`);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        alert(`Hubo un error al procesar la solicitud: ${error.message}`);
    }
};


//LOGICA DE CERRAR SESION 
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Si el usuario confirma el cierre de sesión
        fetch('http://localhost:8080/api/sessions/logout', {
            method: 'POST', 
        })
        .then(response => {
            window.location.href = '/login'; //
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
        });
    } 
});

//LOGICA DE FINALIZAR COMPRA
/*   const finalizarCompra = async (cid)=>{
    let inputCarrito = document.getElementById("inputCarrito");
    let cid = inputCarrito.value;
    console.log( "asdasdsdasd",cid)

    let respuesta = await fetch(`/api/carts/${cid}/purchase`,{
        method:"POST"
    });
    
    if (respuesta.status === 200) {
        let datos = await respuesta.json()
        console.log(datos)
        alert("Producto agregado...!!!")
    }
};  
 */

const finalizarCompra = async () => {
    console.log("finalizarCompra function called"); // Agrega este mensaje para depuración

    let inputCarrito = document.getElementById("inputCarrito");
    if (!inputCarrito) {
        console.error("inputCarrito no encontrado"); // Agrega este mensaje
        alert("No se pudo encontrar el inputCarrito.");
        return;
    }

    let cid = inputCarrito.value;
    console.log("Carrito ID:", cid);

    if (!cid) {
        alert("No se pudo obtener el ID del carrito.");
        return;
    }

    try {
        let respuesta = await fetch(`/api/carts/${cid}/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Asegúrate de establecer los encabezados apropiados
            }
        });

        if (respuesta.ok) {
            let datos = await respuesta.json();
            console.log(datos);
            alert("Compra finalizada exitosamente!");
            // Redirigir o actualizar la página después de la compra
            window.location.href = "/"; // Redirige a la página principal, por ejemplo
        } else {
            console.error("Error en la respuesta:", respuesta.statusText);
            alert("Error al finalizar la compra. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        alert("Error inesperado al finalizar la compra. Inténtalo de nuevo.");
    }
};




























/* const restar = async (cid, pid, quantity) => {
    console.log(cid)
    console.log(pid)
    console.log(quantity)
    if (quantity == 1) {
        console.log("no se puede restar a 1")
        return
    }

    let data = {
        cantidad: -1
    }
    //Al hacer fetch tengo que configurar tambien los headers y el contenido que va a viajar en el body
    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });    

    if(respuesta.ok) {
        console.log("cantidad actualizada")
        //Extraigo solo el json que devuelve mi api, que en este caso es la cantidad (sino me devuelve un choclo de cosas)
        let resultado = await respuesta.json()
        console.log(resultado)
        let listQuantity = document.getElementById(`cartQuantity-${cid}-${pid}`)
        listQuantity.innerHTML = `<li id="cartQuantity-${cid}-${pid}">Cantidad: ${resultado} <button id="cartButtonRestar" onclick="restar('${cid}', '${pid}', '${resultado}')">-</button> <button id="cartButtonSumar" onclick="sumar('${cid}', '${pid}')">+</button> </li>`        
    } else {
        console.log("error al actualizar cantidad")
    }
    
}

const sumar = async (cid, pid) => {
    console.log(cid)
    console.log(pid)

    let data = {
        cantidad: 1
    }
    //Al hacer fetch tengo que configurar tambien los headers y el contenido que va a viajar en el body
    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });    

    if(respuesta.ok) {
        console.log("cantidad actualizada")
        //Extraigo solo el json que devuelve mi api, que en este caso es la cantidad (sino me devuelve un choclo de cosas)
        let resultado = await respuesta.json()
        console.log(resultado)
        let listQuantity = document.getElementById(`cartQuantity-${cid}-${pid}`)
        listQuantity.innerHTML = `<li id="cartQuantity-${cid}-${pid}">Cantidad: ${resultado} <button id="cartButtonRestar" onclick="restar('${cid}', '${pid}', '${resultado}')">-</button> <button id="cartButtonSumar" onclick="sumar('${cid}', '${pid}')">+</button> </li>`        
    } else {
        console.log("error al actualizar cantidad")
    }
}

const vaciarCarrito = async (cid) => {
    let respuesta = await fetch(`/api/carts/${cid}`, {method: "delete"})
    if (respuesta.ok) {
        const carrito = document.getElementById("cartUl")        
        carrito.innerHTML = ""
    }
}
 */

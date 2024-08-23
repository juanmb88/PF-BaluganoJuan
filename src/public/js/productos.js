//LOGICA BOTONES DE AGREGAR PRODUCTO A CARRITO 
const comprar = async (pid)=>{
    let inputCarrito = document.getElementById("inputCarrito");
    let cid = inputCarrito.value;
    
    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`,{
        method:"post"
    });
    let datos = await respuesta.json();

    if (respuesta.status === 200) {
        console.log(datos);
        alert("Producto agregado al carrito con éxito.");
    } else if (respuesta.status === 400 && datos.error.includes("stock")) {
        alert(`No se pudo agregar el producto al carrito: ${datos.error}`);
    } else {
        console.error("Error al agregar el producto al carrito:", datos);
        alert(`Hubo un error al agregar el producto al carrito: ${datos.error}`);
    }
};


const eliminar = async ( pid) => {
    try {
        let inputCarrito = document.getElementById("inputCarrito");
        let cid = inputCarrito.value;
       

         if (!cid || !pid) {
            console.error("CID o PID están vacíos o indefinidos:", { cid, pid });
            alert("Error: No se pudo obtener el ID del carrito o del producto.");
            return;
        } 

        console.log(`Intentando eliminar el producto con PID: ${pid} del carrito con CID: ${cid}`);

        // Construir la URL y hacer una depuración de la URL generada
        const url = `/api/carts/${cid}/products/${pid}`;
        console.log("URL construida:", url);

        let respuesta = await fetch(url, {
            method: "DELETE"
        });

        console.log(`Respuesta recibida:`, respuesta);

        if (respuesta.status === 200) {
            let datos = await respuesta.json(); // Esto lanzará un error si la respuesta no es JSON válido
            console.log("Datos de respuesta:", datos);
            alert("Producto eliminado con éxito.");
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

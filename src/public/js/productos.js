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

        const url = `/api/carts/${cid}/products/${pid}`;
        console.log("URL construida:", url);

        let respuesta = await fetch(url, {
            method: "DELETE"
        });

        console.log(`Respuesta recibida:`, respuesta);

        if (respuesta.status === 200) {
            let datos = await respuesta.json(); 
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

const finalizarCompra = async () => {
    console.log("finalizarCompra function called");

    let inputCarrito = document.getElementById("inputCarrito");
    if (!inputCarrito) {
        console.error("inputCarrito no encontrado"); 
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
                "Content-Type": "application/json" 
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

//LOGICA DE CERRAR SESION 
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
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



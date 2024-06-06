//En este archivo se encuentra la logica manejada  desde el front-end
//LOGICA BOTONES DE AGREGAR PRODUCTO A CARRITO 
const comprar = async (pid)=>{
    let inputCarrito = document.getElementById("inputCarrito");
    let cid = inputCarrito.value;
   // console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`);

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
    }, 4000); 
}

//LOGICA DE ELIMINAR PRODUCTO DEL CARRITO
const eliminar = async (pid)=>{
    let inputCarrito = document.getElementById("inputCarrito");
    let cid = inputCarrito.value;
   // console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`);

    let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`,{
        method:"delete"
    });
    console.log(pid)
    console.log(cid)
    if (respuesta.status === 200) {
        let datos = await respuesta.json()
        console.log(datos)
        alert("Producto eliminado con exito.")
    }
};

//LOGICA DE CERRAR SESION 
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Si el usuario confirma el cierre de sesión
        fetch('http://localhost:8080/api/sessions/logout', {
            method: 'POST', // o 'GET' dependiendo del método que uses
        })
        .then(response => {
            window.location.href = '/login'; //
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
        });
    } 
});
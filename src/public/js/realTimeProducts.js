const socketClient = io();
socketClient.on("sendProducts", (object)=>{
    updateProductsList(object);

});

function updateProductsList(productList){
const productsDiv = document.getElementById("list-products");
let productsHTML = "";

productList.forEach( product => {
    productsHTML += `   <div class="border border-dark card h-80 mx-4 my-1" style="max-width:18rem">
    
                           <div class="card-body bg-success border border-dark">
                              <i class="bi bi-tag  fw-normal fw-bold">ID Producto:</i> ${product._id}
                           </div>


                            <div class="card-body bg-light border border-dark">

                                <h5 class="card-title px-4 text-dark fw-bold">${product.title}</h5>

                                <ul class="card-text">
                                    <li class="fw-normal"><i class="fw-bold ">  Descripcion: </i>${product.description}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Precio: </i>$${product.price}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Categoria: </i>${product.category}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Estado: </i>${product.status}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Codigo: </i> ${product.code}</li>
                                    <li class="fw-normal"><i class="fw-bold ">  Stock: </i>${product.stock}</li> 
                                    <i class="fw-bold ">  </i> <img src="${product.thumbnail}" 
                                                                    class="rounded mx-auto d-block" 
                                                                    style="width: 200px; height: 200px; border-radius: 5px; ">     
                                </ul>

                            </div>
                        </div>
                 `
                });

    productsDiv.innerHTML = productsHTML;
};


let form = document.getElementById("formProduct");
    form.addEventListener("submit", (e) => {
    e.preventDefault();

        let title = form.elements.title.value;
        let description = form.elements.description.value;
        let stock = form.elements.stock.value;
        let thumbnail = form.elements.thumbnail.value;
        let category = form.elements.category.value;
        let price = form.elements.price.value;
        let code = form.elements.code.value;
        let status= form.elements.status.checked;

        socketClient.emit("addProduct", {
            title,
            description,
            stock,
            thumbnail,
            category,
            price,
            code,
            status
        });

    form.reset();
});


document.getElementById("delete-id-btn").addEventListener('click', function(){
    const inputTheId = document.getElementById("id-prod");//esto viene del form en realTimePrioducts.handlebars
   const deleteId = (inputTheId.value).toString();
   socketClient.emit("deleteProduct", deleteId);
   inputTheId.value = ""; 
});


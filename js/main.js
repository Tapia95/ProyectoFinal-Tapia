
let products = [];


fetch("./js/products.json")
    .then(response => response.json())
    .then(data => {
        products = data;
        loadProducts(products);
    })
    .catch(error => console.log('Hubo un error:' +error.message))

const producstContainer = document.querySelector("#products-container");
const btnCategories = document.querySelectorAll(".btn-category");
const principalTitle = document.querySelector("#principal-title");
let btnsAdd = document.querySelectorAll("btn-add");
const cartNum = document.querySelector("#cart-num");





function loadProducts(selectedProducts) {

    producstContainer.innerHTML = ""; 
    selectedProducts.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img class="img-product" src="${product.img}" alt="${product.title}">
                <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price}</p>
                <button class="product-add" id=${product.id} >Agregar</button>
            </div>
            `;
            
        producstContainer.append(div);
        
    })

    updateBtnAdd();

}

loadProducts(products);

btnCategories.forEach(btn => {
    btn.addEventListener("click",(e) =>{
        const div1 = document.querySelector(".cart-container");
        const div2 = document.querySelector(".products-container");
        btnCategories.forEach(btn => btn.classList.remove("active"));
        e.currentTarget.classList.add("active");
        
        if (e.currentTarget.id != "todos" && e.currentTarget.id != "carrito"){
            div1.classList.add("disabled");
            div2.classList.remove("disabled");
            const productCategory = products.find(product => product.category.id === e.currentTarget.id);
            principalTitle.innerText = productCategory.category.name;
            const productsBtn = products.filter(product => product.category.id === e.currentTarget.id);
            loadProducts(productsBtn);
        }else if(e.currentTarget.id == "carrito"){
            principalTitle.innerText = "Carrito";
            div1.classList.remove("disabled");
            div2.classList.add("disabled");
            loadCart();   
        }else{
            div1.classList.add("disabled");
            div2.classList.remove("disabled");
            principalTitle.innerText = "Todos los Productos";
            loadProducts(products);
        }
      
    
    })
});

function updateBtnAdd(){
    btnsAdd = document.querySelectorAll(".product-add");
    btnsAdd.forEach(btn => {
        btn.addEventListener("click", addToCart);
    });
}

let productsInCart;


function updateCartNumber(){
    let newCartNum = productsInCart.reduce((i,product) => i+product.quantity,0);
    cartNum.innerText = newCartNum; 
}

function updateLS(){
    let productsInCartLS = localStorage.getItem("products-in-cart");
    if(productsInCartLS){
        productsInCart =  JSON.parse(productsInCartLS);
        updateCartNumber();
        }else{
            productsInCart = [];
    }
}

updateLS();

function addToCart(e){
    const idBtn = e.currentTarget.id;
    const addedProduct = products.find(product => product.id === idBtn);
    Toastify({
        text: "Producto Agregado",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #961818, #e97304)",
          borderRadius:".5rem",
        },
        offset: {
            x: "2rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    if(productsInCart.some(product => product.id === idBtn)){
        const index = productsInCart.findIndex(product => product.id === idBtn);
        productsInCart[index].quantity++;
    }else{
        addedProduct.quantity = 1;
        productsInCart.push(addedProduct);
    }

    updateCartNumber();

    localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));
}



// let productsInCart = localStorage.getItem("products-in-cart");
// productsInCart = JSON.parse(productsInCart);

// const emptyCart = document.querySelector("#empty-cart");
// const cartProductsContainer = document.querySelector("#cart-products");
// const cartActions = document.querySelector("#cart-actions");
// const boughtCart = document.querySelector("#cart-bought");
// let deleteBtn = document.querySelectorAll(".cart-product-remove");
// const clearBtn = document.querySelector("#cart-actions-clear");
// const totalContainer = document.querySelector("total");
// const btnBuy = document.querySelector("#cart-actions-buy") 

// function loadCart(){
//     if(productsInCart && productsInCart.length > 0){
//         emptyCart.classList.add("disabled");
//         cartProductsContainer.classList.remove("disabled");
//         cartActions.classList.remove("disabled");
//         boughtCart.classList.add("disabled");
//         cartProductsContainer.innerHTML = "";
//         loadProductsToCart();
        
//     }else{
//         emptyCart.classList.remove("disabled");
//         cartProductsContainer.classList.add("disabled");
//         cartActions.classList.add("disabled");
//         boughtCart.classList.add("disabled");

//     }
//     updateDeleteBtn();
//     updateTotal();
// }

// function loadProductsToCart(){
//     productsInCart.forEach(product => {
//         const div = document.createElement("div");
//         div.classList.add("cart-product");
//         div.innerHTML = `
//             <img class="cart-product-img" src=".${product.img}" alt="${product.title}">
//             <div class="cart-product-name">
//                 <small>Titulo</small>
//                 <h3>${product.title}</h3>
//             </div>
//             <div class="cart-product-quantity">
//                 <small>Cantidad</small>
//                 <p>${product.quantity}</p>
//             </div>
//             <div class="cart-product-price">
//                 <small>Precio</small>
//                 <p>${product.price}</p>
//             </div>
//             <div class="cart-product-subtotal">
//                 <small>Subtotal</small>
//                 <p>${product.price * product.quantity}</p>
//             </div>
//             <button id="${product.id}" class="cart-product-remove"><i class="bi bi-trash3-fill"></i></button>`;

//             cartProductsContainer.append(div);
//     })

// }



// function updateDeleteBtn(){
//     deleteBtn = document.querySelectorAll(".cart-product-remove");
//     deleteBtn.forEach(btn => {
//         btn.addEventListener("click", removeFromCart);
//     });
// }

// function removeFromCart(e){
//     const idBtn = e.currentTarget.id;
//     const index = productsInCart.findIndex(product => product.id === idBtn);
//     productsInCart.splice(index,1);
//     Toastify({
//         text: "Producto Eliminado",
//         duration: 3000,
//         destination: "https://github.com/apvarun/toastify-js",
//         newWindow: true,
//         close: true,
//         gravity: "top", // `top` or `bottom`
//         position: "right", // `left`, `center` or `right`
//         stopOnFocus: true, // Prevents dismissing of toast on hover
//         style: {
//           background: "linear-gradient(to right, #961818, #e97304)",
//           borderRadius:".5rem",
//         },
//         offset: {
//             x: "2rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
//             y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
//           },
//         onClick: function(){} // Callback after click
//       }).showToast();
//     loadCart();
//     localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));
// }

// function clearCart (){

//     Swal.fire({
//         title: 'Se vaciara el carrito',
//         text: 'Estas seguro?',
//         icon: 'warning',
//         showCloseButton: true,
//         showCancelButton: true,
//         focusConfirm: false,
//         confirmButtonText:
//             'Si, vacialo!',
//         cancelButtonText:
//             'No.',
//         confirmButtonColor: '#e97304',
//         cancelButtonColor:'#961818',
//     }).then((result) => {
//         if (result.isConfirmed) {
//             productsInCart.length = 0;
//             localStorage.setItem("products-in-cart",JSON.stringify(productsInCart));
//             loadCart();
//         }
//     })

// }

// clearBtn.addEventListener("click", clearCart)

// function updateTotal(){
//     const calculatedTotal = productsInCart.reduce((i,product)=>i+(product.price*product.quantity),0); 
//     total.innerText = `$${calculatedTotal}`; 
// }

// function buyCart (){

//     productsInCart.length = 0;
//     localStorage.setItem("products-in-cart",JSON.stringify(productsInCart));
//     emptyCart.classList.add("disabled");
//     cartProductsContainer.classList.add("disabled");
//     cartActions.classList.add("disabled");
//     boughtCart.classList.remove("disabled");

// }

// btnBuy.addEventListener("click", buyCart)

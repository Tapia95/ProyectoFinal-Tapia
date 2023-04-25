class TotalCarrito {
    constructor(total){
        this.total=total;
    }

    getTotal(){
        return this.total;
    }

    getCuotas(n){
        if(n===3){
            let result = (this.total*1.10)/3;
            return result.toFixed(2);
        }
        if(n===6){
            let result =(this.total*1.20)/6;
            return result.toFixed(2);
        }
        if(n===12){
            let result = (this.total*1.35)/12;
            return result.toFixed(2);
        }
    }

    getTotalCuotas(n){
        return this.getCuotas(n)*n;
    }

}


let cartProducts;

function updatecartLS(){
    let cartProductsLS= localStorage.getItem("products-in-cart");
    if(cartProductsLS){
        cartProducts = JSON.parse(cartProductsLS);
    }else{
        cartProducts = [];
    }

}

const emptyCart = document.querySelector("#empty-cart");
const cartProductsContainer = document.querySelector("#cart-products");
const cartActions = document.querySelector("#cart-actions");
const boughtCart = document.querySelector("#cart-bought");
let deleteBtn = document.querySelectorAll(".cart-product-remove");
const clearBtn = document.querySelector("#cart-actions-clear");
const totalContainer = document.querySelector("total");
const btnBuy = document.querySelector("#cart-actions-buy") 


function loadProductsToCart(){
    cartProducts.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("cart-product");
        div.innerHTML = `
            <img class="cart-product-img" src="${product.img}" alt="${product.title}">
            <div class="cart-product-name">
                <small>Titulo</small>
                <h3>${product.title}</h3>
            </div>
            <div class="cart-product-quantity">
                <small>Cantidad</small>
                <p>${product.quantity}</p>
            </div>
            <div class="cart-product-price">
                <small>Precio</small>
                <p>${product.price}</p>
            </div>
            <div class="cart-product-subtotal">
                <small>Subtotal</small>
                <p>${product.price * product.quantity}</p>
            </div>
            <button id="${product.id}" class="cart-product-remove"><i class="bi bi-trash3-fill"></i></button>`;

            cartProductsContainer.append(div);
    })

}


function loadCart(){
    updatecartLS();
    if(cartProducts && cartProducts.length > 0){
        emptyCart.classList.add("disabled");
        cartProductsContainer.classList.remove("disabled");
        cartActions.classList.remove("disabled");
        boughtCart.classList.add("disabled");
        cartProductsContainer.innerHTML = "";
        loadProductsToCart();
        cuotas.value = 1;
        
    }else{
        emptyCart.classList.remove("disabled");
        cartProductsContainer.classList.add("disabled");
        cartActions.classList.add("disabled");
        boughtCart.classList.add("disabled");
        cuotas.value = 1;

    }
    updateDeleteBtn();
    updateTotal(1);
}



function updateDeleteBtn(){
    deleteBtn = document.querySelectorAll(".cart-product-remove");
    deleteBtn.forEach(btn => {
        btn.addEventListener("click", removeFromCart);
    });
}

function removeFromCart(e){
    const idBtn = e.currentTarget.id;
    const index = cartProducts.findIndex(product => product.id === idBtn);
    cartProducts.splice(index,1);
    Toastify({
        text: "Producto Eliminado",
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
    localStorage.setItem("products-in-cart", JSON.stringify(cartProducts));
    loadCart();
    updateLS();
    
}

function clearCart (){

    Swal.fire({
        title: 'Se vaciara el carrito',
        text: 'Estas seguro?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Si, vacialo!',
        cancelButtonText:
            'No.',
        confirmButtonColor: '#e97304',
        cancelButtonColor:'#961818',
    }).then((result) => {
        if (result.isConfirmed) {
            cartProducts.length = 0;
            localStorage.setItem("products-in-cart",JSON.stringify(cartProducts));
            updateLS();
            loadCart();
            cuotas.value = 1;
        }
    })

}

clearBtn.addEventListener("click", clearCart)

function updateTotal(cuotas){
        const calculatedTotal = new TotalCarrito(cartProducts.reduce((i,product)=>i+(product.price*product.quantity),0));
    if(cuotas == 1){ 
        total.innerText = `$${calculatedTotal.getTotal()}`;
        cuota.innerText = `$${calculatedTotal.getTotal()}`; 
    }
    if(cuotas == 3){
        total.innerText = `$${calculatedTotal.getTotalCuotas(3)}`;
        cuota.innerText = `$${calculatedTotal.getCuotas(3)}`;
    }
    if(cuotas == 6){
        total.innerText = `$${calculatedTotal.getTotalCuotas(6)}`;
        cuota.innerText = `$${calculatedTotal.getCuotas(6)}`;
    }
    if(cuotas == 12){
        total.innerText = `$${calculatedTotal.getTotalCuotas(12)}`;
        cuota.innerText = `$${calculatedTotal.getCuotas(12)}`;
    }
}

const cuotas = document.querySelector('#cuotas');

cuotas.addEventListener('change',(e)=>{
    updateTotal(e.currentTarget.value);
});

function buyCart (){

    cartProducts.length = 0;
    localStorage.setItem("products-in-cart",JSON.stringify(cartProducts));
    updateLS();
    emptyCart.classList.add("disabled");
    cartProductsContainer.classList.add("disabled");
    cartActions.classList.add("disabled");
    boughtCart.classList.remove("disabled");
    cuotas.value = 1;
    

}

btnBuy.addEventListener("click", buyCart)


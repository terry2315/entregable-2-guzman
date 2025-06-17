//Variables 
//Modal carrito
const openModalCarrito = document.querySelector(".navbar__shopping--logo");
const closeModalCarrito = document.querySelector(".modal__btn--close");
const ModalCarrito = document.querySelector(".modal__carrito");
const cartCount = document.querySelector("#navbar__shopping--ammount");
const emptyCart = document.querySelector("#carrito__footer--empty");


//menu
const listProducts = document.querySelector("#menu__items");
const contentProducts = document.querySelector("#carrito__menu--list");
let productsArray = [];


//Evenlistener
cargarMenu();
cargarEventListener();
function cargarEventListener() {

    openModalCarrito.addEventListener("click", (e) => {
        e.preventDefault()
        ModalCarrito.classList.add("modal__carrito--show");
    });

    closeModalCarrito.addEventListener("click", (e) => {
        e.preventDefault()
        ModalCarrito.classList.remove("modal__carrito--show");
    });

    listProducts.addEventListener("click",getDataElements);

    emptyCart.addEventListener("click", function() {
        productsArray = [];
        productsHTML();
        updateCartCount();
        updateTotal();
    });


    const loadProduct = localStorage.getItem("products");
    if (loadProduct) {
        productsArray = JSON.parse(loadProduct);
        productsHTML();
        updateCartCount();
    } else {
        productsArray = [];
    }

}

//Funciones
//Menu
function cargarMenu() {
    products.forEach(product => {
        const article = document.createElement("article");
        article.classList.add("item");
        const {img_url, title, model, fabricator, price, id} = product;
        article.innerHTML = `
            <div class="item__content--img">
                <img class="item__img" src="${img_url}" alt="${title}">
            </div>
            <div class="item__content">
                <h2 class="item__titulo">${title}</h2>
            </div>
            <div class="content__description">
                <ul class="item__list--description">
                    <li class="list__description--left">Marca:</li>
                    <li class="list__description--left">Modelo:</li>
                    <li class="list__description--left">Fabricante:</li>
                    <li class="list__description--left">Precio:</li>
                </ul>
                <ul class="item__list--description">
                    <li class="list__description--right">${title}</li>
                    <li class="list__description--right">${model}</li>
                    <li class="list__description--right">${fabricator}</li>
                    <li id="current__price" class="list__description--right">$ ${price}</li>
                </ul>
            </div>

            <div class="item__content--btn">
                <button data-id="${id}" class="btn__add">Añadir al carrito</button>
            </div>
        `;
        listProducts.appendChild(article);
    });
}

//Añadir item al carrito de compras
function getDataElements(e) {
    if (e.target.classList.contains("btn__add")) {
        const elementHTML = (e.target.parentElement.parentElement);
        selectData(elementHTML);
    }
}

//Contando incremento del carrito
function updateCartCount() {
    cartCount.textContent = productsArray.length;
}

function updateTotal() {
    const total = document.querySelector("#carrito__footer--total");
    let totalProduct = productsArray.reduce((total, prod) => total + prod.price * prod.quantity, 0);
    total.textContent = `$${totalProduct}`;
}

function selectData(prod) {
    const productObj = {
        img: prod.querySelector("img").src,
        tittle: prod.querySelector("h2").textContent,
        price: parseInt(prod.querySelector("#current__price").textContent.replace("$","")),
        id: parseInt(prod.querySelector("button").getAttribute("data-id")),
        quantity: 1
    }

    const exists = productsArray.some(prod => prod.id === productObj.id);
    if (exists) {
        showAlert("El producto ya existe en el carrito", "error");
        return;
    }
    
    productsArray = [...productsArray, productObj];
    showAlert("El producto ha sido agregado al carrito", "success");
    productsHTML();
    updateCartCount();
    updateTotal();
}

//Creando HTML
function productsHTML() {

    cleanHTML();
      
    productsArray.forEach(prod => {
        const {img, tittle, price, quantity, id } = prod;
        const li = document.createElement("li");
        li.classList.add("carrito__menu--item");

        //Crear imagen
        const divImg = document.createElement("div");
        divImg.classList.add("carrito__content");
        const prodImg = document.createElement("img");
        prodImg.classList.add("carrito__img");
        prodImg.src = img;
        prodImg.alt = tittle;
        divImg.appendChild(prodImg);

        //Crear titulo
        const divTittle = document.createElement("div");
        divTittle.classList.add("carrito__content");
        const prodTittle = document.createElement("h3");
        prodTittle.classList.add("carrito__tittle");
        prodTittle.textContent = tittle;
        divTittle.appendChild(prodTittle);

        //Crear precio
        const divPrice = document.createElement("div");
        divPrice.classList.add("carrito__content");
        const prodPrice = document.createElement("p");
        prodPrice.classList.add("carrito__price");
        const newPrice = price * quantity;
        prodPrice.textContent = `$${newPrice}`;

        divPrice.appendChild(prodPrice);

        //Crear cantidad
        const divQuantity = document.createElement("div");
        divQuantity.classList.add("carrito__content");
        const prodQuantity = document.createElement("input");
        prodQuantity.classList.add("carrito__input--number");
        prodQuantity.type = "number";
        prodQuantity.min = "1";
        prodQuantity.textContent = "1";
        prodQuantity.value = quantity;
        prodQuantity.dataset.id = id;
        prodQuantity.oninput = updateQuantity;
        divQuantity.appendChild(prodQuantity);

        //Crear boton para eliminar
        const divDelete = document.createElement("div");
        divDelete.classList.add("carrito__content");
        const prodDelete = document.createElement("button");
        prodDelete.classList.add("carrito__btn--delete");
        prodDelete.type = "button";
        prodDelete.textContent = " X ";
        prodDelete.onclick = () => destroyPoduct(id);
        divDelete.appendChild(prodDelete);

        li.append(divImg, divTittle, divPrice, divQuantity, divDelete);

        contentProducts.appendChild(li);
    });

    saveLocalStorage();

}

//Almacenamiento local
function saveLocalStorage() {

    localStorage.setItem("products", JSON.stringify(productsArray));

}

function updateQuantity(e) {

    const newQuantity = parseInt(e.target.value, 10);
    const idProd = parseInt(e.target.dataset.id, 10);
    
    const product = productsArray.find(prod => prod.id === idProd);
    if (product && newQuantity > 0) {
        product.quantity = newQuantity;
    }
    productsHTML();
    updateTotal();  
    saveLocalStorage();

}

function destroyPoduct(idProd) {
    productsArray = productsArray.filter(prod => prod.id !== idProd);
    showAlert("El producto ha sido eliminado", "success");
    productsHTML();
    updateCartCount();
    updateTotal();
    saveLocalStorage();
}

//Limpiar HTML 
function cleanHTML() {

    while (contentProducts.firstChild) {
        contentProducts.removeChild(contentProducts.firstChild)
    }

}

//Mostrar alerta 
function showAlert(message, type) {

    const noRepeatAlert = document.querySelector(".alert");
    if (noRepeatAlert) noRepeatAlert.remove();

    const div = document.createElement("div");
    div.classList.add("alert", type);
    div.textContent = message;

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 2500);
}






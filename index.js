//Variables

//Formulario
let loginForm = document.querySelector(".user__login");
let inputName = document.querySelector("#name");
let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#pass");
let userData = document.querySelector(".user__data");
let loginName = document.querySelector(".data__name");
let dataLogout = document.querySelector(".data__logout");

//Carrito
const menu = document.querySelector("#menu__items");
const contentProducts = document.querySelector("#carrito__menu--list")
let productsArray = [];

//Modal carrito
const abrirCarrito = document.querySelector(".navbar__shopping--logo");
const cerrarCarrito = document.querySelector(".modal__btn--close");
const modal = document.querySelector(".modal__carrito");

let getUser = () => {
    let myUser = localStorage.getItem("user");
    if (myUser) {
        let identity = JSON.parse(myUser);
        loginName.innerHTML = identity.name;
        loginForm.classList.add("user__login--hide");
        userData.classList.remove("user__data--hide");
    }

    ;
    if (myUser) return cargarMenu();
}


cargarEventListener();

//Funciones

function cargarEventListener() {

    //Usuario
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        //Recoger los valores del formulario
        let name = inputName.value;
        let email = inputEmail.value;
        let password = inputPassword.value;

        //Comprovar que todo los campos han sido rellenados
        let user = {}
        if (name && email && password) {
            //Guardar los datos de un objedo
            user = { name, email, password };

            //Guardar en el local storage
            localStorage.setItem("user", JSON.stringify(user));

            //Vaciar formulario
            loginForm.reset();
            getUser();
        }
    });

    //Modal carrito
    abrirCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("modal__carrito--show");
    });

    cerrarCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("modal__carrito--show");
    });

    //Carrito
    menu.addEventListener("click", getDataElements);

}



//Cargar Menu

function cargarMenu() {
    productos.forEach(producto => {
        const article = document.createElement("article");
        article.classList.add("item");
        article.innerHTML = `
            <div class="item__content--img">
                <img class="item__img" src="${producto.img_url}" alt="${producto.title}">
            </div>
            <div class="item__content">
                <h2 class="item__titulo">${producto.title}</h2>
            </div>
            <div class="content__description">
                <ul class="item__list--description">
                    <li class="list__description--left">Marca:</li>
                    <li class="list__description--left">Modelo:</li>
                    <li class="list__description--left">Fabricante:</li>
                    <li class="list__description--left">Precio:</li>
                </ul>
                <ul class="item__list--description">
                    <li class="list__description--right">${producto.title}</li>
                    <li class="list__description--right">${producto.brand}</li>
                    <li class="list__description--right">${producto.fabricator}</li>
                    <li id="current__price" class="list__description--right">$ ${producto.price}</li>
                </ul>
            </div>

            <div class="item__content--btn">
                <button data-id="${producto.id}" class="btn__add">Añadir al carrito</button>
            </div>
        `;
        menu.appendChild(article);
    });
}

//Carrito

function getDataElements(e) {
    if (e.target.classList.contains("btn__add")) {
        const elementHTML = e.target.parentElement.parentElement;
        selectData(elementHTML);
    }
}

function selectData(prod) {
    const productObj = {
        img: prod.querySelector("img").src,
        tittle: prod.querySelector("h2").textContent,
        price: parseInt(prod.querySelector("#current__price").textContent.replace("$", "")),
        id: parseInt(prod.querySelector("button").getAttribute("data-id")),
        quantity: 1,
    }
    productsArray = [...productsArray, productObj];
    productsHTML();
}

function productsHTML() {

    cleanHTML();

    productsArray.forEach(prod => {
        const { img, tittle, price, queantity, id } = prod
        const li = document.createElement("li");
        li.classList.add("carrito__menu--item");


        //Crean imagen
        const divImg = document.createElement("div");
        divImg.classList.add("carrito__content");
        const prodImg = document.createElement("img");
        prodImg.classList.add("carrito__img");
        prodImg.src = img;
        prodImg.alt = tittle
        divImg.appendChild(prodImg);

        //Creando titulo
        const divTitle = document.createElement("div");
        divTitle.classList.add("carrito__content");
        const prodTitle = document.createElement("h3");
        prodTitle.classList.add("carrito__tittle");
        prodTitle.textContent = tittle;
        divTitle.appendChild(prodTitle);

        //Creando precio
        const divPrice = document.createElement("div");
        divPrice.classList.add("carrito__content");
        const prodPrice = document.createElement("p");
        prodPrice.classList.add("carrito__price");
        prodPrice.textContent = `$${price}`
        divPrice.appendChild(prodPrice);

        //Creando cantidad
        const divQuantity = document.createElement("div");
        divQuantity.classList.add("carrito__content")
        const prodQuantity = document.createElement("input");
        prodQuantity.classList.add("carrito__input--number");
        prodQuantity.type = "number";
        prodQuantity.min = "1";
        prodQuantity.textContent = "1"
        prodQuantity.value = queantity;
        prodQuantity.dataset.id = id;
        divQuantity.appendChild(prodQuantity);

        //Creando boton para eliminar 
        const divDelete = document.createElement("div");
        divDelete.classList.add("carrito__content");
        const prodDelete = document.createElement("button");
        prodDelete.classList.add("carrito__btn--delete");
        prodDelete.type = "button"
        prodDelete.textContent = " X "
        divDelete.appendChild(prodDelete);

        li.append(divImg, divTitle, divPrice, divQuantity, divDelete);

        contentProducts.appendChild(li);
    });

    //Local storage en carrito de compras

    synchronizeStorage();

}

function synchronizeStorage() {
    localStorage.setItem("carrito", JSON.stringify(productsArray));
}

function cleanHTML() {
    contentProducts.innerHTML = "";
}

//mostrar usuario
getUser();

//Logout
dataLogout.addEventListener("click", (e) => {
    localStorage.clear();
    loginForm.classList.remove("user__login--hide");
    userData.classList.add("user__data--hide");
});





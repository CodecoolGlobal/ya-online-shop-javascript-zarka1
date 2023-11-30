const rootElement = document.getElementById('root');
let shoppingBasket = {};
let products = [];

function createMyElement(type, elementClass, id, content, parent){
    const element = document.createElement(type);
    parent.appendChild(element);
    element.textContent = content;
    element.classList.add(elementClass);
    element.setAttribute('id', id)
    return element;
}

const postShoppingCart = async (shoppingBasket) =>{
    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(shoppingBasket)
    });
    const response = await res.json();
    return response;
}

const createProductDiv = async (product) =>{
    const productContainerList = document.getElementById('product-list-container')
    const productDiv = createMyElement('div', 'productcontainer', product.id, '', productContainerList);
    createMyElement('h4', 'productid', 'id', `ID: ${product.id}`, productDiv);
    createMyElement ('h2', 'producttitle', 'title', `Title: ${product.title}`, productDiv);
    createMyElement('p', 'productprice', 'price', `Price: ${product.price}$ USD`, productDiv);
    createMyElement('button', 'buttonProduct', `button${product.id}`, 'Add to basket', productDiv);
    const pictureHTML = `<img src="/pictures/${product.image}"/>`
    const productDivHTML = document.getElementById(product.id.toString());
    productDivHTML.insertAdjacentHTML('beforeend', pictureHTML);
    createMyElement('p', 'productsize', 'size', `Size: ${product.size}`, productDiv);
    
}

const fetchProducts = async () =>{
    try{
        const response = await fetch('/products');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        products = data.products;
        data.products.map((product)=> createProductDiv(product));
        document.getElementById('product-list-container');
    }
    catch(error){
    console.error(error.message);
    }
}

function displayUsername() {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = JSON.parse(currentUserString);
    if (currentUser) {
        const usernameBox = document.createElement('div');
        usernameBox.classList.add('username-box'); 

        const welcomeMessage = document.createElement('p');
        welcomeMessage.textContent = `Welcome, ${currentUser.name.first}!`;
        usernameBox.appendChild(welcomeMessage);

        const editButton = document.createElement('button');
        editButton.textContent = 'EDIT';
        editButton.setAttribute('id', 'editcurrentuser');
        editButton.addEventListener('click', () => {
            window.location.href = `/register/${currentUser.id}`;
        });
        usernameBox.appendChild(editButton);
        rootElement.appendChild(usernameBox);
    }
}

async function loadEvent() {
    const data = await fetch('http://localhost:8080/products');
    const pictures = await data.json();
    fetchProducts();
    displayUsername();
    window.addEventListener("click", async (e)=> {
        let totalPrice = 0;
        console.log(e.target);

        if (e.target.className === 'buttonProduct') {
            const shoppingCart = document.getElementById('items');
            const elements = document.querySelectorAll('.pDiv');
            for (const element of elements) {
                element.remove();
            }
            const id = e.target.id.split('button')[1];
            if (shoppingBasket.hasOwnProperty(id)){
                shoppingBasket[id] += 1;
            } else shoppingBasket[id] = 1;
            for (const key in shoppingBasket) {
                for (const product of products) {
                    if (product.id === Number(key)) {
                        createMyElement('div', 'pDiv', `div${product.id}`, '',shoppingCart  )
                        const pDiv = document.getElementById(`div${product.id}`);
                        createMyElement('p', 'pProductname', `p1${product.id}`, product.title, pDiv);
                        createMyElement('p', 'pProduct', `p2${product.id}`, `${shoppingBasket[key]}pcs`, pDiv);
                        const deleteButton = document.getElementById(`del${product.id}`);
                        if (!deleteButton) createMyElement('button', 'delete', `del${product.id}`, 'delete', pDiv);
                        /* console.log(product.price) */
                        totalPrice += shoppingBasket[key] * product.price;
                    }
                }
            }
            const allPrice = document.getElementById('allPrice');
            allPrice.innerText = totalPrice + ' $ USD'
        } else if (e.target.id === 'buynow'){
            e.preventDefault();
            const elements = document.querySelectorAll('.pDiv');
            for (const element of elements) {
                element.remove();
            }
            totalPrice = 0; 
            const allPrice = document.getElementById('allPrice');
            allPrice.innerText = totalPrice + ' $ USD'
            const currentUserString = localStorage.getItem('currentUser');
            const currentUser = JSON.parse(currentUserString);
            console.log(currentUser.id);
            shoppingBasket.user = currentUser.id
            const response = await postShoppingCart(shoppingBasket);
            console.log(response);
            shoppingBasket = {};
            window.alert(`Thank you for your purchasing, your order is saved in our system, number is: ${response.orderID}`)
        } else if (e.target.className === 'delete') {
            e.preventDefault();
            const productID = e.target.id.split('del')[1];
            console.log(productID);
            const toDeleteDiv = document.getElementById(`div`+productID)
            console.log(`div${productID}`)
            console.log(toDeleteDiv)
            toDeleteDiv.remove();

            console.log(shoppingBasket)
            delete shoppingBasket[productID];
            for (const key in shoppingBasket) {
                for (const product of products) {
                    if (product.id === Number(key)) {
                        totalPrice += shoppingBasket[key] * product.price;
                    }
                }
            }
            const allPrice = document.getElementById('allPrice');
            allPrice.innerText = totalPrice + ' $ USD'
        }
    })
}

window.addEventListener('load', loadEvent);
const rootElement = document.getElementById('root');

function createMyElement(type, elementClass, id, content, parent){
    const element = document.createElement(type);
    parent.appendChild(element);
    element.textContent = content;
    element.classList.add(elementClass);
    element.setAttribute('id', id)
    return element;
}

function getUserIdFromUrl() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Extract the user ID from the URL
    const urlParts = currentUrl.split('/');
    const userIdFromUrl = parseInt(urlParts[urlParts.length - 1]);

    return userIdFromUrl;
}

const postUser = async (user) =>{
    await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    });
}

const replaceUser = async (userId, user) => {
    await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const createProductDiv = async (product) =>{
    const productContainerList = document.getElementById('product-list-container')
    const productDiv = createMyElement('div', 'productcontainer', product.id, '', productContainerList);
    createMyElement('h4', 'productid', 'id', `ID: ${product.id}`, productDiv);
    createMyElement ('h2', 'producttitle', 'title', `Title: ${product.title}`, productDiv);
    createMyElement('p', 'productprice', 'price', `Price: ${product.price}$ USD`, productDiv);
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
    displayUsername()

}

window.addEventListener('load', loadEvent);
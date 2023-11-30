const rootElement = document.getElementById('root');
let shoppingBasket = {};
let products = [];
let actualProduct;


function createMyElement(type, elementClass, id, content, parent){
    const element = document.createElement(type);
    parent.appendChild(element);
    element.textContent = content;
    element.classList.add(elementClass);
    element.setAttribute('id', id)
    return element;
}

const createProductDiv = async (product) =>{
    const productContainerList = document.getElementById('product-list-container')
    const productDiv = createMyElement('div', 'productcontainer', product.id, '', productContainerList);
    createMyElement('h4', 'productid', 'id', `ID: ${product.id}`, productDiv);
    createMyElement ('h2', 'producttitle', 'title', `Title: ${product.title}`, productDiv);
    createMyElement('p', 'productprice', 'price', `Price: ${product.price}$ USD`, productDiv);
    createMyElement('button', 'buttonEdit', `buttonEdit${product.id}`, 'Edit', productDiv);
    createMyElement('button', 'buttonDelete', `buttonDelete${product.id}`, 'Delete', productDiv);
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
        return products;
    }
    catch(error){
    console.error(error.message);
    }
}

const fetchProductsWithoutPic = async () =>{
    try{
        const response = await fetch('/products');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        products = data.products;
        return products;
    }
    catch(error){
    console.error(error.message);
    }
}

async function fetchData (url, bodyAct, method) {
    if (method === "PUT") {
        await fetch(url, {
        method: "PUT",
        headers: {"Content-type":"application/json"}, 
        body: JSON.stringify(bodyAct),
        });
    } else if (method === "POST") {
      await fetch(url, {
      method: "POST",
      headers: {"Content-type":"application/json"}, 
      body: JSON.stringify(bodyAct),
      });
    } else if (method === "DELETE") {
      await fetch(url, {
      method: "DELETE",
      headers: {"Content-type":"application/json"}, 
      body: JSON.stringify(bodyAct),
      });
    } 
  }

async function loadEvent() {
    const data = await fetch('http://localhost:8080/products');
    /* const pictures = await data.json(); */
    fetchProducts();
    window.addEventListener("click", async (e)=> {
        console.log(e.target);

        if (e.target.className === 'buttonEdit') {
            console.log(e.target.id.split('buttonEdit')[1]);
            const productsData = await fetchProductsWithoutPic();
            console.log(productsData);
            const product = productsData.find((product) => {
                return (product.id === Number(e.target.id.split('buttonEdit')[1]));
              });
            console.log(product);
            actualProduct = product;
            const idEdit = document.getElementById('input-id');
            idEdit.value = product.id;
            const titleEdit = document.getElementById('input-title');
            titleEdit.value = product.title;
            const priceEdit = document.getElementById('input-price');
            priceEdit.value = product.price;
            const imageEdit = document.getElementById('input-image');
            imageEdit.value = product.image;
            const sizeEdit = document.getElementById('input-size');
            sizeEdit.value = product.size;
        }   else if (e.target.className === 'buttonDelete') {
                e.preventDefault();
                console.log(e.target.id.split('buttonDelete')[1]);
                const productsData = await fetchProductsWithoutPic();
                console.log(productsData);
                const product = productsData.find((product) => {
                    return (product.id === Number(e.target.id.split('buttonDelete')[1]));
            });
                console.log(product);
                const toDeleteDiv = document.getElementById(product.id)
                toDeleteDiv.remove();
                await fetchData(`http://localhost:8080/api/products/${product.id}`, product, "DELETE");
        }   else if (e.target.id === 'edit') {
                e.preventDefault();
                const productPut = actualProduct;
                const titleEdit = document.getElementById('input-title');
                productPut.title = titleEdit.value;
                const priceEdit = document.getElementById('input-price');
                productPut.price = priceEdit.value;
                const imageEdit = document.getElementById('input-image');
                productPut.image = imageEdit.value;
                const sizeEdit = document.getElementById('input-size');
                productPut.size = sizeEdit.value;
                await fetchData(`http://localhost:8080/api/products/${productPut.id}`, productPut, "PUT");
                const productDiv = document.querySelectorAll('.productcontainer');
/*                 const element = document.getElementById(window);
                console.log(element) */
  /*               let y = window.pageYOffset;
                console.log(y) */
                for (const product of productDiv) {
                    product.remove();
                }
                fetchProducts();
                /* window.pageYOffset = y; */
        }  else if (e.target.id === 'addnew') {
            e.preventDefault();
            const productPut = {};
            const titleEdit = document.getElementById('input-title');
            productPut.title = titleEdit.value;
            const priceEdit = document.getElementById('input-price');
            productPut.price = priceEdit.value;
            const imageEdit = document.getElementById('input-image');
            productPut.image = imageEdit.value;
            const sizeEdit = document.getElementById('input-size');
            productPut.size = sizeEdit.value;
            await fetchData(`http://localhost:8080/api/products`, productPut, "POST");
            const productDiv = document.querySelectorAll('.productcontainer');
/*                 const element = document.getElementById(window);
            console.log(element) */
/*               let y = window.pageYOffset;
            console.log(y) */
            for (const product of productDiv) {
                product.remove();
            }
            fetchProducts();
            /* window.pageYOffset = y; */
            console.log('hello')
        }
    })
}

async function editProduct(e) {
    const productData = await fetchProducts();
    console.log(productData);
 /*    const userName = e.target.closest('.userDiv').id;
    console.log(userName);
    const user = usersData.find((userData) => {
      return ((userData.name.first + userData.name.middle + userData.name.last) === userName);
    });
    console.log(user);
    fillEditForm(user); */
  }

window.addEventListener('load', loadEvent);
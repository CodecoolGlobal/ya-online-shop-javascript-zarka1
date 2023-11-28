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
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const userIdFromUrl = parseInt(urlParts[urlParts.length - 1]);
    return userIdFromUrl;
}

const postUser = async (user) =>{
    try{
        await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
        });
    }
    catch(error){
        console.error(error.message)
    }
}

const replaceUser = async (userId, user) => {
    try{
        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    }
    catch(error){
        console.error(error.message)
    }
};

const patchUser = async (userId, user) => {
    try{
        await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    }
    catch(error){
    console.error(error.message)
    }
    };

    const deleteUser = async (userId) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(error.message);
        }
    };


const createUserDiv = (user) =>{
    const userDiv = createMyElement('div', 'usercontainer', user.id, '', rootElement);
    const id = createMyElement('h4', 'userid', 'id', `ID: ${user.id}`, userDiv);
    const name = createMyElement ('h2', 'username', 'name', `Name: ${user.name.first} ${user.name.middle} ${user.name.last}`, userDiv);
    const email = createMyElement('p', 'useremail', 'email', `Email: ${user.email}`, userDiv);
    const country = createMyElement('p', 'usercountry', 'country', `Country: ${user.shipping.country}`, userDiv);
    const zip = createMyElement('p', 'userzip', 'zip', `Zipcode: ${user.shipping.zip}`, userDiv);
    const city = createMyElement('p', 'usercity', 'city', `City: ${user.shipping.city}`, userDiv);
    const adress = createMyElement('p', 'useraddress', 'address', `Address: ${user.shipping.address}`, userDiv);
    return userDiv;
}

const fetchData = async () =>{
    try{
        const userIdFromUrl = getUserIdFromUrl();
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        const findElement = data.find((user)=> user.id == userIdFromUrl);
        document.getElementById('input-first').value = findElement.name.first;
        document.getElementById('input-middle').value = findElement.name.middle;
        document.getElementById('input-last').value = findElement.name.last;
        document.getElementById('input-email').value = findElement.email;
        document.getElementById('input-country').value = findElement.shipping.country;
        document.getElementById('input-zip').value = findElement.shipping.zip;
        document.getElementById('input-city').value = findElement.shipping.city;
        document.getElementById('input-adress').value = findElement.shipping.address;
        document.getElementById('input-incountry').value = findElement.invoice.country;
        document.getElementById('input-inzip').value = findElement.invoice.zip;
        document.getElementById('input-incity').value = findElement.invoice.city;
        document.getElementById('input-inadress').value = findElement.invoice.address;
        const userElement = createUserDiv(findElement);
        const userListContainer = document.getElementById('user-list-container');
        userListContainer.appendChild(userElement);
    }
    catch(error){
    console.error(error.message);
    }
}



function loadEvent() {
    fetchData();

    const deleteBtn = document.getElementById('delete-btn');
    deleteBtn.addEventListener('click', async () => {
    try {
        const confirmed = window.confirm('Are you sure you want to delete this user?');

        if (confirmed) {
            const userIdFromUrl = getUserIdFromUrl();
            await deleteUser(userIdFromUrl);
            window.location.href = '/edit/users'; // Redirect to the /edit/users page
        }
    } catch (error) {
        console.error(error.message);
    }
});

    const patchBtn = document.getElementById('patch-btn');
    patchBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const userIdFromUrl = getUserIdFromUrl();
            const updatedFields = {
                name: {
                    first: document.getElementById('input-first').value,
                    middle: document.getElementById('input-middle').value,
                    last: document.getElementById('input-last').value,
                },
                email: document.getElementById('input-email').value,
                shipping: {
                    country: document.getElementById('input-country').value,
                    zip: document.getElementById('input-zip').value,
                    city: document.getElementById('input-city').value,
                    address: document.getElementById('input-adress').value,
                },
                invoice: {
                    country: document.getElementById('input-incountry').value,
                    zip: document.getElementById('input-inzip').value,
                    city: document.getElementById('input-incity').value,
                    address: document.getElementById('input-inadress').value,
                },
            };
        await patchUser(userIdFromUrl, updatedFields);
            location.reload();
        } catch (error) {
            console.error(error.message);
        }
    });

    const putBtn = document.getElementById('put-btn');
    putBtn.addEventListener('click', async () => {
        try {
            const userIdFromUrl = getUserIdFromUrl();
            const firstNameInput = document.getElementById('input-first');
            const middleNameInput = document.getElementById('input-middle');
            const lastNameInput = document.getElementById('input-last');
            const emailInput = document.getElementById('input-email');
            const countryInput = document.getElementById('input-country');
            const zipcodeInput = document.getElementById('input-zip');
            const cityInput = document.getElementById('input-city');
            const adressInput = document.getElementById('input-adress');
            const invoCountryInput = document.getElementById('input-incountry');
            const invoZipInput = document.getElementById('input-inzip');
            const invoCityInput = document.getElementById('input-incity');
            const invoAdressInput = document.getElementById('input-inadress');

            const firstName = firstNameInput.value;
            const middleName = middleNameInput.value;
            const lastName = lastNameInput.value;
            const email = emailInput.value;
            const country = countryInput.value;
            const zipcode = zipcodeInput.value;
            const city = cityInput.value;
            const adress = adressInput.value;
            const countryInvo = invoCountryInput.value;
            const zipcodeInvo = invoZipInput.value;
            const cityInvo = invoCityInput.value;
            const adressInvo = invoAdressInput.value;

            const updatedUser = {
                id: userIdFromUrl,
                name: {
                    first: firstName,
                    middle: middleName,
                    last: lastName,
                },
                email: email,
                shipping: {
                    country: country,
                    zip: zipcode,
                    city: city,
                    address: adress,
                },
                invoice: {
                    country: countryInvo,
                    zip: zipcodeInvo,
                    city: cityInvo,
                    address: adressInvo,
                },
            };
            await replaceUser(userIdFromUrl, updatedUser);
            location.reload();
        } catch (error) {
            console.error(error.message);
        }
    });
}

window.addEventListener('load', loadEvent);
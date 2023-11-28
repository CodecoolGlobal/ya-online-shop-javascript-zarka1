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
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        const userElements = data.map((user)=> createUserDiv(user));
        const userListContainer = document.getElementById('user-list-container');
        userElements.forEach((userElement) => {
            userListContainer.appendChild(userElement);
        });
    }
    catch(error){
    console.error(error.message);
    }
}

const getNewUser = () =>{
    const form = document.getElementById('new-user');
    form.addEventListener('submit', async (event)=>{
        try{
        event.preventDefault();
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
        const firstName  = firstNameInput.value;
        const middleName = middleNameInput.value;
        const lastName = lastNameInput.value;
        const email  = emailInput.value;
        const country  = countryInput.value;
        const zipcode  = zipcodeInput.value;
        const city  = cityInput.value;
        const adress  = adressInput.value;
        const countryInvo  = invoCountryInput.value;
        const zipcodeInvo  = invoZipInput.value;
        const cityInvo  = invoCityInput.value;
        const adressInvo  = invoAdressInput.value;
        const newUser =
            {
                id: 0,
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
                }
            }
        await postUser(newUser);
        location.reload();
        }
        catch(error){
            console.error(error.message);
        }
    })
}

async function loadEvent() {
    const picture = await fetch('http://localhost:8080/pictures/back_to_the_future.webp');
    console.log(picture);
    /*     fetchData();
    getNewUser();

    const putBtn = document.getElementById('put-btn');
    putBtn.addEventListener('click', async () => {
        try {
            // Get the input values for the updated user
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
    }); */
}

window.addEventListener('load', loadEvent);
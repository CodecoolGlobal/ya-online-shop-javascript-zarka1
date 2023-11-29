const rootElement = document.getElementById('rootreg');

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
    await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    });
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
        const firstName  = firstNameInput.value;
        const middleName = middleNameInput.value;
        const lastName = lastNameInput.value;
        const email  = emailInput.value;
        const country  = countryInput.value;
        const zipcode  = zipcodeInput.value;
        const city  = cityInput.value;
        const adress  = adressInput.value;
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
            }
        await postUser(newUser);
        window.alert('Your Accaunt succesfully created!')
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = '/'; //! VISSZA A FŐOLDALRA
        }
        catch(error){
            console.error(error.message);
        }
    })
}

function loadEvent() {
    getNewUser();

}
window.addEventListener('load', loadEvent);
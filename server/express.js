import express, { json } from 'express';
import path from 'path';
import url from 'url';
import { readFile, writeFile } from 'fs/promises';


const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(_dirname, '../client')));

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});

const getUsersData = async () => {
    try{
        const data = await readFile('userdata.json', 'utf-8');
        const usersData = JSON.parse(data).users;
        return usersData;
    }
    catch(error){
        console.error('Error reading JSON file:', error.message);
    }
}

const getOrdersData = async () => {
    try{
        const data = await readFile('./orderdata.json', 'utf-8');
        const ordersData = JSON.parse(data);
        return ordersData.orders;
    }
    catch(error){
        console.error('Error reading JSON file:', error.message);
    }
}

const getProductsData = async () => {
    try{
        const data = await readFile('./products.json', 'utf-8');
        const productsData = JSON.parse(data);
        return productsData.products;
    }
    catch(error){
        console.error('Error reading JSON file:', error.message);
    }
}

async function writeUsersData(data) {
    await writeFile('userdata.json', JSON.stringify({users: data}), 'utf-8');
}

async function writeOrdersData(data) {
    await writeFile('orderdata.json', JSON.stringify({orders: data}), 'utf-8');
}

async function writeProductsData(data) {
    await writeFile('products.json', JSON.stringify({products: data}), 'utf-8');
}

app.get('/api/users', async (req, res)=>{
    try{
        const usersData = await getUsersData('userdata.json');
        res.json(usersData);
    }
    catch(error){

        console.error(error.message);
    }
})



app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;
        const existingUsersData = await getUsersData();
        newUser.id = existingUsersData[existingUsersData.length -1].id + 1 || 0;
        existingUsersData.push(newUser);
        await writeUsersData(existingUsersData);
        res.send(newUser);
        console.log(newUser)
    } catch (error) {
        console.error('Error handling POST request:', error.message);
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = req.body;
        console.log(newOrder);
        const existingOrdersData = await getOrdersData();
        newOrder.id = existingOrdersData ? existingOrdersData.length: 0;
        existingOrdersData.push(newOrder);
        await writeOrdersData(existingOrdersData);
        const response = {orderID : newOrder.id}
        res.send(response);
    } catch (error) {
        console.error('Error handling POST request:', error.message);
    }
});

app.get('/', (req, res)=>{
    res.sendFile(path.join(_dirname,"../client/database.html"));
});

app.get('/edit', (req, res)=>{
    res.sendFile(path.join(_dirname,"../client/data.html"));
});

app.get('/register', (req, res)=>{
    res.sendFile(path.join(_dirname,"../client/register.html"));
});

app.get('/register/:id', (req, res)=>{
    res.sendFile(path.join(_dirname,"../client/edituser.html"));
});

app.get('/products', async (req, res)=>{
    try{
        const data = await readFile('products.json', 'utf-8');
        const productsData = JSON.parse(data);
        res.send(productsData);
    }
    catch(error){
        console.error('Error reading JSON file:', error.message);
    }
});

app.get('/edit/users/:id', (req, res)=>{
    res.sendFile(path.join(_dirname,"../client/personal.html"));
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updatedUser = req.body;

        const existingUsersData = await getUsersData();
        const indexToUpdate = existingUsersData.findIndex((user) => user.id === userId);

        if (indexToUpdate !== -1) {
            existingUsersData[indexToUpdate] = { id: userId, ...updatedUser };
            await writeUsersData(existingUsersData);
            res.json(existingUsersData[indexToUpdate]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
});

app.patch('/api/users/:id', async (req, res)=>{
    try {
        const userId = parseInt(req.params.id);
        const updatedUser = req.body;

        const existingUsersData = await getUsersData();
        const indexToUpdate = existingUsersData.findIndex((user) => user.id === userId);

        if (indexToUpdate !== -1) {
            existingUsersData[indexToUpdate] = { id: userId, ...updatedUser };
            await writeUsersData(existingUsersData);
            res.json(existingUsersData[indexToUpdate]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch(error){
        res.status(500).json({error:'Internal Server Error'});
        throw error;
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const existingUsersData = await getUsersData();
        const indexToDelete = existingUsersData.findIndex((user) => user.id === userId);

        if (indexToDelete !== -1) {
            existingUsersData.splice(indexToDelete, 1);
            await writeUsersData(existingUsersData);
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        const existingProductsData = await getProductsData();
        const indexToDelete = existingProductsData.findIndex((product) => product.id === productId);

        if (indexToDelete !== -1) {
            existingProductsData.splice(indexToDelete, 1);
            console.log(existingProductsData);
            await writeProductsData(existingProductsData);
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const existingProductsData = await getProductsData();
        const indexToModify = existingProductsData.findIndex((product) => product.id === productId);
        if (indexToModify !== -1) {
            existingProductsData[indexToModify] = req.body;
            console.log(existingProductsData);
            await writeProductsData(existingProductsData);
            res.json({ message: 'Product modified successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const existingProductsData = await getProductsData();
        let id = 0;
        const newProduct = req.body;
        for (const product of existingProductsData) {
          if (Number(product.id) > id) id = Number(product.id);
        }
        newProduct.id = id + 1;
        existingProductsData.push(newProduct);
        console.log(existingProductsData);
        await writeProductsData(existingProductsData);
        res.json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        throw error;
    }
});
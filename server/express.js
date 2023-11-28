import express from "express";
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
    
async function writeUsersData(data) {
    await writeFile('userdata.json', JSON.stringify({users: data}), 'utf-8');
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
        res.json(newUser);
    } catch (error) {
        console.error('Error handling POST request:', error.message);
    }
});

app.get('/edit/users', (req, res)=>{
    res.sendFile(path.join(_dirname,"../client/database.html"));
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
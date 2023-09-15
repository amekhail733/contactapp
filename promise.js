const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

async function readContactFile() {
    const data = await fs.readFile('./data/contacts.json', 'utf8');
    return JSON.parse(data);
};

async function writeContactFiles(contacts) {
    await fs.writeFile('./data/contacts.json', JSON.stringify(contacts));
}

app.get('/', async (req, res) => {
    try {
        const contacts = await readContactFile();
        res.render('index', { contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async(req, res) => {
    try{
        const newContact = req.body;
        const contacts = await readContactFile();
        contacts.push(newContact);
        await writeContactFiles(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const contacts = await readContactFile();
        const contact = contacts[id];
        res.render('edit', { id, contact });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
});

app.post('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const updatedContact = req.body;
        const contacts = await readContactFile();
        contacts[id] = updatedContact;
        await writeContactFiles(contacts);
        res.redirect('/')
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Sever Error');
    }
});

app.get('/view/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contacts = await readContactFile();
        const contact = contacts[id];
        res.render('view', { contact });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Sever Error')
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contacts = await readContactFile();
        contacts.splice(id, 1);
        await writeContactFiles(contacts);
        res.redirect('/');
    } catch (error){ 
        console.error(error);
        res.status(500).send('Internal Sever Error');
    }
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`); 
})
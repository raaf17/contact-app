const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})
);
app.use(flash());

// Halaman Home
app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: 'Kipli',
      email: 'kipli@gmail.com',
    },
    {
      nama: 'Erik',
      email: 'kipli@gmail.com',
    },
    {
      nama: 'Doddy',
      email: 'kipli@gmail.com',
    },
  ];
  res.render('index', {
    layout: 'layouts/main-layout',
    nama: 'Kipli',
    title: 'Halaman Home',
    mahasiswa,
  });
});

// Halaman About
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman About'
  });
});

// Halaman Contact
app.get('/contacts', async (req, res) => {

  const contacts = await Contact.find();

  res.render('contacts', {
    layout: 'layouts/main-layout',
    title: 'Halaman Contacs',
    contacts,
    msg: req.flash('msg'),
  });
});

// Halaman Detail
app.get('/contacts/:nama', async (req, res) => {
  // const contact = findContact(req.params.nama);
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Halaman Detail Contact',
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo DB Contact App | listening at http://localhost:${port}`);
});
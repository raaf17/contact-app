const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

// Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

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

app.listen(port, () => {
  console.log(`Mongo DB Contact App | listening at http://localhost:${port}`);
});
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// Setup Method Override
app.use(methodOverride('_method'));

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

// Halaman Form Tambah Data Contact
app.get('/contacts/add', (req, res) => {
  res.render('add-contact', {
    title: 'Tambah Data Contact',
    layout: 'layouts/main-layout'
  });
});

// Proses Tambah Data Contact
app.post('/contacts', [
  body('nama').custom(async (value) => {
    const duplikat = await Contact.findOne({ nama: value });
    if (duplikat) {
      throw new Error('Nama contact sudah digunakan!');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      title: 'Tambah Data Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    });
  } else {
    Contact.insertMany(req.body, (error, result) => {
      // Kirimkan Flash Message
      req.flash('msg', 'Data contact berhasil ditambahkan!');
      res.redirect('/contacts');
    });
  }
});

// Hapus Data Contact
app.delete('/contacts', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contacts');
  });
});

// Form Ubah Data Contact
app.get('/contacts/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render('edit-contact', {
    title: 'Edit Data Contact',
    layout: 'layouts/main-layout',
    contact,
  });
});

// Proses Update Data
app.put('/contacts', [
  body('nama').custom(async (value, { req }) => {
    const duplikat = await Contact.findOne({ nama: value });
    if (value !== req.body.oldNama && duplikat) {
      throw new Error('Nama contact sudah digunakan!');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('edit-contact', {
      title: 'Edit Data Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    Contact.updateOne(
      { _id: req.body._id },
      {
        $set: {
          nama: req.body.nama,
          enmail: req.body.email,
          noHP: req.body.noHP
        }
      }
    ).then((result) => {
      // Kirimkan Flash Message
      req.flash('msg', 'Data contact berhasil diubah!');
      res.redirect('/contacts');
    });
  }
});

// Halaman Detail
app.get('/contacts/:nama', async (req, res) => {
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
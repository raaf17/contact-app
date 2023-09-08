const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/learnmongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// // Menambah 1 Data
// const contact1 = new Contact({
//   nama : 'Rizky',
//   noHP : '+628953456789',
//   email: 'rizky@gmail.com',
// });

// // Simpan ke Collection
// contact1.save().then((contact) => console.log(contact));
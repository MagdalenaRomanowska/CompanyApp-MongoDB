const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');//Mongoose importuje mongodb wewnątrz siebie.

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', employeesRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', productsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
})

// connects our backend code with the database. Wybór bazy możemy określić od razu w adresie (mongodb://localhost:27017/companyDB).
mongoose.connect('mongodb://localhost:27017/companyDB', { useNewUrlParser: true });//kod otwiera połączenie z serwerem bazy danych (mongodb://localhost:27017/) i przypisuje go do obiektu mongoose.connection.
const db = mongoose.connection;//Skracamy sobie dostęp do naszej bazy danych przypisując referencję do stałej db.

db.once('open', () => {//kiedy JS wykryje zdarzenie open, to w konsoli wypisze 'Connected to the database'.
  console.log('Connected to the database'); // 'once' to też nasłuchiwacz. Nie ma sensu używać ciągle 'on', skoro 'once' zdarzenie wykona się tylko 1 raz.
});
db.on('error', err => console.log('Error ' + err));//użyliśmy on, a nie once, bo error może emitować się wiele razy, nie tylko przy połączeniu, ale zawsze, gdy coś pójdzie nie tak.

app.listen('8000', () => {
  console.log('Server is running on port: 8000');
});
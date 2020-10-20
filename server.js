const express = require('express');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;//potrzebujemy tylko części modułu mongodb, mongoClient, dającej dostęp do operacji CRUD. 

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) { //Pierwszy parametr tej funkcji wskazuje na adres serwera MongoDB (u nas to lokalne localhost:27017), a drugi umożliwia opcjonalną konfigurację. 
    console.log(err);
  }
  else {//Jeśli jednak wszystko pójdzie dobrze, to obiekt klienta MongoDB zostanie zapisany w drugim parametrze (u nas client z '(err, client)').
    console.log('Successfully connected to the database');
    const db = client.db('companyDB');//rozkaz: na serwerze MongoDB znajdź bazę danych o nazwie companyDB i przypisz referencję do niej do stałej db.
    const app = express();//umieszczenie całego kodu inicjacji serwera Express w funkcji callback.
    //Od tej chwili nasz server.js nie tylko łączy się z bazą, ale też pozwala na dostęp do niej z poziomu serwera Express, poprzez obiekt db.
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes);

    app.use((req, res) => {
      res.status(404).send({ message: 'Not found...' });
    })

    app.listen('8000', () => {
      console.log('Server is running on port: 8000');
    });

    db.collection('employees').find({ department: 'IT' }).toArray((err, data) => {
      if(!err) {
        console.log(data)
      }
    });

    db.collection('departments').insertOne({ name: 'Management' }, err => {
      if(err) console.log('err');
    });

  }
});



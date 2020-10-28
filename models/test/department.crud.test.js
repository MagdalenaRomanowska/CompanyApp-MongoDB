const Department = require('../department.model.js');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;//import funkcji do tworzenia testowej bazy danych.
const mongoose = require('mongoose');//Potrzebujemy jej, bo tworzymy połączenie. Baza będzie testowa, ale samo połączenie prawdziwe.

describe('Department', () => {

    before(async () => {//całość jest schowana w hooku before, bo chcemy, by testy uruchomiły się dopiero 
        //gdy mamy pewność, że połączenie jest gotowe.
        try {
            const fakeDB = new MongoMemoryServer(); //Tworzymy nową testową bazę danych. Warto wiedzieć, 
            //że mamy możliwość założenia nawet kilku "oszukanych" baz na raz.
            const uri = await fakeDB.getUri();//Następnie pobieramy adres tej bazy. Domyślnie 
            //paczka tworzy ją pod adresem 127.0.0.1 i łączy się za pomocą pierwszego lepszego wolnego portu. 
            //Te opcje można w razie potrzeby zmienić.
            await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });//Na końcu łączymy się 
            //z bazą przy użyciu mongoose.connect, a jako adres przekazujemy fakeDB. Paczka mongodb-memory-server 
            //oferuje też funkcję do zakończenia działania bazy, ale nie musimy tego robić. Gdy proces testowania 
            //się zakończy, baza usunie się automatycznie.
        } catch (err) {
            console.log(err);
        }
    });

    describe('Reading data', () => {
        before(async () => {//dostęp do jakichś danych dla całej grupy testów Reading data.
            //Dzięki temu mamy gwarancję, że zanim którykolwiek test z tej grupy zostanie uruchomiony, dane będą już dostępne. 
            const testDepOne = new Department({ name: 'Department #1' });
            await testDepOne.save();

            const testDepTwo = new Department({ name: 'Department #2' });
            await testDepTwo.save();
        });
        it('should return all the data with "find" method', async () => {
            const departments = await Department.find();//Szukamy wszystkich danych.
            const expectedLength = 2;//a potem sprawdzamy czy ich ilość jest zgodna z założeniami. 
            expect(departments.length).to.be.equal(expectedLength);
        });
        it('should return a proper document by "name" with "findOne" method', async () => {
            const department = await Department.findOne({ name: 'Department #1' });
            const expectedName = 'Department #1';
            expect(department.name).to.be.equal(expectedName);
        });
        after(async () => {
            await Department.deleteMany();
        });
    });
});
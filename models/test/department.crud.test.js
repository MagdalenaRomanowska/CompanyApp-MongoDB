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
            const uri = await fakeDB.getConnectionString();//Następnie pobieramy adres tej bazy. Domyślnie 
            //paczka tworzy ją pod adresem 127.0.0.1 i łączy się za pomocą pierwszego lepszego wolnego portu. 
            //Te opcje można w razie potrzeby zmienić.
            mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });//Na końcu łączymy się 
            //z bazą przy użyciu mongoose.connect, a jako adres przekazujemy fakeDB. Paczka mongodb-memory-server 
            //oferuje też funkcję do zakończenia działania bazy, ale nie musimy tego robić. Gdy proces testowania 
            //się zakończy, baza usunie się automatycznie.
        } catch (err) {
            console.log(err);
        }
    });

    describe('Reading data', () => {

        it('should return all the data with "find" method', () => {

        });

    });

});
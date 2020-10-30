const Department = require('../department.model.js');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;//import funkcji do tworzenia testowej bazy danych.
const mongoose = require('mongoose');//Potrzebujemy jej, bo tworzymy połączenie. Baza będzie testowa, ale samo połączenie prawdziwe.

// testy metod.

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

    describe('Creating data', () => {//nie musimy wykorzystywać hooka before i przygotowywać bazy danych, bo fakt, że jest pusta, nam nie przeszkadza.

        it('should insert new document with "insertOne" method', async () => {
            const department = new Department({ name: 'Department #1' });
            await department.save();
            expect(department.isNew).to.be.false;
            //Jeśli dokument nie był jeszcze zapisany w bazie danych, to jego atrybut isNew=true, a gdy został już do niej wprowadzony, zwróci false.
        });
        after(async () => {
            await Department.deleteMany();
        });
    });

    describe('Updating data', () => {
        beforeEach(async () => { //Dlaczego ten, a nie before? Dlatego, że każdy test będzie modyfikował dane, idealnie byłoby więc je przywracać do stanu początkowego przed każdym kolejnym testem.
            const testDepOne = new Department({ name: 'Department #1' });
            await testDepOne.save();

            const testDepTwo = new Department({ name: 'Department #2' });
            await testDepTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Department.updateOne({ name: 'Department #1' }, { $set: { name: '=Department #1=' } });//aktualizuję jeden z dokumentów.
            const updatedDepartment = await Department.findOne({ name: '=Department #1=' });//sprawdzam, czy istnieje on teraz w kolekcji. 
            expect(updatedDepartment).to.not.be.null;
            //Znowu: wykorzystuję to, że findOne zwraca dokument (jeśli znajdzie pasujący) albo null (jeśli takiego nie ma).
        });

        it('should properly update one document with "save" method', async () => {
            //Mongoose, mimo tego, że zezwala na użycie updateOne, zaleca korzystanie z metody save do aktualizacji pojedynczego dokumentu. 
            //Musimy więc przetestować również taki scenariusz.
            const department = await Department.findOne({ name: 'Department #1' });
            department.name = '=Department #1=';
            await department.save();//aktualizacja danych. Pod maską save też korzysta z metody updateOne.

            const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
            expect(updatedDepartment).to.not.be.null;
        });

        it('should properly update multiple documents with "updateMany" method', async () => {
            await Department.updateMany({}, { $set: { name: 'Updated!' } });//zmodyfikować dane za pomocą metody updateMany.
            const departments = await Department.find();//pobierzemy zawartość kolekcji.
            expect(departments[0].name).to.be.equal('Updated!');//sprawdzimy, czy faktycznie wartości zostały zaktualizowane.
            expect(departments[1].name).to.be.equal('Updated!');//sprawdzimy, czy faktycznie wartości zostały zaktualizowane.
            //można te 2 linijki zapisać tak: expect(departments.length).to.be.equal(2);
        });

        afterEach(async () => {// ten hook po każdym teście będzie usuwał dane z kolekcji, aby można było je wprowadzić od nowa.
            await Department.deleteMany();
        });
    });
    describe('Removing data', () => {
        //Żeby coś usunąć, musimy najpierw to utworzyć, więc blok beforeEach- będą istniały odpowiednie testowe dane.
        beforeEach(async () => {
            const testDepOne = new Department({ name: 'Department #1' });
            await testDepOne.save();

            const testDepTwo = new Department({ name: 'Department #2' });
            await testDepTwo.save();
        });
        it('should properly remove one document with "deleteOne" method', async () => {
            await Department.deleteOne({ name: 'Department #1' });//Usuwamy dokument
            const removeDepartment = await Department.findOne({ name: 'Department #1' });//następnie staramy się go znaleźć
            expect(removeDepartment).to.be.null;//na końcu sprawdzamy, czy findOne zgodnie z planem zwróciło null = elementu nie udało się zlokalizować, a więc już nie istnieje.
        });

        it('should properly remove one document with "remove" method', async () => {
            const department = await Department.findOne({ name: 'Department #1' });//Musimy znaleźć jeden dokument
            await department.remove(); //usuwamy go
            const removedDepartment = await Department.findOne({ name: 'Department #1' });
            expect(removedDepartment).to.be.null;//sprawdzimy, czy element stanie się po tej operacji nullem.
        });

        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Department.deleteMany();//Usuwamy wszystkie dokumenty.
            const departments = await Department.find();
            expect(departments.length).to.be.equal(0);//sprawdzamy, czy kolekcja jest teraz pusta.
        });
        afterEach(async () => {//każdorazowe zerowanie kolekcji po skończonych testach.
            await Department.deleteMany();
        });
    });
});
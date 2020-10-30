const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;//import funkcji do tworzenia testowej bazy danych.
const mongoose = require('mongoose');//Potrzebujemy jej, bo tworzymy połączenie. Baza będzie testowa, ale samo połączenie prawdziwe.

// testy metod.

describe('Employee', () => {

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
            const testEmplOne = new Employee({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            await testEmplOne.save();

            const testEmplTwo = new Employee({ firstName: 'Employee #2 firstName', lastName: 'Employee #2 lastName', department: 'Employee #2 dep' });
            await testEmplTwo.save();
        });
        it('should return all the data with "find" method', async () => {
            const employees = await Employee.find();//Szukamy wszystkich danych.
            const expectedLength = 2;//a potem sprawdzamy czy ich ilość jest zgodna z założeniami. 
            expect(employees.length).to.be.equal(expectedLength);
        });
        it('should return a proper document by "firstName", "lastName" and "department" with "findOne" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            const expectedFirstName = 'Employee #1 firstName';
            const expectedLastName = 'Employee #1 lastName';
            const expectedDepartment = 'Employee #1 dep';
            expect(employee.firstName).to.be.equal(expectedFirstName);
            expect(employee.lastName).to.be.equal(expectedLastName);
            expect(employee.department).to.be.equal(expectedDepartment);
        });
        after(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Creating data', () => {//nie musimy wykorzystywać hooka before i przygotowywać bazy danych, bo fakt, że jest pusta, nam nie przeszkadza.

        it('should insert new document with "insertOne" method', async () => {
            const employee = new Employee({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            await employee.save();
            expect(employee.isNew).to.be.false;
            //Jeśli dokument nie był jeszcze zapisany w bazie danych, to jego atrybut isNew=true, a gdy został już do niej wprowadzony, zwróci false.
        });
        after(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Updating data', () => {
        beforeEach(async () => { //Dlaczego ten, a nie before? Dlatego, że każdy test będzie modyfikował dane, idealnie byłoby więc je przywracać do stanu początkowego przed każdym kolejnym testem.
            const testEmplOne = new Employee({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            await testEmplOne.save();

            const testEmplTwo = new Employee({ firstName: 'Employee #2 firstName', lastName: 'Employee #2 lastName', department: 'Employee #2 dep' });
            await testEmplTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' }, { $set: { firstName: '=Employee #1 firstName=', lastName: '=Employee #1 lastName=', department: '=Employee #1 dep=' } });//aktualizuję jeden z dokumentów.
            const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1 firstName=', lastName: '=Employee #1 lastName=', department: '=Employee #1 dep=' });//sprawdzam, czy istnieje on teraz w kolekcji. 
            expect(updatedEmployee).to.not.be.null;
            //Znowu: wykorzystuję to, że findOne zwraca dokument (jeśli znajdzie pasujący) albo null (jeśli takiego nie ma).
        });

        it('should properly update one document with "save" method', async () => {
            //Mongoose, mimo tego, że zezwala na użycie updateOne, zaleca korzystanie z metody save do aktualizacji pojedynczego dokumentu. 
            //Musimy więc przetestować również taki scenariusz.
            const employee = await Employee.findOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            employee.firstName = '=Employee #1 firstName=';
            employee.lastName = '=Employee #1 lastName=';
            employee.department = '=Employee #1 dep=';
            await employee.save();//aktualizacja danych. Pod maską save też korzysta z metody updateOne.

            const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1 firstName=', lastName: '=Employee #1 lastName=', department: '=Employee #1 dep=' });
            expect(updatedEmployee).to.not.be.null;
        });

        it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.updateMany({}, { $set: { firstName: 'Updated firstName', lastName: 'Updated lastName', department: 'Updated dep' } });//zmodyfikować dane za pomocą metody updateMany.
            const employees = await Employee.find();//pobierzemy zawartość kolekcji.
            expect(employees[0].firstName).to.be.equal('Updated firstName');//sprawdzimy, czy faktycznie wartości zostały zaktualizowane.
            expect(employees[0].lastName).to.be.equal('Updated lastName');
            expect(employees[0].department).to.be.equal('Updated dep');
            expect(employees[1].firstName).to.be.equal('Updated firstName');//sprawdzimy, czy faktycznie wartości zostały zaktualizowane.
            expect(employees[1].lastName).to.be.equal('Updated lastName');
            expect(employees[1].department).to.be.equal('Updated dep');
            //można te 2 linijki zapisać tak: expect(employees.length).to.be.equal(2);
        });

        afterEach(async () => {// ten hook po każdym teście będzie usuwał dane z kolekcji, aby można było je wprowadzić od nowa.
            await Employee.deleteMany();
        });
    });

    describe('Removing data', () => {
        //Żeby coś usunąć, musimy najpierw to utworzyć, więc blok beforeEach- będą istniały odpowiednie testowe dane.
        beforeEach(async () => {
            const testEmplOne = new Employee({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            await testEmplOne.save();

            const testEmplTwo = new Employee({ firstName: 'Employee #2 firstName', lastName: 'Employee #2 lastName', department: 'Employee #2 dep' });
            await testEmplTwo.save();
        });
        it('should properly remove one document with "deleteOne" method', async () => {
            await Employee.deleteOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });//Usuwamy dokument
            const removeEmployee = await Employee.findOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });//następnie staramy się go znaleźć
            expect(removeEmployee).to.be.null;//na końcu sprawdzamy, czy findOne zgodnie z planem zwróciło null = elementu nie udało się zlokalizować, a więc już nie istnieje.
        });

        it('should properly remove one document with "remove" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });//Musimy znaleźć jeden dokument
            await employee.remove(); //usuwamy go
            const removedEmployee = await Employee.findOne({ firstName: 'Employee #1 firstName', lastName: 'Employee #1 lastName', department: 'Employee #1 dep' });
            expect(removedEmployee).to.be.null;//sprawdzimy, czy element stanie się po tej operacji nullem.
        });

        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Employee.deleteMany();//Usuwamy wszystkie dokumenty.
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);//sprawdzamy, czy kolekcja jest teraz pusta.
        });
        afterEach(async () => {//każdorazowe zerowanie kolekcji po skończonych testach.
            await Employee.deleteMany();
        });
    });
});
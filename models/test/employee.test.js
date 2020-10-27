const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

    it('should throw an error if no "firstName", "lastName" or "department" arg', () => {
        const empl = new Employee({}); // tworzymy nowy dokument na bazie modelu Employee.
        // Celowo nie ustalamy wartości dla name, by sprawdzić, czy Mongoose zwróci nam w takiej sytuacji błąd.
        empl.validate(err => { //Przed dodaniem danych, save korzysta z metody validate, dla której brak połączenia z bazą nie jest problemem. Ta funkcja weryfikuje dane zgodnie ze schematem, więc nie potrzebujemy save.
            expect(err.errors.firstName).to.exist;// sprawdza po kolei każdy atrybut i jeśli zauważy jakiś błąd, zapisuje go w obiekcie errors, pod nazwą tego atrybutu. 
            expect(err.errors.lastName).to.exist;
            expect(err.errors.department).to.exist;
        });
    });

    it('should throw an error if "firstName", "lastName" or "department" is not a string', () => {
        const cases = [{}, [] ];
        for (let firstName of cases) {
            const empl = new Employee({ firstName, lastName: 'Doe', department: 'IT IT' });
            empl.validate(err => {
                expect(err.errors.firstName).to.exist;
            });
        }
        for (let lastName of cases) {
            const empl = new Employee({ firstName: 'Anne', lastName, department: 'IT IT' });
            empl.validate(err => {
                expect(err.errors.lastName).to.exist;
            });
        }
        for (let department of cases) {
            const empl = new Employee({ firstName: 'Anne', lastName: 'Doe', department });
            empl.validate(err => {
                expect(err.errors.department).to.exist;
            });
        }
    });

    it('should not throw an error if "firstName", "lastName" or "department" is okay', () => {
        const cases = [{ firstName: "Maggie", lastName: "Smith", department: "5f8f0de0b95ae5eeb7c7cd67" }];
        for (let employeeData of cases) {//czy błędu nie będzie, jeśli wszystko wpiszemy dobrze.
            const empl = new Employee( employeeData );
            empl.validate(err => {
                expect(err).to.not.exist;
            });//tym razem nie chcemy, aby jakikolwiek błąd się pojawił, stąd też to.not.exist zamiast to.exist.
        }
        
    });
});

after(() => {
    mongoose.models = {};
});




const Department = require('../department.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Department', () => {

    it('should throw an error if no "name" arg', () => {
        const dep = new Department({}); // tworzymy nowy dokument na bazie modelu Department.
        // Celowo nie ustalamy wartości dla name, by sprawdzić, czy Mongoose zwróci nam w takiej sytuacji błąd.
        dep.validate(err => { //Przed dodaniem danych, save korzysta z metody validate, dla której brak połączenia z bazą nie jest problemem. Ta funkcja weryfikuje dane zgodnie ze schematem, więc nie potrzebujemy save.
            expect(err.errors.name).to.exist;// sprawdza po kolei każdy atrybut i jeśli zauważy jakiś błąd, zapisuje go w obiekcie errors, pod nazwą tego atrybutu. 
        });
    });

    it('should throw an error if "name" is not a string', () => {
        const cases = [{}, []];
        for (let name of cases) {
            const dep = new Department({ name });
            dep.validate(err => {
                expect(err.errors.name).to.exist;
            });
        }
    });

    it('should throw an error if "name" is too short or too long', () => {
        const cases = ['Abc', 'abcd', 'Lorem Ipsum, Lorem Ip']; // we test various cases, some of them are too short, some of them are too long
        for (let name of cases) {//nazwa działu musi mieć 5 lub więcej znaków, ale nie może przekroczyć 20.
            const dep = new Department({ name });
            dep.validate(err => {
                expect(err.errors.name).to.exist;
            });
        }
    });

    it('should not throw an error if "name" is okay', () => {
        const cases = ['Management', 'Human Resources'];
        for (let name of cases) {//czy błędu nie będzie, jeśli wszystko wpiszemy dobrze.
            const dep = new Department({ name });
            dep.validate(err => {
                expect(err).to.not.exist;
            });//tym razem nie chcemy, aby jakikolwiek błąd się pojawił, stąd też to.not.exist zamiast to.exist.
        }
    });
});





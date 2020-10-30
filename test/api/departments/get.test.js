const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');//dostęp do serwera pod stałą server.
const Department = require('../../../models/department.model');

chai.use(chaiHttp); //dodać do chai jako middleware. 

const expect = chai.expect; //tworzymy sobie skróty do metod expect i request. Zawsze lepiej pisać expect niż chai.expect.
const request = chai.request; //funkcja pomocnicza request do symulowania requestów, nie jest wbudowana w pakiet Chai. Trzeba pobrać plugin: yarn add chai-http@4.3.0.

describe('GET /api/departments', () => {
    before(async () => {//dajemy jakieś dane do zwracania.
        const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
        await testDepOne.save();

        const testDepTwo = new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' });
        await testDepTwo.save();
    });
    it('/ should return all departments', async () => {
        const res = await request(server).get('/api/departments'); //Łączymy się z api/departments za pomocą metody GET.
        expect(res.status).to.be.equal(200); //sprawdzamy, czy serwer zwrócił kod sukcesu (a powinien)
        expect(res.body).to.be.an('array'); // i czy otrzymaliśmy jako odpowiedź tablicę z dokładnie dwoma elementami.
        expect(res.body.length).to.be.equal(2);
    });

    it('/:id should return one department by :id ', async () => {
        const res = await request(server).get('/api/departments/5d9f1140f10a81216cfd4408');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object'); // czy odpowiedź jest obiektem i czy nie jest nullem. Null sugerowałby, że obiektu nie udało się odnaleźć.
        expect(res.body).to.not.be.null;
    });

    it('/random should return one random department', async () => {
        const res = await request(server).get('/api/departments/random');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.null;
    });

    after(async () => {//kasujemy fake`owe dane.
        await Department.deleteMany();
    });
});
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/departments', () => {

    it('/ should insert new document to db and return success', async () => {
        const res = await request(server).post('/api/departments').send({ name: '#Department #1' });
        // tym razem wraz z requestem wysyłane są również dane (body). Bo endpoint /api/departments POST oczekuje na nazwę działu.
        const newDepartment = await Department.findOne({ name: '#Department #1' });
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('OK');
        expect(newDepartment).to.not.be.null;//prawdza, czy element rzeczywiście jest dodany do bazy.
    });

    after(async () => {//Usuwanie próbnego wpisu, który będzie dodawany podczas testowego requestu. Nie korzystamy z hooka before, ale after się przyda.
        await Department.deleteMany();
    });
});
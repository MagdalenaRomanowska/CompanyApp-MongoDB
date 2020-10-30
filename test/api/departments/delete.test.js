const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {
    before(async () => {//dajemy jakieś dane do usuwania.
        const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4444', name: 'Department #11' });
        await testDepOne.save();
    });

    it('/ should delete document from db and return success', async () => {
        const res = await request(server).delete('/api/departments/5d9f1140f10a81216cfd4444').send({ name: '#Department #11' });
        // tym razem wraz z requestem wysyłane są również dane (body). Bo endpoint /api/departments DELETE oczekuje na nazwę działu.
        const newDepartment = await Department.findOne({ name: '#Department #11' });
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('OK');
        expect(newDepartment).to.be.null;//prawdza, czy element rzeczywiście jest usunięty z bazy.
    });

});
require('should');
const request = require('supertest');
const controller = require("../controller/controller");
const app = require('../app.js');

describe('integration test - promise', function () {

    it("get('/bruger/Anders') test", async () => {
        let response = await request(app)
            .get('/bruger/flowtek333')
            .expect(200)
            .expect('Content-Type', /json/);
        response.body.efternavn.should.be.equal('Joachimsen');
    });

    it("post('/bruger') test", async () => {
        let response = await request(app)
            .post('/bruger')
            .send({
                'fornavn': 'Gunner',
                'efternavn': 'Joachimsen',
                'alder': 4, 
                'koen': true,
                'parent1': 'Freddy',
                'parent2': 'Lars',
                'username': 'admin',
                'password': 'admin',
                'aktiv': true,
                'admin': true 
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200);
        response.body.message.should.be.equal('Bruger oprettet!');
    });
});
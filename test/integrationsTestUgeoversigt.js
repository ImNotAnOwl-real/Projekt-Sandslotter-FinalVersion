require('should');
const request = require('supertest');
const controller = require("../controller/controller");
const app = require('../app.js');

describe('integration test - promise', function () {
    it("get('/bruger/Anders') test", async () => {
        let response = await request(app)
            .get('/bruger/fluffi')
            .expect(200)
            .expect('Content-Type', /json/);
        response.body.efternavn.should.be.equal('hej');
    });
    

    it("post('/ugeoversigt/Updates') test", async () => {
        let response = await request(app)
            .post('/ugeoversigt/updates')
            .send({
                    'dag': 'Mandag',
                    'afleveres': '12:15',
                    'hentes': '12:55',
                    'sovetFra': '10:10',
                    'sovetTil': '12:10',
                    'syg': false,
                    'ferie': false,
                    'kommentar': 'Testen virker',
                    'ugeoversigt': '5fc0dc11e6087806c454da99',
                    'barnet': '5fc0dcc1032de02e809a80c7'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200);
        response.body.message.should.be.equal('ugeoversight saved!');
    });

    it("post('/ugeoversigt/opretUger') test", async () => {
        let response = await request(app)
            .post('/ugeoversigt/opretUger')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200);
        response.body.message.should.be.equal('ugerne oprettet!');
        
    });

});
require('should');
const request = require('supertest');
const controller = require("../controller/controller");
const app = require('../app.js');
const { post } = require('../app.js');




describe('Integrations test - tavle', function () {


    it('creaeInfotavle test', async () => {
        let response = await request(app)
            // .post('/loginBruger')
            // .send({ 'username': 'admin', 'password': 'admin' })
            .post('/infotavle')
            .send({ 'tekst': "Hej med dig smukke" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)

            
            console.log(response.body)
            console.log("HEJ")

            //svar.tekst.should.be.equal("Hej med dig smukke");
        });

        it('updateInfotavle test', async () => {
            let tekst = await controller.createInfotavle("Introtekst");
            await controller.updateInfotavle("Ny Tekst");
            tekst = await controller.getTekst()
            tekst.tekst.should.be.equal("Ny Tekst");

        });

        it('getTekst test', async () => {
            let tekst = "Test tekst"
            console.log("Indhold af tekst før metode " + tekst);
            tekst = await controller.getTekst();
            console.log("Indhold af tekst efter metode" + tekst);

        });

    });
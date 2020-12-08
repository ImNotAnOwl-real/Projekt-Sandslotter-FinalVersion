const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    //Getter teksten til infotavlen
    .get('/', async (request, response) => {
        try {
                let tekst = await controller.getTekst();
                response.send((tekst == null ? { tekst: null } : tekst));
            
        } catch (e) {
            sendStatus(e, response);
        }
    })
    //Opretter teksten til infotavlen
    .post('/', async (request, response) => {
        try {
                let { tekst } = request.body;
                await controller.createInfotavle(tekst);
                response.send({ message: 'tekst oprettet!' });
            

        }
        catch (e) {
            sendStatus(e, response);
            console.log(e)
        }
    })
    //Opdaterer teksten til infotavlen
    .post('/update', async (request, response) => {
        try {
            let { tekst } = request.body;
            await controller.updateInfotavle(tekst);
            response.send({ message: 'tekst opdateret!' });

        }
        catch (e) {
            sendStatus(e, response);
            console.log(e)
        }
    })


function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}



module.exports = router
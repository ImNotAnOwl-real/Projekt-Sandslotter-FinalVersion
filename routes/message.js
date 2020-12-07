// company.js
const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

router
    .post('/sendBesked', async (request, response) => {
        try {
            const navn = request.session.username;
            if (navn) {
                let { modtager, besked } = request.body;
                const username = request.session.username;
                var d = new Date();
                var dateD = d.getDate();
                var dateM = d.getMonth() + 1;
                var dateY = d.getFullYear();
                var dateT = d.getUTCHours() + 1 + ":" + (d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes();
                let sendBeskedStatus = await controller.sendBesked(username, modtager, besked, dateD, dateM, dateY, dateT);
                response.json(sendBeskedStatus);
            }
            else {
                //response.redirect('/ingenAdgang.html');
            }

        } catch (e) {
            sendStatus(e, response);
        }
    }
    );
router.get('/brugere', async (request, response) => {
    try {
        const navn = request.session.username;
        if (navn) {
            let brugere = await controller.getBrugere();
            response.send(brugere);
        }
        else {
            //response.redirect('/ingenAdgang.html');
        }
    } catch (e) {
        sendStatus(e, response);
    }


});
router.post('/Beskeder', async (request, response) => {
    try {
        const navn = request.session.username;
        if (navn) {
            let { modtager } = request.body;
            const username = request.session.username;
            let received = await controller.getMessagesReceived(username, modtager);
            let sent = await controller.getMessagesSent(username, modtager);
            let message = received.concat(sent);
            response.json(message);
        }
        else {
            //response.redirect('/ingenAdgang.html');
        }

    } catch (e) {
        sendStatus(e, response);
    }
});



function sendStatus(e, response) {
    console.error("Exception: " + e);
    if (e.stack) console.error(e.stack);
    response.status(500).send(e);
}

module.exports = router;
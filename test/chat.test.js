require('should');
const request = require('supertest');
const controller = require("../controller/controller");
const app = require('../app.js');


describe('Create message - test', function () {

    it("Create message", async () => {
        var d = new Date();
        var dateD = d.getDate();
        var dateM = d.getMonth() + 1;
        var dateY = d.getFullYear();
        var dateT = d.getUTCHours() + 1 + ":" + (d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes();
        let bruger1 = await controller.createBruger('Admin', 'Jensen', 55, true, null, null, 'Admin', 'Admin', true, true);
        let bruger2 = await controller.createBruger('Peter', 'Petersen', 5, true, 'Lise Lotte', 'Jens Ole', 'Bruger', 'Bruger', false, true);
        let message = await controller.sendBesked(bruger1, bruger2, "Hej Peter", dateD, dateM, dateY, dateT);
        message.should.be.equal(true);

    })
});


describe('Get messages receiver - test', function () {

    it("get messages as receiver", async () => {
        var d = new Date();
        var dateD = d.getDate();
        var dateM = d.getMonth() + 1;
        var dateY = d.getFullYear();
        var dateT = d.getUTCHours() + 1 + ":" + (d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes();
        let bruger1 = await controller.createBruger('Admin', 'Jensen', 55, true, null, null, 'Admin', 'Admin', true, true);
        let bruger2 = await controller.createBruger('Peter', 'Petersen', 5, true, 'Lise Lotte', 'Jens Ole', 'Bruger', 'Bruger', false, true);
        let message = await controller.sendBesked(bruger1, bruger2, "Hej Peter", dateD, dateM, dateY, dateT);
        let getMessage = await controller.getMessagesReceived(bruger1.username, bruger2.username);
        getMessage.should.not.be.equal(null);

    });

})

describe('Get messages sent - test', function () {

    it("get mesasges sent", async () => {
        var d = new Date();
        var dateD = d.getDate();
        var dateM = d.getMonth() + 1;
        var dateY = d.getFullYear();
        var dateT = d.getUTCHours() + 1 + ":" + (d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes();
        let bruger1 = await controller.createBruger('Admin', 'Jensen', 55, true, null, null, 'Admin', 'Admin', true, true);
        let bruger2 = await controller.createBruger('Peter', 'Petersen', 5, true, 'Lise Lotte', 'Jens Ole', 'Bruger', 'Bruger', false, true);
        let message = await controller.sendBesked(bruger1, bruger2, "Hej Peter", dateD, dateM, dateY, dateT);
        let getMessage = await controller.getMessagesSent(bruger2.username, bruger1.username);
        getMessage.should.not.be.equal(null);
        console.log(getMessage)

    });

})

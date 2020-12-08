require('should');
const request = require('supertest');
const controller = require("../controller/controller");
const app = require('../app.js');



// Der er krav om at der i forvejen er billeder uploaded til databasen
// Da jeg ikke ved hvordan man henter filstien og Image buffer til testmiljøet
describe('Get all images in db- test', function () {

    it("get all images", async () => {
        let images = await controller.getAllImages();

        images.length.should.be.greaterThanOrEqual(1);
        images.length.should.not.be.belowOrEqual(0);
    })
});


// Der er krav om at der i forvejen er billeder uploaded til databasen
// Da jeg ikke ved hvordan man henter filstien og Image buffer til testmiljøet
describe('Get a specific image by id from db - test', function () {

    it("get image", async () => {
        let images = await controller.getAllImages();
        let billedet = await controller.getImage(images[0]._id);
        billedet.contentType.should.be.equal("image/jpeg");
    });

})

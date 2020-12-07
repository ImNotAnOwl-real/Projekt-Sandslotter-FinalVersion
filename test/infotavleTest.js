it('createInfotavle test', async () => {
    let infotavle = await controller.createInfotavle("Introtekst");
    should.exist(infotavle);
    infotavle.should.be.equal("Introtekst");
})

it('updateInfotavle test', async () => {
    let tekst = await controller.createInfotavle("Introtekst");
    await controller.updateInfotavle("Ny Tekst");
    tekst.should.be.equal("Ny Tekst");

});

it('getTekst test', async () => {
    let tekst = "Test tekst"
    console.log("Indhold af tekst før metode " + tekst);
    tekst = await controller.getTekst();
    console.log("Indhold af tekst efter metode" + tekst);

});
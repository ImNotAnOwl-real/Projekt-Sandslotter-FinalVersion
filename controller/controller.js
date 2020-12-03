const mongoose = require('mongoose');
const config = require('../config');
const ugeoversigt = require('../model/ugeoversigt');
const dag = require('../model/dage');
const brugeren = require('../model/bruger');
const infotable = require('../model/infotavle');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const { databaseURI } = require('../config');
const images = require('../model/image');
const message = require('../model/message');


mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });


exports.createUgeoversigt = async function (ugenr) {
    return ugeoversigt.create({
        ugenr,
    })
};
exports.createDag = async function (Navn, Afleveres, Hentes, Sovetfra, Sovettil, Syg, Ferie, Kommentar) {
    return dag.create({ Navn, Afleveres, Hentes, Sovetfra, Sovettil, Syg, Ferie, Kommentar })
}
exports.getDag = function (id) {
    return dag.findOne().populate('_id').where('navn').eq(id).exec();
}
exports.getDage = function () {
    return dag.find().populate('dage').exec();
}
exports.getUgeoversigtTilOversigten = function (ugenr) {
    return ugeoversigt.findOne().select('dage ugenr').where('ugenr').eq(ugenr).exec();
};
exports.getUgeoversigt = function (ugenr) {
    return ugeoversigt.findOne().select('ugenr').where('ugenr').eq(ugenr).exec();
};
exports.getUgeoversigter = function () {
    return ugeoversigt.find().select('ugenr').exec();
};

exports.createBruger = async function (fornavn, efternavn, alder, koen, parent1, parent2, username, password, aktiv, admin) {
    const saltRounds = 10;
    hashPw = bcrypt.hashSync(password, saltRounds);
    password = hashPw;
    return brugeren.create({ fornavn, efternavn, alder, koen, parent1, parent2, username, password,aktiv, admin })
}

exports.getBrugerFornavn = async function (fornavn) {
    return await brugeren.findOne().select().where('fornavn').eq(fornavn).exec();
};

exports.getDageMandagTilFredag = async function (ugeoversigte, barn) {
    //return await dag.findOne( { ugeoversigter: {objectId: ugeoversigte}})
    return await dag.find().select().where('ugeoversigter').eq(ugeoversigte).where('barn').eq(barn).exec();
    //return await dag.find({$and: [ { ugeoversigter: { ugeoversigte }}, {barn: {barn} }]}).select().exec();
};


exports.getBruger = async function (username) {
    return await brugeren.findOne().select().where('username').eq(username).exec();
};
exports.getBoernene = function () {
    return brugeren.find().select().exec();
};
exports.deleteBruger = async function (barnId) {
    return brugeren.deleteOne().where('_id').equals(barnId).exec();
};
exports.connectDagTilUge = async function (dage, ugeoversigter) {
    mongoose.set('useFindAndModify', false);
    await dag.findOneAndUpdate({ _id: dage._id }, { ugeoversigter: ugeoversigter._id })

    await ugeoversigt.findOneAndUpdate({ _id: ugeoversigter._id }, { $push: { dage: dage } })
}

exports.connectDagTilBruger = async function (dage, bruger) {
    mongoose.set('useFindAndModify', false);
    console.log(bruger._id + "JEG ER BRUGEREN DER OOPDATERS " + bruger.username)
    await dag.findOneAndUpdate({ _id: dage._id }, { barn: bruger })
    await brugeren.findOneAndUpdate({ _id: bruger._id }, { $push: { dage: dage } })
}

exports.updateProfil = async function (fornavn, efternavn, alder, koen, parent1, parent2,aktiv, username) {
    mongoose.set('useFindAndModify', false);
    console.log(username)
    let c1 = await brugeren.findOneAndUpdate({ username: username }, { fornavn: fornavn, efternavn: efternavn, alder: alder, koen: koen, parent1: parent1, parent2: parent2, aktiv:aktiv })
    console.log(c1 + "Der sker noget her")
}

exports.updateOversigt = async function (dage, afleveres, hentes, sovetFra, sovetTil, syg, ferie, kommentar, ugeoversigt, barnet) {
    mongoose.set('useFindAndModify', false);
    console.log(await dag.findOneAndUpdate({ $and: [{ Navn: dage }, { ugeoversigter: ugeoversigt }, { barn: barnet }] }, { Afleveres: afleveres, Hentes: hentes, Sovetfra: sovetFra, Sovettil: sovetTil, Syg: syg, Ferie: ferie, Kommentar: kommentar }) + "Her modifies det")
}

async function getBruger(brugernavn) {
    return brugeren.findOne().select().where('username').eq(brugernavn).exec();
}

exports.brugerVerificiering = async function (brugernavn, pw) {
    let user = await getBruger(brugernavn);
    if (user.username !== null || user.username !== undefined) {
        let pwstatus = bcrypt.compareSync(pw, user.password);
        if (pwstatus === true) {
            return true;
        } else {
            return false;
        }
    }
}

exports.getTekst = async function () {
    return infotable.findOne().select().exec();
}
exports.createInfotavle = async function (tekst) {
    return infotable.create({
        title: "nr1",
        tekst,
    })
};

exports.updateInfotavle = async function (tekst) {
    mongoose.set('useFindAndModify', false);
    console.log(await infotable.findOneAndUpdate({ title:"nr1" }, { tekst: tekst
        
    }))
};
exports.createImage = async function (contentType, image, day, month, year){
    return images.create({contentType, image, day, month, year})
}

exports.getImage = function (id){
    return images.findOne().select().where('_id').eq(id).exec();
}

exports.getImageData = function (){
    return images.find({});
}


exports.getAllImages = function(){
    return images.find().select('_id').exec();
}

exports.getMessagesReceived = async function (username, afsender){
    return await message.find({modtager: username, afsender: afsender}).exec();
}
exports.getMessagesSent = async function (username, afsender){
    return await message.find({modtager: afsender, afsender: username}).exec();

}



async function createMessage(afsender, modtager, besked, day, month, year, time){
    const saltRounds = 10;
    // let dato = Date.now();
  
    // hashAfsender = bcrypt.hashSync(afsenderId, saltRounds);
    // afsenderId = hashAfsender;
    // hashModtager = bcrypt.hashSync(modtagerId, saltRounds);
    // modtagerId = hashModtager;
    // hashBesked = bcrypt.hashSync(besked, saltRounds);
    // besked = hashBesked;
    // hashEmne = bcrypt.hashSync(emne, saltRounds);
    // emne = hashEmne;
    return await message.create({ afsender, modtager, besked, day, month, year, time })
}


exports.sendBesked = async function (afsender, modtager, besked, day, month, year, time){
    // let modtagerId = await getBruger(modtager);
    // let afsenderId = await getBruger(afsender);
    let opretBesked = await createMessage(afsender, modtager, besked, day, month, year, time);
        if(opretBesked.afsender !== null || opretBesked.afsender !== undefined && opretBesked.modtager !== null || opretBesked.modtager !== undefined 
             && opretBesked.besked !== null || opretBesked.besked !== undefined){
                // && opretBesked.emne !== null || opretBesked.emne !== undefined
        return true;
    } else {
        return false;
    }
    }
    exports.getBrugere = async function () {
        // return brugeren.find({});
        return brugeren.find().select('username').exec();
    };

    
//-- TIL TEST AF STATISTIK --

function getUgeoversigt(ugenr) {
    return ugeoversigt.findOne().select('ugenr').where('ugenr').eq(ugenr).exec();
};

function getDagTilUgeoversigtOgBarn(ugeoversigt, barn){
    // return dag.find().populate('dage').where('ugeoversigter & barn').eq(ugeoversigt, barn).exec()
    return dag.find().populate('dage').where('ugeoversigter').eq(ugeoversigt).where('barn').eq(barn).exec()
}

function getBoernene() {
    return brugeren.find().select('fornavn').exec();
};

exports.antalSygedage = async function (ugeFra, ugeTil, barn) {
    let antaldage = 0;
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await getUgeoversigt(i)
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, barn);
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == true) {
                antaldage++;
            }
        }
    }
    return antaldage
}

exports.ferieoversigtAlleBørn = async function(uge) {
    let ugeoversigt = await getUgeoversigt(uge)
    let count = 0
    let børn = await getBoernene()
    for (let j = 0; j < børn.length; j++) {
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, børn[j]['_id']);
        for (let k = 0; k < dagTilbrugerOgOversigt.length; k++) {
            if (dagTilbrugerOgOversigt[k]['Ferie'] == true) {
                count++
            }
        }
    }
    return count
}

exports.gennemsnitligSøvnPrDag = async function(ugeFra, ugeTil, barn) {
    let timer = []
    let minutter = []
    let res = []
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await getUgeoversigt(i)
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, barn);
        let timerIdagpleje = 0;
        let minIdagpleje = 0;
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == false && dagTilbrugerOgOversigt[j]['Ferie'] == false) {
                let sovetFra = dagTilbrugerOgOversigt[j]['Sovetfra']
                let sovetTil = dagTilbrugerOgOversigt[j]['Sovettil']
                console.log(sovetFra + ' : ' + sovetTil)
                sovetFra = sovetFra.split(':')
                sovetTil = sovetTil.split(':')
                let start = new Date(0, 0, 0, sovetFra[0], sovetFra[1], 0)
                let slut = new Date(0, 0, 0, sovetTil[0], sovetTil[1], 0)
                let diff = slut.getTime() - start.getTime()
                timerIdagpleje = Math.floor(diff / 1000 / 60 / 60)
                timer.push(timerIdagpleje)
                diff -= timerIdagpleje * 1000 * 60 * 60
                minIdagpleje = Math.floor(diff / 1000 / 60)
                minutter.push(minIdagpleje)
            }
        }
    }
    let gennemsnitTimer = 0
    let gennemsnitMin = 0
    for (let i = 0; i < timer.length; i++) {
        gennemsnitTimer += timer[i]
        gennemsnitMin += minutter[i]
    }
    gennemsnitTimer /= timer.length
    gennemsnitMin /= minutter.length
    if (gennemsnitTimer != Math.floor(gennemsnitTimer)) {
        gennemsnitMin = (gennemsnitTimer - Math.floor(gennemsnitTimer)) * 60
        gennemsnitTimer = Math.floor(gennemsnitTimer)
    }
    res.push(gennemsnitTimer)
    res.push(gennemsnitMin)
    return res
}

exports.gennemsnitligUgentligTilstedeværelse = async function(ugeFra, ugeTil, barn) {
    let res = []
    let timer = []
    let minutter = []
    for (i = ugeFra; i <= ugeTil; i++) {
        let ugeoversigt = await getUgeoversigt(i)
        let dagTilbrugerOgOversigt = await getDagTilUgeoversigtOgBarn(ugeoversigt._id, barn);
        let timerIdagpleje = 0;
        let minIdagpleje = 0;
        for (let j = 0; j < dagTilbrugerOgOversigt.length; j++) {
            if (dagTilbrugerOgOversigt[j]['Syg'] == false && dagTilbrugerOgOversigt[j]['Ferie'] == false) {
                let afleveres = dagTilbrugerOgOversigt[j]['Afleveres']
                let hentes = dagTilbrugerOgOversigt[j]['Hentes']
                afleveres = afleveres.split(':')
                hentes = hentes.split(':')
                let start = new Date(0, 0, 0, afleveres[0], afleveres[1], 0)
                let slut = new Date(0, 0, 0, hentes[0], hentes[1], 0)
                let diff = slut.getTime() - start.getTime()
                timerIdagpleje = Math.floor(diff / 1000 / 60 / 60)
                timer.push(timerIdagpleje)
                diff -= timerIdagpleje * 1000 * 60 * 60
                minIdagpleje = Math.floor(diff / 1000 / 60)
                minutter.push(minIdagpleje)
            }
        }
    }
    let gennemsnitTimer = 0
    let gennemsnitMin = 0
    for (let i = 0; i < timer.length; i++) {
        gennemsnitTimer += timer[i]
        gennemsnitMin += minutter[i]
    }
    gennemsnitTimer /= ((ugeTil - ugeFra) + 1)
    gennemsnitMin /= ((ugeTil - ugeFra) + 1)
    if (gennemsnitTimer != Math.floor(gennemsnitTimer)) {
        gennemsnitMin = (gennemsnitTimer - Math.floor(gennemsnitTimer)) * 60
        gennemsnitTimer = Math.floor(gennemsnitTimer)
    }
    if(gennemsnitMin > 59){
        gennemsnitTimer += (Math.floor(gennemsnitMin/60))
        gennemsnitMin = ((gennemsnitMin/60)/10)*60
    }
    console.log(gennemsnitTimer)
    res.push(gennemsnitTimer)
    res.push(gennemsnitMin)
    return res
}

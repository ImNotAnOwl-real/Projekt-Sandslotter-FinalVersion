const controller = require("../controller/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs')


const multer = require('multer');
// SET STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../app/uploads')
    },
    filename: (req, file, cb) => {
        let a = file.originalname.split('.')
        cb(null, `${file.fieldname}-${Date.now()}.${a[a.length - 1]}`)
    }
})

const upload = multer({ storage: storage })


router.post('/uploadimage', upload.single('image'), async (req, res) => {
    try {
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString('base64');
        // Define a JSONobject for the image attributes for saving to database

        var d = new Date();
        var dateD = d.getDate();

        if (dateD < 10) {
            dateD = "0" + dateD.toString();

        }
        var dateM = d.getMonth() + 1;
        var dateY = d.getFullYear();
        await controller.createImage(req.file.mimetype, new Buffer.from(encode_image, 'base64'), dateD, dateM, dateY);
        console.log('Saved to database');
        res.redirect('/galleri.html');
    } catch (e) {
        console.error(e)
    }


})

// Get all images
router.get('/images', async (req, res) => {
    try {
        const navn = request.session.username;
        if (navn) {
            let imgArray = await controller.getAllImages();
            res.send(imgArray);
        }
        else {
            //response.redirect('/ingenAdgang.html');
        }
    } catch (e) {
        console.error(e)
    }

});

router.get('/', async (req, res) => {
    try {
        const navn = request.session.username;
        if (navn) {
            let img = await controller.getImageData();
            res.send(img);
        }
        else {
            //response.redirect('/ingenAdgang.html');
        }
    } catch (e) {
        console.error(e)
    }

});

// // Get image by id
router.get('/:id', async (req, res) => {
    var id = req.params.id;
    try {
        const navn = request.session.username;
        if (navn) {
            let img = await controller.getImage(id);
            res.contentType('image/jpeg');
            res.send(img.image);
        }
        else {
            //response.redirect('/ingenAdgang.html');
        }
    } catch (e) {
        console.error(e)
    }
})
module.exports = router;
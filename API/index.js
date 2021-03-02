//dependencies
const express = require('express');
const ts = require('tesseract.js');
const sharp = require('sharp');
var cors = require('cors');
const multer = require('multer');
const fs = require("fs");

const PATH = './uploads';

const storage = multer.diskStorage({
    destination:(req, file, cb)=> {
        cb(null, './uploads/');
    },
    filename:(req, file, cb)=> {
        cb(null, "output")
    }
})

let upload = multer({
    storage: storage
  });

const app = express();

app.use(express.json({limit: "50mb"}));
app.use(cors());

app.get('/api', function (req, res) {
    res.end('File catcher');
});

app.post('/api/upload', upload.single('image'), (req, res)=>{

    // use tesseract ocr library to perform ocr
    try {
        ts.recognize(
            'uploads/' + req.file.filename,
            'eng',
            { logger: m=> console.log(m.progress * 100 + '%') }
        ).then(({data: {text}})=>{
        //    display results
            return res.json(
               {
               message:text
            }
        ) 
    })
    }catch(error) {
        console.log(error);
    }
})

app.post('/api/screenshot', (req, res)=>{
    const buffer = Buffer.from(req.body.base64, "base64");
    fs.writeFileSync("output.jpeg", buffer);

    try {
        ts.recognize(
             buffer,
            'eng',
            { logger: m=> console.log(m.progress * 100 + '%') }
        ).then(({data: {text}})=>{
        //    display results
            return res.json(
               {
               message:text
            }
        ) 
    })
    }catch(error) {
        console.log(error);
    }
})

app.listen(4000, ()=> {
    console.log('server is up, port 4000');
});
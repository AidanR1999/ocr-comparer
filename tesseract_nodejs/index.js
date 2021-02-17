const ts = require ('tesseract.js');
const fs = require('fs');

const unalteredDir = "E:/repos/ocr_comparer/tests/unaltered/"
const extension = ".tif"

var unaltered = fs.readdirSync(unalteredDir);

readImg(unalteredDir + unaltered[0], 0);

function readImg(img, i) {
    try {
        ts.recognize(
            img,
            'eng',
            { logger: m=> console.log(m.progress) }
        ).then(({data: {text}})=>{
            console.log('done');
            readImg(unalteredDir + unaltered[i + 1], i + 1);
    })
    }
    catch(error) {
        console.log(error);
    }
}
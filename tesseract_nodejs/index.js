//libraries
const ts = require ('tesseract.js');
const fs = require('fs');

//absolute directory for images and results
const unalteredDir = "../tests/img/"
const resultsDir = "../results/tesseract/"

//read all image filenames
var unaltered = fs.readdirSync(unalteredDir);

//run function loop 
readImg(unalteredDir + unaltered[0], 0);

//runs engine, params: img path, iteration
function readImg(img, i) {
    try {
        //run ocr engine params: img path, language, logging function
        ts.recognize(
            img,
            'eng',
            //log progress to console
            { logger: m=> console.log(m.progress * 100 + '%') }
        //run on completion
        ).then(({data: {text}})=>{
            console.log('done' + img);

            //log results to file params: path, text, callback
            fs.writeFile(resultsDir + unaltered[i] + '.txt', text, (err) => {
                if (err) throw err;
                console.log('logged');
            });

            //loop
            readImg(unalteredDir + unaltered[i + 1], i + 1);
    })
    }
    catch(error) {
        console.log(error);
    }
}
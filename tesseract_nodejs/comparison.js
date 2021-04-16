const { execFile } = require('child_process');
const fs = require('fs');

//load files
const originalsDir = "../tests/txt/"
const engineResultsDir = "../results/tesseract/"

var originals = fs.readdirSync(originalsDir);
var engineResults = fs.readdirSync(engineResultsDir);

for(const txt of engineResults) {

    let engineWordCount = {}
    let originalWordCount = {}

    let originalTxt = txt.replace(/.tif/, "")

    //get file contents
    var engineFile = fs.readFile(engineResultsDir + txt, (err, data) => {
        engineWordCount = countWords(data.toString());

        var originalFile = fs.readFile(originalsDir + originalTxt, (err, data) => {
            originalWordCount = countWords(data.toString());

            fs.appendFile('results.txt', txt + ' ' + compare(engineWordCount, originalWordCount).toString() + "\n", (err) => {
                if (err) throw err;
                console.log('logged');
            });
        }); 
    });
}


function compare(engineWordCount, originalWordCount) {
    var differences = [];
    var matches = [];
    for(const word in engineWordCount) {
        if(originalWordCount.hasOwnProperty(word)) {
            //get word occurences
            var engineOcc = engineWordCount[word];
            var originalOcc = originalWordCount[word];

            //compare
            if(engineOcc == originalOcc) {
                matches.push(word);
            }
        }
        //if not, add to differences
        else{
            differences.push(word);
        }
    }
    
    var num = 0;
    for(const word in originalWordCount) {
        num++;
    }

    return (matches.length / num) * 100;
}

function countWords(sentence) {
    var index = [],
        words = sentence
                .replace(/[.,?!;()"“”’'~-]/g, " ")
                .replace(/\s+/g, " ")
                .toLowerCase()
                .split(" ");
  
      words.forEach(function (word) {
          if (!(index.hasOwnProperty(word))) {
              index[word] = 0;
          }
          index[word]++;
      });
  
      return index;
  }
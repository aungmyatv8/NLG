const myForm = document.getElementById("myForm");



const csvFile = document.getElementById("csvFile");
const csvError = document.getElementById("csv-error");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = csvFile.files[0];
  
  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //     const text = e.target.result;
  //     // document.write(text);
  //     // data = text;
  //     var arr = text.split('\n');
  //     console.log(arr)

  //   };
  //   reader.readAsArrayBuffer(input)
  Papa.parse(input, {
    header: true,
    complete: function (results) {
       
        try {
            if(results.data[0].time !== undefined) {
                csvError.style.display = "none"
                // console.log("not formated", true)
                beginner(results.data)
            }
          
        }catch(e) {
            console.error(e)
            csvError.style.display = "block"
        }
    },
  });
});

// ******************************** Beginner ********************************************************
function checkIsTime(time) {
    var doc = nlp(time);
    const tag = doc.out("tags")
    const type = tag[0]
    // Numeric Value == year (in)
    // Month == month (in)
    // Date == date (on)
    // : == time (at) 
    // console.log("t", Object.values(type)[0])
    if(time.includes(":")){
        return "at"
    }

    if(Object.values(type)[0].includes("Month" || Object.values(type)[0].includes("Numeric Value"))) {
        return "in"
    } else if(Object.values(type)[0].includes("Date")) {
        return "on"
    } else {
        return "in"
    }

   

}

function titleSplit(title) {
    return title.split(" ")
}

function checkIncreaseOrDecrease(first, second, level) {

    if(first < second) {
        //  decrease
        return randomChoice(generateWordsBasedonLevel(level, false))
    } else {
        // increase
        return randomChoice(generateWordsBasedonLevel(level, true))
    }
} 

function generateWordsBasedonLevel(level, isIncrease) {
    switch(level) {
        case "beginner": 
           return isIncrease ? ["increase"] : ["decrease"]
        default:
            return isIncrease ? ["increase"] : ["decrease"]
    }

}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}


// data, title
function beginner(data, title = "The price of bananas") {
    const text = "";
    // let prep = "";
    const splitedTitle = titleSplit(title)
    let prep = checkIsTime(data[0].time)

}


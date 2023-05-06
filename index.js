const myForm = document.getElementById("myForm");

const csvFile = document.getElementById("csvFile");
const csvError = document.getElementById("csv-error");
const answer = document.getElementById("answer")

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
        if (results.data[0].time !== undefined) {
          csvError.style.display = "none";
          // console.log("not formated", true)
          beginner(results.data);
        }
      } catch (e) {
        console.error(e);
        csvError.style.display = "block";
      }
    },
  });
});

// ******************************** Beginner ********************************************************
function checkIsTime(time) {
  var doc = nlp(time);
  const tag = doc.out("tags");
  const type = tag[0];
  // Numeric Value == year (in)
  // Month == month (in)
  // Date == date (on)
  // : == time (at)
  // console.log("t", Object.values(type)[0])
  if (time.includes(":")) {
    return "at";
  }

  if (
    Object.values(type)[0].includes(
      "Month" || Object.values(type)[0].includes("Numeric Value")
    )
  ) {
    return "in";
  } else if (Object.values(type)[0].includes("Date")) {
    return "on";
  } else {
    return "in";
  }
}

function titleSplit(title) {
  return title.split(" ");
}

function checkIncreaseOrDecrease(first, second, level) {
  if (parseInt(first) < parseInt(second)) {
    //  decrease
    return randomChoice(generateWordsBasedonLevel(level, true));
  } else {
    // increase
    return randomChoice(generateWordsBasedonLevel(level, false));
  }
}

function generateWordsBasedonLevel(level, isIncrease) {
  console.log("isIncrease", isIncrease);
  switch (level) {
    case "beginner":
      return isIncrease ? ["increase", "climb"] : ["decrease"];
    default:
      return isIncrease ? ["increase", "climb"] : ["decrease"];
  }
}

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

// data, title
function beginner(data, title = "The price of bananas") {
  var text = "";
  // let prep = "";
  const splitedTitle = titleSplit(title);
  let same = [];


  let prep = checkIsTime(data[0].time);

  data.forEach((val, index) => {
    if (index === 0) {
      text += `${prep[0].toUpperCase() + prep.substring(1)} ${val.time}, The ${
        splitedTitle[1]
      } of ${splitedTitle[splitedTitle.length - 1]} was ${val.value}.`;
    }
    if (same.length !== 0 && same[same.length - 1].value !== val.value) {
      // remain
    //   console.log("remain", val.time, val.value);
        console.log("same", index, same)
      text += `The ${splitedTitle[1]} remained ${same[0].value} until ${same[same.length - 1].time}. `;
      same = [];
    }

    if (index >= 1) {

        if(data[index - 1].value === val.value) {
            if(same.length === 0) {
                same.push(data[index - 1])
            }
            same.push(val)
        } else {
            const directionWord = checkIncreaseOrDecrease(
                data[index - 1].value,
                val.value,
                "beginner"
              );

              const pastTenseDirection = nlp(directionWord)
                .verbs()
                .toPastTense()
                .all()
                .text();
              text += `The ${splitedTitle[1]} ${pastTenseDirection} from ${data[index - 1].value} to ${val.value} ${prep} ${val.time}. `;
        }
     
    }

    // console.log(`The ${splitedTitle[1]} of ${splitedTitle[splitedTitle.length - 1]} was ${val.value}`)
  });
  answer.textContent = text;
  console.log(text);
}

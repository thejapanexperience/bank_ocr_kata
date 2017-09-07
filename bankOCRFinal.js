// Shapes Reference for converting to numbers
const ref = {
  " _ | ||_|": 0,
  "     |  |": 1,
  " _  _||_ ": 2,
  " _  _| _|": 3,
  "   |_|  |": 4,
  " _ |_  _|": 5,
  " _ |_ |_|": 6,
  " _   |  |": 7,
  " _ |_||_|": 8,
  " _ |_| _|": 9,
}

const refKeys = Object.keys(ref)

ocr = function(input) {
  console.log('input: ', input);
  let answer1 = userStory1(input) // [ finalnumber, numBits]
  console.log('answer1: Digits - ', answer1[0]);
  let answer2 = userStory2(answer1[0]) // [num, check]
  console.log('answer2: Pass checksum - ', answer2[1]);
  let answer3 = userStory3(answer2[0], answer2[1]) // annotatedAnswer
  console.log('answer3: Annotated answer - ', answer3);
  let finalAnswer
  if (answer3.length > 9) {
    answer4 = userStory4(answer1[0], answer1[1], answer3)
    console.log('answer4: Alternates that pass checksum - ', answer4[1]);
    finalAnswer = answer4[0]
  } else {
    finalAnswer = answer3
  }
  console.log('Final Answer: ', finalAnswer);
}

// Converts to digits
userStory1 = function(input) {

  let numBits = {
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    seven: [],
    eight: [],
    nine: []
  }


  // Standardise the inputs to a fixed length for each line
  originArr = input.split("\n")
  arr = originArr.map((innerArr) => {
    return innerArr.split("")
  })

  if (arr[1].length === 0) {
    let temp = []
    for (var i = 0; i < 27; i++) {
      temp.push(" ")
    }
    arr[1] = temp
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].length < 1) {
      arr.splice(i, 1)
    }
  }

  for (var i = 0; i < arr.length; i++) {
    while (arr[i].length !== 27) {
      arr[i].push(" ")
    }
  }

  // Add each character to the numBits object to get all 9 parts of the number
  let keys = Object.keys(numBits)

  let k = 0
  for (var i = 0; i < arr[0].length; i += 3) {
    numBits[keys[k]].push(arr[0][i], arr[0][i + 1], arr[0][i + 2])
    k += 1
  }
  k = 0
  for (var i = 0; i < 27; i += 3) {
    numBits[keys[k]].push(arr[1][i], arr[1][i + 1], arr[1][i + 2])
    k += 1
  }
  k = 0
  for (var i = 0; i < 27; i += 3) {
    numBits[keys[k]].push(arr[2][i], arr[2][i + 1], arr[2][i + 2])
    k += 1
  }

  // Reference the ref to get the correct digit
  let temp = []
  keys.forEach(key => {
    refStr = numBits[key].join("")
    if (refStr in ref) {
      temp.push(ref[refStr])
    } else {
      temp.push("?")
    }
  })

  let finalNumber = temp.join("")

  return [finalNumber, numBits]

}

// Check against the checksum : (d1+2*d2+3*d3 +..+9*d9) mod 11 = 0
userStory2 = function(num) {

  reversedArrStr = num.split("").reverse()
  reversedArr = reversedArrStr.map(str => {
    return Number(str)
  })
  let check = false
  let checkSum = reversedArr[0]
  for (var i = 1; i < reversedArr.length; i++) {
    checkSum += ((i + 1) * reversedArr[i])
  }
  if (checkSum % 11 === 0) {
    check = true
  }
  return [num, check]

}

// Append to num if ERR or ILL
userStory3 = function(str, check) {
  num = Number(str)
  if (check) {
    return `${str}`
  } else if (num && !check) {
    return `${str} ERR`
  } else {
    return `${str} ILL`
  }
}

// Run through possible variations to see if incorrect scanning
userStory4 = function(num, bits, original) {
  let numArr = num.split("")
  let bitsArr = []
  let possibles = []
  let keys = Object.keys(bits)
  keys.forEach(key => {
    bitsArr.push(bits[key])
  })
  bitsArr.forEach((arr, k) => {
    arr.forEach((char, i) => {
      let temp = []

      // Check with each possible change of character
      for (var j = 0; j < 3; j++) {

        // Logic for checking new variant and push to possibles array if passes the checksum
        userStory4InnerFunction = function(temp) {
          let tempStr = temp.join("")
          if (tempStr in ref) {
            let newNumArr = [...numArr]
            newNumArr.splice(k, 1, ref[tempStr])
            let answer2 = userStory2(newNumArr.join("")) // [num, check]
            let answer3 = userStory3(answer2[0], answer2[1]) // annotatedAnswer
            if (answer3.length === 9) {
              possibles.push(answer3)
            }
          }
        }

        if (j === 0) {
          temp = [...arr]
          temp.splice(i, 1, "|")
          userStory4InnerFunction(temp)
        } else if (j === 1) {
          temp = [...arr]
          temp.splice(i, 1, "_")
          userStory4InnerFunction(temp)
        } else {
          temp = [...arr]
          temp.splice(i, 1, " ")
          userStory4InnerFunction(temp)
        }

      }
    })
  })
  if (possibles.length === 0) {
    return [original, possibles]
  } else if (possibles.length === 1) {
    return [possibles[0], possibles]
  } else {
    return [`${num} AMB [${possibles}]`, possibles]
  }
}

const test1 = `
 _  _  _  _  _  _  _  _  _
| || || || || || || || || |
|_||_||_||_||_||_||_||_||_|
`
const test2 = `

  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |
`
const test3 = `
 _  _  _  _  _  _  _  _  _
 _| _| _| _| _| _| _| _| _|
|_ |_ |_ |_ |_ |_ |_ |_ |_
`
const test4 = `
 _  _  _  _  _  _  _  _  _
 _| _| _| _| _| _| _| _| _|
 _| _| _| _| _| _| _| _| _|
`

const test5 = `
    _  _     _  _  _  _  _
  | _| _||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|
`

const test6 = `
    _  _  _  _  _  _     _
|_||_|| || ||_   |  |  | _
  | _||_||_||_|  |  |  | _|
`

const test7 = `
 _  _  _  _  _  _  _  _  _
|_||_||_||_||_||_||_||_||_|
|_||_||_||_||_||_||_||_||_|
`

const test8 = [`

  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |
`, `
 _  _  _  _  _  _  _  _  _
  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |
`, `
 _  _  _  _  _  _  _  _  _
 _|| || || || || || || || |
|_ |_||_||_||_||_||_||_||_|
`, `
 _  _  _  _  _  _  _  _  _
 _| _| _| _| _| _| _| _| _|
 _| _| _| _| _| _| _| _| _|
`, `
 _  _  _  _  _  _  _  _  _
|_||_||_||_||_||_||_||_||_|
|_||_||_||_||_||_||_||_||_|
`, `
 _  _  _  _  _  _  _  _  _
|_ |_ |_ |_ |_ |_ |_ |_ |_
 _| _| _| _| _| _| _| _| _|
`, `
 _  _  _  _  _  _  _  _  _
|_ |_ |_ |_ |_ |_ |_ |_ |_
|_||_||_||_||_||_||_||_||_|
`, `
 _  _  _  _  _  _  _  _  _
|_||_||_||_||_||_||_||_||_|
 _| _| _| _| _| _| _| _| _|
`, `
    _  _  _  _  _  _     _
|_||_|| || ||_   |  |  ||_
  | _||_||_||_|  |  |  | _|
`, `
    _  _     _  _  _  _  _
 _| _| _||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|
`, `
 _     _  _  _  _  _  _
| || || || || || || ||_   |
|_||_||_||_||_||_||_| _|  |
`, `
    _  _  _  _  _  _     _
|_||_|| ||_||_   |  |  | _
  | _||_||_||_|  |  |  | _|
`]

ocr(test1)
ocr(test2)
ocr(test3)
ocr(test4)
ocr(test5)
ocr(test6)
ocr(test7)

test8.forEach(test => {
  ocr(test)
})

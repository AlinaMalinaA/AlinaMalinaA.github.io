let cellIDs = ["00", "01", "02", "03", "10", "11", "12", "13", "20", "21", "22", "23", "30", "31", "32", "33"]

function getWinningCell(line, isHorizontal, i, isDiagonal) {
	// find line with 1 missing element
	// add selected element to the line
	// check if winning this way
	let localLine = line.slice()
	let missingCell = []
	for (let j=0; j < 4; j++) {
		if (localLine[j]== "") {
			if (isHorizontal)
				missingCell.push(i+""+j)
			else {
				if (isDiagonal) {
					missingCell.push(i[j])
				}
				else {
					missingCell.push(j+""+i)
				}
			}
		}
	}
	if (missingCell.length == 1) {
		if (isHorizontal)
			localLine[missingCell[0][1]] = chosenID
		else {
			if (isDiagonal)
				localLine[missingCell[0][1]] = chosenID
			else
				localLine[missingCell[0][0]] = chosenID
		}
		if (isWinningLine(localLine)) {
			return missingCell[0]
		}
	}
}

function aiGetCell(forceEasy) {
	if (easy||forceEasy) {
		let used = true
		let randomCellID;
		while (used) {
			randomCellID = cellIDs[Math.floor(Math.random()*cellIDs.length)];
			used = usedCells.indexOf(randomCellID) > -1
		}
		return randomCellID
	}
	else {
		// horizontal
		let line;
		for (let i=0; i < 4; i++) {
			line = board[i]
			let cell = getWinningCell(line, true, i)
			if (cell) return cell
		}
		// vertical
		line = []
		for (let i=0; i < 4; i++) {
			for (let j=0; j < 4; j++) {
				line.push(board[j][i])
			}
			let cell = getWinningCell(line, false, i)
			if (cell) return cell
			line = []
		}
		// diagonal "/"
		line = [board[0][3], board[1][2], board[2][1], board[3][0]]
		let cell = getWinningCell(line, false, ["03", "12", "21", "30"], true)
		if (cell) return cell
		// diagonal "\"
		line = [board[0][0], board[1][1], board[2][2], board[3][3]]
		cell = getWinningCell(line, false, ["00", "11", "22", "33"], true)
		if (cell) return cell
		return aiGetCell(true)
	}
}

function checkIfOneMissing(line) {
	return line.filter(i => i == "").length == 1
}

function aiGetPiece(forceEasy) {
	if (easy||forceEasy) {
		let children = document.getElementById("stack").childNodes
		let randomImage = children[Math.floor(Math.random()*children.length)];
		let isValid = randomImage.nodeName == "IMG"
		while (! isValid) {
			randomImage = children[Math.floor(Math.random()*children.length)];
			isValid = randomImage.nodeName == "IMG"
		}
		return randomImage
	}
	else {

		// find the lines with one piece missing
		// find their common characteristics
		// if there are common characteristics, select the piecethat doesn't have them

		let lines = []
		//vertical
		for (let i=0; i < 4; i++) {
			if (checkIfOneMissing(board[i]))
				lines.push(board[i])
			let line = []
			for (let j=0; j < 4; j++) {
				line.push(board[j][i])
			}
			if (checkIfOneMissing(line))
				lines.push(line)
		}
		if (checkIfOneMissing([board[0][3], board[1][2], board[2][1], board[3][0]]))
			lines.push([board[0][3], board[1][2], board[2][1], board[3][0]])
		if (checkIfOneMissing([board[0][0], board[1][1], board[2][2], board[3][3]]))
			lines.push([board[0][0], board[1][1], board[2][2], board[3][3]])
		let chars = getCommonCharacteristics(lines)
		if (chars.length > 0) {
			let imageID = getImageIDByChars(chars)
			if (imageID)
				return imageID

		}
	}
	return aiGetPiece(true)
}

function getCommonCharacteristics(lines) {
	// long / short
	// black / white
	// hollow / full
	// square / circle
	let resultArray = []
	let result = {
		"long": 0,
		"short": 0,
		"black": 0,
		"white": 0,
		"hollow": 0,
		"full": 0,
		"square": 0,
		"circle": 0
	}
	for (let line of lines) {
		for (let elem of line) {
			if (elem != "") {
				if (elem[0] == 0) result["long"] += 1
				if (elem[0] == 1) result["short"] += 1
				if (elem[1] == 0) result["black"] += 1
				if (elem[1] == 1) result["white"] += 1
				if (elem[2] == 0) result["hollow"] += 1
				if (elem[2] == 1) result["full"] += 1
				if (elem[3] == 0) result["square"] += 1
				if (elem[3] == 1) result["circle"] += 1
			}
		}
		for (let [key, value] of Object.entries(result)) {
			if (value == 3)
				resultArray.push(key)
		}
		result = {
			"long": 0,
			"short": 0,
			"black": 0,
			"white": 0,
			"hollow": 0,
			"full": 0,
			"square": 0,
			"circle": 0
		}
	}
	return resultArray
}

function getImageIDByChars(chars) {
	let map = {
		"long": 	["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111"],
		"short": 	["1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"],
		"black": 	["0000", "0001", "0010", "0011", "1000", "1001", "1010", "1011"],
		"white": 	["0100", "0101", "0110", "0111", "1100", "1101", "1110", "1111"],
		"hollow": 	["0000", "0001", "0100", "0101", "1000", "1001", "1100", "1101"],
		"full": 	["0010", "0011", "0110", "0111", "1010", "1011", "1110", "1111"],
		"square": 	["0000", "0010", "0100", "0110", "1000", "1010", "1100", "1110"],
		"circle": 	["0001", "0011", "0101", "0111", "1001", "1011", "1101", "1111"],
	}

	let children = document.getElementById("stack").childNodes
	for (let child of children) {
		if (child.nodeName != "BR") {
			let valid = true;
			for (let elChar of chars) {
				if (map[elChar].indexOf(child.id) > -1) {valid = false; break;}
			}
			if (valid) return child
		}
	}
}


async function aiTurn() {
	document.getElementById("turn").innerHTML = "<h3>AI plays with the selected piece.</h3>";

	let cellID = aiGetCell();

	usedCells.push(cellID);
	await new Promise(r => setTimeout(r, 1000));

	document.getElementById("chosen").innerHTML = "";
	document.getElementById(cellID).append(chosenObj)
	board[cellID[0]][cellID[1]] = chosenObj.id
	chosenObj = null;
	chosenID = null;
	finish = await check(true)
	if (finish) return
	document.getElementById("turn").innerHTML = "<h3>AI selects a piece for you to play with.</h3>";


	chosenObj = aiGetPiece();
	chosenID = chosenObj.id;
	await new Promise(r => setTimeout(r, 1000));
	chosenObj.remove();
	document.getElementById("chosen").innerHTML = "";
	document.getElementById("chosen").append(chosenObj)
	document.getElementById("turn").innerHTML = "<h3>You play with the selected piece.</h3>";
}

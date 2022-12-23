// This javascript code will generate a random password for the user based off of their approved criteria.

// Assignment code here
var generateBtn = document.querySelector("#generate");
// global password length set to 0 initially.

// Write password to the #password input
function writePassword() {
	var password = generatePassword();
	var passwordText = document.querySelector("#password");
	passwordText.value = password;
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);

function generatePassword() {
	var passwordLength = 0;
	// Objects for criteria. All criteria prompt answers are assumed to be no until user says yes
	// HTML5 UTF-8 C0 Controls and Basic Latin already has existing decimals for desired characters.
	// String.fromCharCode() can be used to translate number values into characters.
	// lowercase criteria object
	// 97-122 decimal values are lowercase
	let lower = {
		bool: false,
		fill: "lowercase characters",
		ranges: [97, 122],
	};
	// uppercase criteria object
	// 65-90 decimal values are uppercase
	let upper = {
		bool: false,
		fill: "uppercase characters",
		ranges: [65, 90],
	};
	// number criteria object
	// 48-57 decimal values are numbs
	let numbs = {
		bool: false,
		fill: "numbers",
		ranges: [48, 57],
	};
	// special character criteria object
	// 32-47, 58-64, 91-96, 123-126 are special characters. under assumption that even indexes are start of range and odd are end of range.
	let specialChar = {
		bool: false,
		fill: "special characters",
		ranges: [32, 47, 58, 64, 91, 96, 123, 126],
	};
	//TODO: First prompt must be length of the password. This will be constrained between 8 to 128 characters.
	// while the password length determined by the user is not within the desired range, the user will be prompted to put in a proper number.
	// Anything not a number will keep prompting the user for a number
	while (passwordLength < 8 || passwordLength > 128 || isNaN(passwordLength)) {
		passwordLength = prompt(
			"Your password must be between 8 to 128 characters. How long would you like your password to be?"
		);
	}
	alert("Your password will be a length of " + passwordLength + ".");
	// criteria objects put into an array
	//TODO: create prompts for password criteria
	function question(c) {
		return confirm("Would you like " + c + " in your password?");
	}
	//TODO: Validate each confirm prompt answer
	function yesNo(a, b) {
		if (a) {
			alert("We will include " + b + " in your password.");
		} else {
			alert("We will exclude " + b + " from your password.");
		}
	}

	var criteria = [lower, upper, numbs, specialChar];
	// While all the criteria are not chosen, the user will be asked to select at least one of the following criteria.
	//TODO: prompt in the following order - lowercase, uppercase, numberic, and/or special characters.
	// edge case - no is selected for all chars
	while (
		lower.bool === false &&
		upper.bool === false &&
		numbs.bool === false &&
		specialChar.bool === false
	) {
		alert("Please select one of the following criteria by indicating OK (yes) or cancel (no).");
		criteria.forEach((object) => {
			object.bool = question(object.fill);
			yesNo(object.bool, object.fill);
		});
	}

	// charOptions will be array containing the decimal values of the needed characters
	var charOptions = new Array();
	// Grabs range of numbs and puts the full range into charOptions array
	function addChars(startRange, endRange) {
		for (i = startRange; i <= endRange; i++) {
			charOptions.push(i);
		}
	}

	//checks if criteria was selected and adds the characters into the character options.
	if (lower.bool) {
		addChars(lower.ranges[0], lower.ranges[1]);
	}

	if (upper.bool) {
		addChars(upper.ranges[0], upper.ranges[1]);
	}

	if (numbs.bool) {
		addChars(numbs.ranges[0], numbs.ranges[1]);
	}
	//special characters needs for loop to add multiple ranges
	if (specialChar.bool) {
		for (index = 0; index < specialChar.ranges.length; index += 2) {
			addChars(specialChar.ranges[index], specialChar.ranges[index + 1]);
		}
	}

	var password = "";
	function grabChars() {
		var pwArray = [];
		for (i = 0; i < passwordLength; i++) {
			pwArray.push(charOptions[Math.floor(Math.random() * charOptions.length)]);
		}
		if (!criteriaCheck(criteria, pwArray)) {
			// Resets password to be empty and generates new password if requirements are not met
			password = "";
			grabChars();
		} else {
			// All requirements are met. Password is created to print
			pwArray.forEach((letter) => {
				password = password + String.fromCharCode(letter);
			});
		}
	}

	grabChars();

	//TODO: Add check to be sure the selected criteria were used since random could have skipped a criteria.
	function criteriaCheck(criterias, currPW) {
		for (crit = 0; crit < criterias.length; crit++) {
			if (criterias[crit].bool) {
				var criteriaArray = [];
				for (rangeIndex = 0; rangeIndex < criterias[crit].ranges.length; rangeIndex += 2) {
					for (
						addCritDV = criterias[crit].ranges[rangeIndex];
						addCritDV <= criterias[crit].ranges[rangeIndex + 1];
						addCritDV++
					) {
						// Adds all needed decimal values that are in the used criteria
						criteriaArray.push(addCritDV);
					}
				}
				// comparison check array. if no comaprisons then array will be empty
				var check = criteriaArray.filter((c) => currPW.indexOf(c) !== -1);
				// if check array is empty then return false.
				if (check.length === 0) {
					return false;
				}
			}
		}
		// if all requirements are met then return true.
		return true;
	}

	return password;
}

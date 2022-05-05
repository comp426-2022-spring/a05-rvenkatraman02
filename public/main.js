// Focus div based on nav button click
const home = document.getElementById('home')
const single = document.getElementById('single')
const multi = document.getElementById('multi')
const guess = document.getElementById('guess')

const homebut = document.getElementById('homenav')
homebut.addEventListener('click', homeActive)

function homeActive() {
    home.classList.remove('hidden')
    home.classList.add('active')

    single.classList.remove('active')
    single.classList.add('hidden')
    multi.classList.remove('active')
    multi.classList.add('hidden')
    guess.classList.remove('active')
    guess.classList.add('hidden')
}

const singlebut = document.getElementById('singlenav')
singlebut.addEventListener('click', singleActive)

function singleActive() {
    single.classList.remove('hidden')
    single.classList.add('active')

    home.classList.remove('active')
    home.classList.add('hidden')
    multi.classList.remove('active')
    multi.classList.add('hidden')
    guess.classList.remove('active')
    guess.classList.add('hidden')
}

const multibut = document.getElementById('multinav')
multibut.addEventListener('click', multiActive)

function multiActive() {
    multi.classList.remove('hidden')
    multi.classList.add('active')

    home.classList.remove('active')
    home.classList.add('hidden')
    single.classList.remove('active')
    single.classList.add('hidden')
    guess.classList.remove('active')
    guess.classList.add('hidden')
}

const guessbut = document.getElementById('guessnav')
guessbut.addEventListener('click', guessActive)

function guessActive() {
    guess.classList.remove('hidden')
    guess.classList.add('active')

    home.classList.remove('active')
    home.classList.add('hidden')
    single.classList.remove('active')
    single.classList.add('hidden')
    multi.classList.remove('active')
    multi.classList.add('hidden')
}

// Flip one coin and show coin image to match result when button clicked
function coinFlip() {
    fetch('http://localhost:5000/app/flip/', {mode: 'cors'})
  		.then(function(response) {
    		return response.json()
  	    })
		.then(function(result) {
			console.log(result)
				document.getElementById("result").innerHTML = result.flip
				document.getElementById("quarter").setAttribute("src", "/assets/img/"+result.flip+".png")
				coin.disabled = true
		})
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Our flip many coins form
function flipCoins() {
    // retrieve number of coins to flip
    numberCoins = document.getElementById('numberFlips').value

    fetch('http://localhost:5000/app/flip/coins', {
        body: JSON.stringify({
            'number': numberCoins
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'post'
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (flips) {

            // Graphically display all results in the details table.
            var flipResults = document.getElementById('fliprows')
            flipResults.innerHTML = ""
            for (var i = 0; i < flips.raw.length; i++) {
                var row = document.createElement('tr')
                var currFlip = document.createElement('td')
                currFlip.innerHTML = i + 1
                row.appendChild(currFlip)
                var currResult = document.createElement('td')
                currResult.innerHTML = flips.raw[i]
                row.appendChild(currResult)
                var currImage = document.createElement('td')
                var currImage2 = document.createElement('img')
                currImage2.setAttribute('src', 'assets/img/' + flips.raw[i] + '.png')
                currImage2.setAttribute('class', 'smallcoin')
                currImage.appendChild(currImage2)
                row.appendChild(currImage)

                flipResults.appendChild(row)
            }

            document.getElementById('multi_display').setAttribute('class', 'active')
            document.getElementById('heads').innerHTML = flips.summary.heads
            document.getElementById('tails').innerHTML = flips.summary.tails
        })
}

// Guess a flip by clicking either heads or tails button

// Our flip many coins form
// Add event listener for coins form
function guessFlip(guess) {
    fetch('http://localhost:5000/app/flip/call', {
        body: JSON.stringify({
            'guess': guess
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'post'
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (flips) {
            document.getElementById("call").innerHTML = "Your call: "+flips.call
            document.getElementById("actual_flip").innerHTML = "Coin landed on: "+flips.flip
            document.getElementById("coin_pic").setAttribute("src", "/assets/img/"+flips.flip+".png")
            document.getElementById("guess_result").innerHTML = "Result: "+flips.result
        })
}

// Create a data sender
async function sendFlips({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
    console.log(formDataJson);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: formDataJson
    };

    const response = await fetch(url, options);
    return response.json()
}
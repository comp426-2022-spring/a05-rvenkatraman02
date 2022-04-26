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
const coins = document.getElementById("coin_input")
// Add event listener for coins form
coins.addEventListener("submit", flipCoins)
// Create the submit handler
async function flipCoins(event) {
    event.preventDefault();
    
    const endpoint = "app/flip/coins/"
    const url = document.baseURI+endpoint

    const formEvent = event.currentTarget

    try {
        const formData = new FormData(formEvent)
        const flips = await sendFlips({ url, formData })

        console.log(flips)

        // Put each result in a table
        var flipResults = document.getElementById('fliprows')
        for (let i = 1; i <= flips.raw.length; i++) {
            // creates a table row
            var row = document.createElement("tr")
            var currFlip = document.createElement("td")
            currFlip.innerHTML = i
            row.appendChild(currFlip)
            var currResult = document.createElement("td")
            currResult.innerHTML = result.raw[i]
            row.appendChild(currResult)
            var currImage = document.createElement("td")
            var currImage2 = document.createElement("img")
            currImage2.setAttribute("src", "/assets/img/"+currResult+".png")
            currImage.appendChild(currImage2)
            row.appendChild(currImage)

            flipResults.appendChild(row)
        }

        document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads
        document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails

    } catch (error) {
        console.log(error)
    }
}

// Guess a flip by clicking either heads or tails button

// Our flip many coins form
const guessflips = document.getElementById("headsbutton")
// Add event listener for coins form
guessflips.addEventListener("click", guessFlip)

async function guessFlip(event) {
    event.preventDefault();
    
    const endpoint = "app/flip/call/"
    const url = document.baseURI+endpoint

    const formEvent = event.currentTarget
    
    try {
        const formData = new FormData(formEvent)
        const flips = await sendFlips({ url, formData })

        console.log(flips)
        document.getElementById("call").innerHTML = "Your call: "+flips.call
        document.getElementById("actual_flip").innerHTML = "Coin landed on: "+flips.flip
        document.getElementById("coin_pic").setAttribute("src", "/assets/img/"+result.flip+".png")
        document.getElementById("guess_result").innerHTML = "Result: "+flips.result
    }
    catch (error) {
        console.log(error)
    }
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
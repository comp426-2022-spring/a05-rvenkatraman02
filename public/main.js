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

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button

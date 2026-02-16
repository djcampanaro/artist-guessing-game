
let imageId = '';
let artworkTitle = '';
let artist = '';

function randomNumber() {
    return Math.floor(Math.random() * 12)
}

// searches for a random artwork and ascertains the needed variables, ensuring entries missing necessary info are excluded
async function fetchArtworkInfo() {
    let artworkPage = Math.floor(Math.random() * 10910) + 1;
    let artworkObject = randomNumber();
    
    try {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks/?page=${artworkPage}`);

        if (!response.ok) {
            throw new Error('Network response error');
        }

        const data = await response.json();
        artworkTitle = data.data[artworkObject].title;
        artist = data.data[artworkObject].artist_title;
        imageId = data.data[artworkObject].image_id;

        console.log(artist)

        if (!imageId || !artist || !artworkTitle || artist === "Unknown" || artist === "Anonymous" || imageId === null || artist === null) {
            fetchArtworkInfo(); // Fetch another artwork if missing one of the variables
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// gets the names of other random artists to add to the options
async function fetchArtists() {
    let artistPage = Math.floor(Math.random() * 1222) + 1;
    let artistObjectOne = randomNumber()
    let artistObjectTwo = randomNumber()
    while ( artistObjectTwo === artistObjectOne) {
        artistObjectTwo = randomNumber()
    }

    try {
        const response = await fetch(`https://api.artic.edu/api/v1/artists/?page=${artistPage}`)

        if (!response.ok) {
            throw new Error('Network response error');
        }

        const data = await response.json();
        let artistName1 = data.data[artistObjectOne].title;
        let artistName2 = data.data[artistObjectTwo].title;
        let artists = [artistName1, artistName2];
        for (i = 0; i < artists.length; i++) {
            while (artists[i] === null) {
                artists[i] = data.data[randomNumber()].title;
            }
        }
        return artists;

    } catch(error) {
        console.error('Error: ', error);
    }
    
}

// finds artwork image based on id and changes the title of the work to match the new image
function displayArtwork() {
    const imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/500,/0/default.jpg`;
    document.getElementById('art-image').src = imageUrl;
    artTitle = document.getElementById('artwork-title');
    let oldTitle = artTitle.innerHTML;
    artTitle.innerHTML = artTitle.innerHTML.replace(oldTitle, artworkTitle);
}

// main function that calls other functions in order and replaces buttons' text
async function artistGuessingGame() {
    await fetchArtworkInfo()

    let artistOptions = await fetchArtists();
    artistOptions.push(artist);
    console.log(artistOptions)
    artistOptions.sort( () => Math.random()-0.5 );

    displayArtwork()

    for (let i = 0; i < 3; i++ ) {
        let button = document.getElementById(`option${i + 1}`);
        let oldText = button.innerHTML;
        button.innerHTML = button.innerHTML.replace(oldText, artistOptions[i]);
    }
    const buttons = document.getElementsByClassName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.background = 'white';
    }

}

// verify the button clicked by user and change colors of buttons according to whether or not they are correnct
function verifyGuess (x) {
    const buttons = document.getElementsByClassName('button');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].innerHTML === artist) {
            buttons[i].style.background = '#3ade6d';
        } else {
            buttons[i].style.background = '#f05c3e';
        }
    }

    // this will add a counter for all correct guesses
    chosenOption = x.srcElement;
    if (chosenOption.innerHTML === artist) {
        let counter = document.getElementById('counter');
        counter.innerHTML = parseInt(counter.innerHTML) + 1;
    } else {
    }
    artistGuessingGame()
}

artistGuessingGame()

document.getElementById('option1').addEventListener('click', verifyGuess)
document.getElementById('option2').addEventListener('click', verifyGuess)
document.getElementById('option3').addEventListener('click', verifyGuess)

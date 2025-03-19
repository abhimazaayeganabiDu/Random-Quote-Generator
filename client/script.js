const quoteText = document.getElementById('quote-text')
const authorText = document.getElementById('author-text')
const container = document.getElementById('body-container')

const copyBtn = document.getElementById('copy-btn')
const shareBtn = document.getElementById('share-btn')
const changeQuoteBtn = document.getElementById('change-quote-btn')
const changeBackgroundBtn = document.getElementById('background-btn')


changeQuoteBtn.addEventListener('click', quoteGenerator)
changeBackgroundBtn.addEventListener('click', backgroundGenerator)
copyBtn.addEventListener('click', copyToClipboard)
shareBtn.addEventListener('click', share)


const getOrSaveFromStorage = ({ key, value, get }) => {
    if (get) return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null
    else localStorage.setItem(key, JSON.stringify(value))
}

async function onLoadFromLocalStorage() {
    try {
        const dataForQuote = await getOrSaveFromStorage({ key: "quote", get: true });
        const dataForBackgroundImage = await getOrSaveFromStorage({ key: "background", get: true })        

        const imageSrc = dataForBackgroundImage ?
            `url(${dataForBackgroundImage})` :
            `url('images/background\ image.jpg')`

        const text = dataForQuote ?
            `" ${dataForQuote.quote} "` :
            `" Never give up because you never know if the next try is going to be the one that works. "`

        const author = dataForQuote ?
            `-- ${dataForQuote.author}` :
            "-- Mary Kay Ash";


        quoteText.innerText = text;
        authorText.innerText = author;
        container.style.backgroundImage = imageSrc;

    } catch (error) {
        console.log("error in onLoad fxn", error);
    }
}



async function quoteGenerator() {
    const uri = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
    const options = {

        method: 'GET',
        headers: { accept: 'application/json' }
    };

    const response = await fetch(uri, options);
    const randomText = await response.json()

    const quote = randomText.data.content
    const author = randomText.data.author

    quoteText.innerText = `" ${text} "`
    authorText.innerText = `-- ${author} `

    // save on local storage

    getOrSaveFromStorage({ key: "quote", value: {quote, author}, get: false })
}

async function setImageOnLocalStorage(blob) {
    // Method 1 for handling image from api call and store it on localstorage

    // const arrayBuffer = await blob.arrayBuffer(); // Convert to array buffer
    // const byteArray = new Uint8Array(arrayBuffer); // Convert to Uint8Array
    // const base64String = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
    // const base64Data = 'data:' + response.headers.get('content-type') + ';base64,' + btoa(base64String);

    // await getOrSaveFromStorage({ key: "background", value: base64Data, get: false })


    // Method 2
    const reader = new FileReader();
    if (blob) {
        reader.readAsDataURL(blob)
    }

    reader.onloadend = () => {
        // this function set value on local storage
        getOrSaveFromStorage({ key: "background", value: reader.result, get: false })
    }
}

async function backgroundGenerator() {
    const uri = "https://api.api-ninjas.com/v1/randomimage?category=nature";
    const options = {
        method: 'GET',
        headers: {

            'X-Api-Key': 'x1v5brevGs8EGo+z09VDcQ==DzT4jYepY1wzocOp',
            'Accept': 'image/jpg'
        }
    }

    const response = await fetch(uri, options);
    const blob = await response.blob();
    const src = URL.createObjectURL(blob)
    container.style.backgroundImage = `url(${src})`

    // this function convert image to base64 and save this on localStorage
    setImageOnLocalStorage(blob)
}

function copyToClipboard() {
    const text = quoteText.innerText.slice(1, -3)
    const result = `${text}.`

    navigator.clipboard.writeText(result)
}

function share(event) {
    const text = quoteText.innerText
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, '_blank', 'width=600,height=500');
}


onLoadFromLocalStorage()
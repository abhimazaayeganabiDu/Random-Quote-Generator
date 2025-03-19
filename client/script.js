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
        const data = await getOrSaveFromStorage({ key: "background", get: true })

        const imageSrc = data?.backgroundColor
        const text = dataForQuote?.quote;
        const author = dataForQuote?.author;

        if (text) {
            quoteText.innerText = text;
        }

        if (author) {
            authorText.innerText = author;
        }

        if (imageSrc) {
            container.style.backgroundImage = imageSrc;
        }
    } catch (error) {

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

    const text = randomText.data.content
    const author = randomText.data.author

    quoteText.innerText = `" ${text} "`
    authorText.innerText = `-- ${author} `

    // saveOrLoad()
    const dataForQuote = {
        "quote": text,
        author,
    };

    getOrSaveFromStorage({ key: "quote", value: dataForQuote, get: false })
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

    const dataForBackground = {
        "backgroundColor": `url(${src})`
    }
    await getOrSaveFromStorage({ key: "background", value: dataForBackground, get: false })

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
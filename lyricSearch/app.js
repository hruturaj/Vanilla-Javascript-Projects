// Api info
const ApiCtrl = (function() {

    // Api url 
    const apiURL = 'https://api.lyrics.ovh';

    // Public methods
    return {

        // accessing api from the private member
        getApi: function() {
            return apiURL
        },

        // search song using the private member
        searchSong: async function(searchTerm) {
            console.log('get in the function')
            const response = await fetch(`${apiURL}/suggest/${searchTerm}`)
            const data = await response.json()

            // jump to UI function
            UICtrl.showData(data)

        },

        // get the lyric data using private member
        getLyricData: async function(artist, songTitle) {
            const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
            const data = await response.json()

            // Jump to UI function
            UICtrl.displayLyric(data, artist, songTitle)
        }
    }
})()

// UI design
const UICtrl = (function() {

    // UI selectors
    UISelectors = {
        form: document.querySelector("#form"),
        search: document.querySelector("#search"),
        results: document.querySelector("#results"),
        more: document.querySelector("#more"),
        lyricHeader: document.querySelector('#lyricHeader'),
        error: document.querySelector("#error")
    }

    // Public methods
    return {

        // make the UI selectors public
        getUISelector: function() {
            return UISelectors
        },

        // Display the data on html
        showData: function(data) {
            results.innerHTML = ""
            lyricHeader.innerHTML = ""

            results.className = "container mt-3 form-inline"

            data.data.forEach(function(song) {
                const outerDiv = document.createElement('div')
                outerDiv.className = "card border-primary bg-light m-2"
                outerDiv.style = "width: 30%;height: 150px;"

                const innerDiv = document.createElement('div')
                innerDiv.className = "card-body text-center"
                innerDiv.style = "height: 150px; border: 1px dotted"
                innerDiv.innerHTML = `<button class="btn btn-primary" data-artist="${song.artist.name}" data-songTitle="${song.title_short}" style="width: 100%;height: 100%;"><strong>${song.artist.name}</strong><br>${song.title_short}</button>`

                outerDiv.appendChild(innerDiv)
                results.appendChild(outerDiv)
            })
        },

        // display lyric on the html
        displayLyric: function(data, artist, songTitle) {

            results.innerHTML = ""

            // check if data is null or not
            if (data.error) {
                results.innerHTML = data.error
            } else {

                // Regular expression to find the <Enter key press || New line value>
                const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

                lyricHeader.innerHTML = `<u><strong>${artist}</strong> - ${songTitle}</u>`

                //results.style = "width: 100%;"
                results.className = "text-center mt-5 text-justify font-italic"
                results.innerHTML = `
                    <p>${lyrics}</p>
                `
            }
        },

        // display error message 
        displayError: function(message) {

            // Create 2 element for display alert message
            const h4 = document.createElement("h4")
            const p = document.createElement("p")

            // provide their classes and text
            h4.className = "alert-heading"
            h4.textContent = "Warning !"
            p.className = "mb-0 alert-heading"
            p.textContent = "Oh snap! " + message

            // Adjust the div Error classes and styling.
            error.className = "alert alert-warning text-center"
            error.style = "width: 450px;"

            // append both elements in the div => id(Error)
            error.appendChild(h4)
            error.appendChild(p)

            error.style.display = "block"

            /* Set time out to display the error and remove 
                the content so they wont add up */
            setTimeout(function() {
                error.style.display = "none"
                error.innerHTML = ""
            }, 2000)

        }
    }
})()

// App js
const app = (function(UICtrl, ApiCtrl) {

    // Get the UISelectors List
    const UISelectors = UICtrl.getUISelector()

    // Load event listener
    const loadEventListener = function() {

        // Click search button
        UISelectors.form.addEventListener('submit', searchButton)

        // Click lyric button
        UISelectors.results.addEventListener('click', getLyric)
    }

    const searchButton = function(e) {

        const search = UISelectors.search.value.trim()

        UISelectors.search.value = ""

        // Check if value from text box is null or not
        if (!search) {
            UICtrl.displayError("Please Enter Something")
        } else {
            console.log("calling the function")
            ApiCtrl.searchSong(search)
        }

        e.preventDefault()
    }

    const getLyric = function(e) {

        const clicked = e.target

        if (clicked.tagName === 'BUTTON') {
            const artist = clicked.getAttribute('data-artist')
            const songTitle = clicked.getAttribute('data-songTitle')

            ApiCtrl.getLyricData(artist, songTitle)
        }

        e.preventDefault()
    }

    // Public methods
    return {
        init: function() {
            console.log('initializing app')

            // load Event listener
            loadEventListener()
        }
    }
})(UICtrl, ApiCtrl)

app.init()

const API_KEY = 'YOUR_YOUTUBE_API_KEY';


function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { 
            console.log("GAPI client loaded for API");
            execute();
        },
        function(err) { 
            console.error("Error loading GAPI client for API", err);
        });
}


function execute() {
    const cards = document.getElementsByClassName('card');
    for (let card of cards) {
        const videoId = card.getAttribute('data-video-id');
        gapi.client.youtube.videos.list({
            "part": [
                "snippet"
            ],
            "id": [
                videoId
            ]
        })
        .then(function(response) {
            const videoData = response.result.items[0].snippet;
            card.querySelector('.video-title').textContent = videoData.title;
            card.querySelector('.video-description').textContent = 
                videoData.description.length > 100 ? 
                videoData.description.substring(0, 100) + '...' : 
                videoData.description;
        },
        function(err) { 
            console.error("Execute error", err);
            card.querySelector('.video-title').textContent = "Error loading video data";
            card.querySelector('.video-description').textContent = "Please try again later";
        });
    }
}


gapi.load("client", loadClient);


const modal = document.getElementById("videoModal");


const span = document.getElementsByClassName("close")[0];


const cards = document.getElementsByClassName("card");


const iframe = document.getElementById("videoIframe");


for (let card of cards) {
    card.addEventListener('click', function(event) {
        if (!event.target.classList.contains('start-tracking')) {
            const videoId = this.getAttribute("data-video-id");
            iframe.src = "https://www.youtube.com/embed/" + videoId;
            modal.style.display = "block";
        }
    });
}


span.onclick = function() {
    modal.style.display = "none";
    iframe.src = "";
}


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        iframe.src = "";
    }
}


const startButtons = document.getElementsByClassName("start-tracking");


function simulateTracking(button, progressBar) {
    let progress = 0;
    button.disabled = true;
    button.textContent = 'Tracking...';

    const interval = setInterval(function() {
        progress += 1;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            button.textContent = 'Tracking Complete';
            button.disabled = false;
        }
    }, 50);
}


for (let button of startButtons) {
    button.addEventListener('click', function() {
        const card = this.closest('.card');
        const progressBar = card.querySelector('.progress');
        simulateTracking(this, progressBar);
    });
}


function truncateText(element, maxLength) {
    if (element.textContent.length > maxLength) {
        element.textContent = element.textContent.substring(0, maxLength) + '...';
    }
}


function truncateDescriptions() {
    const descriptions = document.getElementsByClassName('video-description');
    for (let description of descriptions) {
        truncateText(description, 100);
    }
}


setTimeout(truncateDescriptions, 1000);
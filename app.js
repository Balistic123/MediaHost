const API = "REPLACE_WITH_YOUR_CLOUDFLARE_URL";

const grid = document.getElementById("grid");
const uploadInput = document.getElementById("uploadInput");

const overlay = document.getElementById("overlay");
const player = document.getElementById("videoPlayer");

const closeBtn = document.getElementById("closeBtn");
const videoTitle = document.getElementById("videoTitle");

const playBtn = document.getElementById("playBtn");
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");

const seekBar = document.getElementById("seekBar");

const fullscreenBtn = document.getElementById("fullscreenBtn");

const captionBtn = document.getElementById("captionBtn");

async function loadVideos() {

    grid.innerHTML = "";

    const res = await fetch(`${API}/videos`);

    const videos = await res.json();

    videos.reverse().forEach(video => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img class="thumb"
                 src="https://picsum.photos/600/400?random=${Math.random()}">

            <div class="card-title">
                ${video.title.replace(/\.mp4$/i, "")}
            </div>
        `;

        card.onclick = () => {

            overlay.classList.remove("hidden");

            player.src = `${API}/stream/${video.filename}`;

            player.play();

            videoTitle.innerText = video.title;
        };

        grid.appendChild(card);
    });
}

uploadInput.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("video", file);

    await fetch(`${API}/upload`, {
        method: "POST",
        body: formData
    });

    loadVideos();
});

closeBtn.onclick = () => {

    overlay.classList.add("hidden");

    player.pause();

    player.currentTime = 0;
};

playBtn.onclick = () => {

    if (player.paused) {

        player.play();

        playBtn.innerText = "❚❚";

    } else {

        player.pause();

        playBtn.innerText = "▶";
    }
};

backBtn.onclick = () => {
    player.currentTime -= 10;
};

forwardBtn.onclick = () => {
    player.currentTime += 10;
};

fullscreenBtn.onclick = () => {

    if (player.requestFullscreen) {
        player.requestFullscreen();
    }
};

player.addEventListener("timeupdate", () => {

    const value = (player.currentTime / player.duration) * 100;

    seekBar.value = value || 0;
});

seekBar.addEventListener("input", () => {

    player.currentTime = (seekBar.value / 100) * player.duration;
});

captionBtn.onclick = () => {
    alert("Caption support can be added later with .vtt subtitle files.");
};

loadVideos();

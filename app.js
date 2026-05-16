const API = "https://recipe-passage-thursday-dylan.trycloudflare.com";

const grid = document.getElementById("grid");
const uploadInput = document.getElementById("uploadInput");
const overlay = document.getElementById("playerOverlay");
const player = document.getElementById("videoPlayer");
const closeBtn = document.getElementById("closeBtn");
const playerTitle = document.getElementById("playerTitle");
const playPauseBtn = document.getElementById("playPauseBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const seekBar = document.getElementById("seekBar");
const scrollBtn = document.getElementById("scrollBtn");

scrollBtn.onclick = () => {
    window.scrollTo({
        top: window.innerHeight - 120,
        behavior: "smooth"
    });
};

async function loadVideos() {

    grid.innerHTML = "";

    const res = await fetch(`${API}/videos`);
    const videos = await res.json();

    videos.reverse().forEach(video => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img class="card-thumb"
                 src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop">

            <div class="card-gradient"></div>

            <div class="card-info">
                <div class="card-title">
                    ${video.title.replace(/\.mp4$/i, "")}
                </div>
            </div>
        `;

        card.onclick = () => {

            overlay.classList.remove("hidden");

            player.src = `${API}/stream/${video.filename}`;

            playerTitle.innerText = video.title;

            player.play();
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

playPauseBtn.onclick = () => {

    if (player.paused) {

        player.play();
        playPauseBtn.innerText = "❚❚";

    } else {

        player.pause();
        playPauseBtn.innerText = "▶";
    }
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

loadVideos();

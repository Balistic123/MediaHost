const API = "http://10.204.17.81:3000";

const grid = document.getElementById("grid");
const uploadInput = document.getElementById("uploadInput");
const overlay = document.getElementById("playerOverlay");
const player = document.getElementById("videoPlayer");
const closeBtn = document.getElementById("closeBtn");

async function loadVideos() {
    grid.innerHTML = "";

    const res = await fetch(`${API}/videos`);
    const videos = await res.json();

    videos.reverse().forEach(video => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${video.title}</h3>
        `;

        card.onclick = () => {
            overlay.classList.remove("hidden");
            player.src = `${API}/stream/${video.filename}`;
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
};

loadVideos();

const APP_ID = '98a84bad74bb4de0b0728bf1730007ab';
const CHANNEL_NAME = 'test';
const TOKEN = '007eJxTYDCovPZhxrTfIV75L2cW7L+2+9XB6EUSq3nfs/YyTWipsJqgwGBpkWhhkpSYYm6SlGSSkmqQZGBuZJGUZmhubGBgYJ6YJHPld3pDICPD0l5tRkYGCATxWRhKUotLGBgA+Y0hdg==';

let remoteVideo = document.getElementById("localvideo");
let receiveButton = document.getElementById("envoi");

if (!remoteVideo) {
    console.error("L'élément vidéo avec l'ID 'remotevideo' est introuvable.");
}

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8", disableStats: true });

async function startReceiving() {
    try {
        console.log("Connexion au canal...");
        await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
        console.log("Connecté avec succès au canal !");
    } catch (error) {
        console.error("Erreur de connexion au canal :", error);
        alert("Impossible de rejoindre le canal.");
        return;
    }

    client.on("user-published", async (user, mediaType) => {
        console.log("Nouvel utilisateur publié :", user.uid);

        await client.subscribe(user, mediaType);
        console.log("Abonné au flux de :", user.uid);

        if (mediaType === "video") {
            const remoteTrack = user.videoTrack;
            if (remoteVideo) {
                remoteTrack.play(remoteVideo); // Affiche la vidéo dans la balise
                console.log("Vidéo distante affichée !");
            }
        }
    });

    client.on("user-unpublished", (user) => {
        console.log("Utilisateur a quitté ou a arrêté la vidéo :", user.uid);
        if (remoteVideo) {
            remoteVideo.srcObject = null;
        }
    });
}

receiveButton.addEventListener("click", () => {
    startReceiving();
});
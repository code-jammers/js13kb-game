class MusicManager {
  constructor() {
    this.trackList = [
      "./assets/music/nightfall-future-bass-music-228100.mp3",
      "./assets/music/in-slow-motion-inspiring-ambient-lounge-219592.mp3",
      "./assets/music/amalgam-217007.mp3",
    ];

    const audioElement = document.getElementById("background-music");
    if (audioElement) {
      this.audioElement = audioElement;
      this.source = this.audioElement.children?.[0];
      this.source.src = `${this.trackList[0]}`;
      this.audioElement.load();
      this.currentIndex = 0;
      const volume = localStorage.getItem("volume")
        ? Number(localStorage.getItem("volume"))
        : 0.5;
      this.setVolume(volume);
    }

    window.addEventListener("volume-changed", () => {
      const volume = localStorage.getItem("volume")
        ? Number(localStorage.getItem("volume"))
        : 0.5;
      this.setVolume(volume);
    });

    window.addEventListener("enableGameSound-changed", () => {
      const enableGameSound =
        localStorage.getItem("enableGameSound") === "true";

      if (enableGameSound) {
        this.playBackgroundMusic();
      } else {
        this.pauseBackgroundMusic();
      }
    });
  }

  playRandomTrack() {
    const randomIndex = Math.floor(Math.random() * this.trackList.length);
    const randomTrack = this.trackList[randomIndex];
    this.source.src = randomTrack;
    this.audioElement.load();

    this.playBackgroundMusic();
  }

  playNextTrack() {
    this.pauseBackgroundMusic();

    if (this.currentIndex === this.trackList.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }

    const nextTrack = this.trackList[this.currentIndex];
    this.source.src = nextTrack;
    this.audioElement.load();

    this.playBackgroundMusic();
  }

  playPreviousTrack() {
    this.pauseBackgroundMusic();

    if (this.currentIndex === 0) {
      this.currentIndex = this.trackList.length - 1;
    } else {
      this.currentIndex--;
    }

    const previousTrack = this.trackList[this.currentIndex];
    this.source.src = previousTrack;
    this.audioElement.load();

    this.playBackgroundMusic();
  }

  setVolume(volume) {
    this.audioElement.volume = volume;
  }

  playBackgroundMusic() {
    const enableGameSound = localStorage.getItem("enableGameSound") === "true";
    if (enableGameSound) {
      try {
        this.audioElement.play();
      } catch {}
    }
  }

  pauseBackgroundMusic() {
    this.audioElement.pause();
  }
}

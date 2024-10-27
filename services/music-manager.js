class MusicManager {
  constructor() {
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
      this.backgroundMusic = backgroundMusic;
    }
  }

  playBackgroundMusic() {
    this.backgroundMusic.play().catch((error) => {
      console.error("Music play failed: ", error);
    });
  }

  pauseBackgroundMusic() {
    this.backgroundMusic.pause();
  }
}

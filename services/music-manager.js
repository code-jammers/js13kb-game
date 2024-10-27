class MusicManager {
  constructor() {
    this.trackList = [
      "./assets/music/nightfall-future-bass-music-228100.mp3",
      "./assets/music/in-slow-motion-inspiring-ambient-lounge-219592.mp3",
      "./assets/music/amalgam-217007.mp3",
    ];

    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
      this.backgroundMusic = backgroundMusic;
      this.source = this.backgroundMusic.children?.[0];
      this.source.src = `${this.trackList[0]}`;
      this.currentIndex = 0;
      this.setVolume(0.05);
    }
  }

  playRandomTrack() {
    const randomIndex = Math.floor(Math.random() * this.trackList.length);
    const randomTrack = this.trackList[randomIndex];
    this.source.src = randomTrack;
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
    this.playBackgroundMusic();
  }

  setVolume(volume) {
    this.backgroundMusic.volume = volume;
  }

  playBackgroundMusic() {
    this.backgroundMusic.load();
    this.backgroundMusic.play().catch((error) => {
      console.error("Music play failed: ", error);
    });
  }

  pauseBackgroundMusic() {
    this.backgroundMusic.pause();
  }
}

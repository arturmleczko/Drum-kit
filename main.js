// Cymbal.js
class Cymbal {
    constructor() {
        this._crash = document.querySelector("img.crash");
        this._hihat = document.querySelector("img.hihat");
    }

    getCrash() {
        return this._crash;
    }

    getHihat() {
        return this._hihat;
    }

    animateCrash() {
        this._crash.style.transform = "rotate(0deg)";
    }

    animateHihat() {
        this._hihat.style.transform = "rotate(3deg)";
    }

    selectAnimations(key) {
        switch (key) {
            case 72:
                this.animateCrash();
                break;
            case 70:
            case 83:
                this.animateHihat();
                break;
        }
    }
}

// AudioElement.js
class AudioElement {
    static playAudio(key) {
        this.audioElement = document.querySelector(`audio[data-key="${key}"]`);
        this.audioElement.currentTime = 0;
        this.audioElement.play();
    }
}

// Sound.js
class Sound {
    constructor() {
        this.recordedSounds = [];
        this.recordStartTime = 0;
    }

    addSound(key) {
        const soundTime = Date.now() - this.recordStartTime;
        const soundObj = {
            id: key,
            time: soundTime
        }
        this.recordedSounds.push(soundObj);
    }
}

// Drum.js
class Drum {
    constructor(cymbal, sound) {
        this.cymbal = cymbal;
        this.sound = sound;

        window.addEventListener("keydown", this.playSound.bind(this));
    }

    playSound(e) {
        const keyCode = e.keyCode;
        const keyElement = document.querySelector(`div[data-key="${keyCode}"]`);
        
        if (!keyElement) return;

        AudioElement.playAudio(keyCode);
        this.cymbal.selectAnimations(keyCode);
        this.sound.addSound(keyCode);

        keyElement.classList.add("playing");
    }
}

// Transitioned.js
class Transitioned {
    constructor(cymbal) {
        this.drumKeys = document.querySelectorAll(".key");

        cymbal.getCrash().addEventListener("transitionend", this.removeCrashTransition);
        cymbal.getHihat().addEventListener("transitionend", this.removeHihatTransition);
        this.drumKeys.forEach(key => {
            key.addEventListener("transitionend", this.removeKeyTransition);
        });
    }

    removeCrashTransition(e) {
        if (e.propertyName !== "transform") return;
        e.target.style.transform = 'rotate(-7deg)';
    }

    removeHihatTransition(e) {
        if (e.propertyName !== "transform") return;
        e.target.style.transform = 'rotate(0)';
    }

    removeKeyTransition(e)  {
        if (e.propertyName !== "transform") return;
        e.target.classList.remove("playing")
    }
}

// Panel.js
class Panel {
    constructor(sound) {
        this.recordBtn = document.querySelector("#recordBtn");
        this.playBtn = document.querySelector("#playBtn");
        this.sound = sound;

        this.recordBtn.addEventListener("click", this.onRecordBtnClick.bind(this));
        this.playBtn.addEventListener("click", this.onPlayBtnClick.bind(this));
    }

    onRecordBtnClick() {
        this.recordBtn.style.opacity = 0.7;
        this.sound.recordStartTime = Date.now();
    }

    onPlayBtnClick = () => {
        this.recordBtn.style.opacity = 1;
        for (let index = 0; index < this.sound.recordedSounds.length; index++) {
            const soundObj = this.sound.recordedSounds[index];
            setTimeout(
                () => {
                    AudioElement.playAudio(soundObj.id);
                },
                soundObj.time
            )
        }
        this.sound.recordedSounds.length = 0;
    }
}

// App.js
class App {
    constructor() {
    this.cymbal = new Cymbal();
    this.sound = new Sound();

    this.drum = new Drum(this.cymbal, this.sound);
    this.transitioned = new Transitioned(this.cymbal);
    this.panel = new Panel(this.sound);
    }
}

const app = new App();
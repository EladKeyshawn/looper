import { writable } from 'svelte/store';

export const looperPads = [
    {
        name: "pad1",
        audioSrcUrl: "/media/120_future_funk_beats_25.mp3",
    },
    {
        name: "pad2",
        audioSrcUrl: "/media/120_stutter_breakbeats_16.mp3",
    },
    {
        name: "pad3",
        audioSrcUrl: "/media/Bass Warwick heavy funk groove on E 120 BPM.mp3",
    },
    {
        name: "pad4",
        audioSrcUrl: "/media/electric guitar coutry slide 120bpm - B.mp3",
    }
];

export let looperPadClickedState = {};
export let looperKeyPausedState = {};
export let looperKeyAudioState = {};
export let playing = writable(false);
export let recording = false;

for (const pad of looperPads) {
    looperPadClickedState[pad.name] = false
    looperKeyPausedState[pad.name] = true
}

export const keyPadsWaitingToPlay = []


export const onLooperKeyClicked = (keyPadId) => {
    looperKeyAudioState[keyPadId].currentTime = 0
    looperPadClickedState[keyPadId] = !looperPadClickedState[keyPadId];

    if (looperPadClickedState[keyPadId]) {
        console.log("Scheduling to resume: " + keyPadId)
        keyPadsWaitingToPlay.push(keyPadId)
    } else {
        pauseKeyPad(keyPadId)
    }

};

const pauseAll = () => {
    for (const key in looperKeyPausedState) {
        looperKeyPausedState[key] = true
    }
}

const pauseKeyPad = (keyPadId) => {
    looperKeyPausedState[keyPadId] = true
}

const tryResumeKeyPad = (keyPadId) => {
    console.log("Trying to resume keyPad: " + keyPadId)
    looperKeyPausedState[keyPadId] = !(playing && looperPadClickedState[keyPadId])
}

const tryResumeAllWaitingKeyPads = () => {
    while (keyPadsWaitingToPlay.length) {
        const keyPadId = keyPadsWaitingToPlay.pop()
        tryResumeKeyPad(keyPadId)
    }
}

const scheduleAllClickedKeyPadsForResume = () => {
    for (const key in looperPadClickedState) {
        keyPadsWaitingToPlay.push(key)
    }
}

export const togglePlaying = () => {
    console.log("toggling play")
    playing.update(playing => !playing);
    // playing = !playing;
    if (!playing) {
        pauseAll()
    }
    else {
        scheduleAllClickedKeyPadsForResume()
    }

};

export const toggleRecording = () => {
    recording = !recording
}

setInterval(() => {
    tryResumeAllWaitingKeyPads()
}, 5000)

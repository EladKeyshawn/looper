<script>
    import {Button} from "attractions";


    const looperPads = [
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

    let looperPadClickedState = {};
    let looperKeyPausedState = {};
    let looperKeyAudioState = {};
    let looperKeyTimeState = {};
    let playing = false;
    let audio = null;

    for (const pad of looperPads) {
        looperPadClickedState[pad.name] = false
        looperKeyPausedState[pad.name] = true
        looperKeyTimeState[pad.name] = 0
    }

    const keyPadsWaitingToPlay = []

    const onLooperKeyClicked = (keyPadId) => {
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

    const togglePlaying = () => {
        playing = !playing;
        if (!playing) {
             pauseAll()
        }
        else {
            scheduleAllClickedKeyPadsForResume()
        }

    };

    setInterval(() => {
        console.log("Interval hit")
        tryResumeAllWaitingKeyPads()
    }, 5000)

</script>

<main>

  <Button outline filled={playing} on:click={togglePlaying}>
    {playing ? "stop" : "play"}
  </Button>

  {#each looperPads as looperPad}
    <audio loop
           bind:this={looperKeyAudioState[looperPad.name]}
           bind:paused={looperKeyPausedState[looperPad.name]}
           src={looperPad.audioSrcUrl}
           controls>
      <track kind="captions"/>
    </audio>

    <div>
      <Button
        outline
        on:click={onLooperKeyClicked.bind(this, looperPad.name)}
        filled={looperPadClickedState[looperPad.name]}>
        {looperPad.name}
      </Button>
    </div>
  {/each}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

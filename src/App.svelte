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
    let looperKeyTimePointerState = {};
    let playing = false;
    for (const pad of looperPads) {
        looperPadClickedState[pad.name] = false
        looperKeyPausedState[pad.name] = true
        looperKeyTimePointerState[pad.name] = 0
    }

    const onLooperKeyClicked = (buttonId) => {
        looperPadClickedState[buttonId] = !looperPadClickedState[buttonId];
        // looperKeyTimePointerState[buttonId] = 0;
        syncLooperKeysState();
    };

    const syncLooperKeysState = () => {
        for (const key in looperKeyPausedState) {
            looperKeyPausedState[key] = !(playing && looperPadClickedState[key]);
        }
        console.log("Playing: " + playing)
        console.log(looperKeyPausedState)
    };

    const togglePlaying = () => {
        playing = !playing;
        syncLooperKeysState();
    };

</script>

<main>

  <Button outline filled={playing} on:click={togglePlaying}>
    {playing ? "stop" : "play"}
  </Button>

  {#each looperPads as looperPad}
    <audio loop
           bind:paused={looperKeyPausedState[looperPad.name]}
           bind:currentTime={looperKeyTimePointerState[looperPad.name]}
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

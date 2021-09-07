<script>
    import {Button} from "attractions";
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import {id, randomHexColorCode} from './utils'

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
    export let playing = false;
    export let recording = false;

    for (const pad of looperPads) {
        looperPadClickedState[pad.name] = false
        looperKeyPausedState[pad.name] = true
    }

    export const keyPadsWaitingToPlay = []


    export const onLooperKeyClicked = (keyPadId) => {
        console.log("Clicked " + keyPadId)
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
        playing = !playing;

        if (!playing) {
            pauseAll()
        } else {
            scheduleAllClickedKeyPadsForResume()
        }

    };

    export const toggleRecording = () => {
        recording = !recording
        console.log("Recording " + recording)

    }

    setInterval(() => {
        tryResumeAllWaitingKeyPads()
    }, 2000)

    function generateLayout(col) {

        return looperPads.map((looperPad, i) => {
            const y = Math.ceil(Math.random() * 4) + 1;

            return {
                16: gridHelp.item({x: (i * 2) % col, y: Math.floor(i / 6) * y, w: 3, h: 3}),
                id: id(),
                fixed: true,
                draggable: false,
                data: {looperPad, start: randomHexColorCode(), end: randomHexColorCode()},
            };
        })
    }

    let cols = [[1287, 16]];
    let items = gridHelp.adjust(generateLayout(16), 16);


</script>

<main>



  <div class="container">
    <div class="keypads">
      <Grid bind:items {cols} rowHeight={50} let:dataItem fillSpace={true}>

        <audio loop
               bind:this={looperKeyAudioState[dataItem.data.looperPad.name]}
               bind:paused={looperKeyPausedState[dataItem.data.looperPad.name]}
               src={dataItem.data.looperPad.audioSrcUrl}
        >
        </audio>

        <div class="content {looperPadClickedState[dataItem.data.looperPad.name] ? 'greyout': ''}"
             on:click={onLooperKeyClicked.bind(this,dataItem.data.looperPad.name )}
             style="background-image: linear-gradient({dataItem.data.start}, {dataItem.data.end});"></div>

      </Grid>
    </div>
    <div class="controls">


          <div class="record">
            <input on:click={toggleRecording} type="checkbox" id="btn"/>
            <label for="btn"></label>
            <div class="time">
              <div class="h_m"></div>
              <div class="s_ms"></div>
            </div>

          </div>
          <div class="play" style="margin-left: 30%">
            <Button outline rectangle small filled={playing} on:click={togglePlaying}>
              {playing ? "Stop" : "Play"}
            </Button>
          </div>



    </div>
  </div>


</main>

<style type="text/scss">
    @use 'theme.scss';
    @import "./styles/record-button.scss";

    .container {
      display: grid;
      grid-template-columns: 0.1fr 3.6fr 0.1fr;
      grid-template-rows: 0.5fr 1.5fr 1fr;
      gap: 0px 0px;
      grid-template-areas:
    ". controls ."
    ". keypads ."
    ". . .";
    }
    .keypads { grid-area: keypads; }
    .controls {
      display: grid;
      grid-template-columns: 0.3fr 0.2fr 2.5fr;
      grid-template-rows: 1fr 1fr 1fr;
      gap: 0px 0px;
      grid-template-areas:
    ". . ."
    "record play ."
    ". . .";
      grid-area: controls;
    }
    .record { grid-area: record; }
    .play { grid-area: play; }

    .greyout {
        opacity: 0.4; /* Real browsers */
    }

    .content {
        width: 100%;
        height: 100%;
        border-radius: 6px;
    }

    :global(body) {
        overflow-y: scroll;
    }

    :global(.svlt-grid-resizer::after) {
        border-color: white !important;
    }

    :global(.svlt-grid-shadow) {
        border-radius: 6px;
    }

    :global(.svlt-grid-item) {
        border-radius: 6px;
    }

    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

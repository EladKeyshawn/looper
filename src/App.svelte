<script>
    import {Button} from "attractions";
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import {id, randomHexColorCode} from './utils'
    import {Col, Row} from 'sveltestrap';

    export const looperPads = [
        {
            audioSrcUrl: "/media/120_future_funk_beats_25.mp3",
        },
        {
            audioSrcUrl: "/media/120_stutter_breakbeats_16.mp3",
        },
        {
            audioSrcUrl: "/media/Bass Warwick heavy funk groove on E 120 BPM.mp3",
        },
        {
            audioSrcUrl: "/media/electric guitar coutry slide 120bpm - B.mp3",
        },
        {
            audioSrcUrl: "/media/FUD_120_StompySlosh.mp3",
        },
        {
            audioSrcUrl: "/media/GrooveB_120bpm_Tanggu.mp3",
        },
        {
            audioSrcUrl: "/media/MazePolitics_120_Perc.mp3",
        },
        {
            audioSrcUrl: "/media/PAS3GROOVE1.03B.mp3",
        },
        {
            audioSrcUrl: "/media/SilentStar_120_Em_OrganSynth.mp3",
        },


    ];

    export let looperPadClickedState = {};
    export let looperKeyPausedState = {};
    export let looperKeyAudioState = {};
    export let playing = false;
    export let recording = false;
    let recordingEvents = null
    let recordingStart = 0


    for (const looperIndex in looperPads) {
        looperPads[looperIndex].id = looperIndex
        const pad = looperPads[looperIndex];
        looperPadClickedState[pad.id] = false
        looperKeyPausedState[pad.id] = true
    }

    export const keyPadsWaitingToPlay = []


    export const onLooperKeyClicked = (keyPadId) => {
        const eventTimestamp = performance.now()
        console.log("Clicked " + keyPadId)
        looperKeyAudioState[keyPadId].currentTime = 0
        looperPadClickedState[keyPadId] = !looperPadClickedState[keyPadId];

        if (looperPadClickedState[keyPadId]) {
            console.log("Scheduling to resume: " + keyPadId)
            keyPadsWaitingToPlay.push(keyPadId)
        } else {
            pauseKeyPad(keyPadId)
        }

        recordSnapshot(eventTimestamp)
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
            recordSnapshot();
        }
    }

    const scheduleAllClickedKeyPadsForResume = () => {
        for (const key in looperPadClickedState) {
            keyPadsWaitingToPlay.push(key)
        }
    }

    export const togglePlaying = (value) => {
        console.log("toggling playing")
        playing = value instanceof Boolean? value : !playing;
        recordSnapshot()
        if (!playing) {
            pauseAll()
        } else {
            scheduleAllClickedKeyPadsForResume()
        }

    };

    const recordSnapshot = (overrideTimestamp) => {
        if (!recording) return
        recordingEvents.push({
            timestamp: (overrideTimestamp || performance.now()) - recordingStart,
            playing,
            looperKeyPausedState,
            looperPadClickedState
        })
        console.log(recordingEvents)
    }


    export const toggleRecording = () => {
        recording = !recording
        console.log("Recording " + recording)
        if (recording) {
            recordingStart = performance.now()
            recordingEvents = []
        } else {
            localStorage.setItem('record' + id(), JSON.stringify(recordingEvents));
            loadAllRecordingItems()
        }
    }

    const loadRecording = (recordingName) => {
        const events = JSON.parse(localStorage.getItem(recordingName));

        while (events.length) {
            const event = events.shift()

            console.log(`Scheduling event in ${event.timestamp} ms`)
            setTimeout(() => {
                console.log("Loading event playing: " + playing)
                playing = event.playing;
                looperPadClickedState = event.looperPadClickedState;
                togglePlaying(playing)
                console.log("Event loaded")
            }, event.timestamp)

        }
    }

    let recordingItems = []
    const loadAllRecordingItems = () => {

        recordingItems = Object.keys(localStorage)
        console.log("Loaded recording items")
        console.log(recordingItems)
    }

    loadAllRecordingItems()

    setInterval(() => {
        tryResumeAllWaitingKeyPads()
    }, 2000)

    function generateLayout(col) {

        return looperPads.map((looperPad, i) => {
            const y = Math.ceil(Math.random() * 4) + 1;

            return {
                16: gridHelp.item({x: (i * 2) % col, y: Math.floor(i / 6) * y, w: 3, h: 3, fixed: true}),
                id: id(),
                data: {looperPad, start: randomHexColorCode(), end: randomHexColorCode()},
            };
        })
    }

    let cols = [[1287, 16]];
    let items = gridHelp.adjust(generateLayout(16), 16);


</script>

<main>

  <Row>
    <Col xs="1">
      <input on:click={toggleRecording} type="checkbox" name="checkbox" class="checkbox" id="checkbox">
      <label for="checkbox"></label>
    </Col>

    <Col xs="1">
      <Button rectangle small on:click={togglePlaying}>
        {playing ? "Stop" : "Play"}
      </Button>
    </Col>

    <Col xs="1">
      <Button rectangle small>
        Load
      </Button>
    </Col>
  </Row>


  <Row style="padding: 2%">
    <Col xs="2">
      {#each recordingItems as recordingItem}
        <Button small rectangle on:click={loadRecording.bind(this, recordingItem)}>{recordingItem}</Button>
      {/each}
    </Col>
  </Row>

  <Row>
    <Col>
      <div style="max-width: 1100px; width: 100%;">
        <Grid bind:items {cols} rowHeight={50} let:dataItem fillSpace={true}>

          <audio loop
                 bind:this={looperKeyAudioState[dataItem.data.looperPad.id]}
                 bind:paused={looperKeyPausedState[dataItem.data.looperPad.id]}
                 src={dataItem.data.looperPad.audioSrcUrl}
          >
          </audio>

          <a href="#">
            <div class="content {looperPadClickedState[dataItem.data.looperPad.id] ? 'greyout': ''}"
                 on:click={onLooperKeyClicked.bind(this,dataItem.data.looperPad.id )}
                 style="background-image: linear-gradient({dataItem.data.start}, {dataItem.data.end});">
              <h1
                style="padding-top: 10%; color: black">{looperPadClickedState[dataItem.data.looperPad.id] ? 'Playing' : ''}</h1>
            </div>
          </a>

        </Grid>
      </div>

    </Col>
  </Row>


</main>

<style type="text/scss">
  @use 'theme.scss';
  @import "./styles/record-button.scss";

  a {
    text-decoration: none;
  }


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

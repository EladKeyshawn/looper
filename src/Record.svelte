<script>

    import {playing} from "./store";
    import {id} from "./utils";
    export let recording = false;
    let recordingEvents = null
    let recordingStart = 0

    const recordSnapshot = (overrideTimestamp) => {
        if (!recording) return
        recordingEvents.push({
            timestamp: (overrideTimestamp || performance.now()) - recordingStart,
            playing,
            // looperKeyPausedState,
            // looperPadClickedState
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
            // loadAllRecordingItems()
        }
    }

    // const loadRecording = (recordingName) => {
    //     const events = JSON.parse(localStorage.getItem(recordingName));
    //
    //     while (events.length) {
    //         const event = events.shift()
    //
    //         console.log(`Scheduling event in ${event.timestamp} ms`)
    //         setTimeout(() => {
    //             console.log("Loading event playing: " + playing)
    //             // playing = event.playing;
    //             // looperPadClickedState = event.looperPadClickedState;
    //             // togglePlaying(playing)
    //             console.log("Event loaded")
    //         }, event.timestamp)
    //
    //     }
    // }

    // let recordingItems = []
    // const loadAllRecordingItems = () => {
    //
    //     recordingItems = Object.keys(localStorage)
    //     console.log("Loaded recording items")
    //     console.log(recordingItems)
    // }
    // loadAllRecordingItems()

</script>

<input  type="checkbox" name="checkbox" class="checkbox" id="checkbox">
<label for="checkbox"></label>

<!--<Col xs="2">-->
<!--  {#each recordingItems as recordingItem}-->
<!--    <Button small rectangle on:click={loadRecording.bind(this, recordingItem)}>{recordingItem}</Button>-->
<!--  {/each}-->
<!--</Col>-->

<style type="text/scss">
    @import "./styles/record-button.scss";
  </style>

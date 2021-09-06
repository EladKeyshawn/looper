<script>
  import { Button } from "attractions";


  const looperPads = [
    {
      name: "pad1",
      audioSrcUrl: "/media/GrooveB_120bpm_Tanggu.mp3",
    },
    {
      name: "pad2",
      audioSrcUrl: "/media/GrooveB_120bpm_Tanggu.mp3",
    },
    {
      name: "pad3",
      audioSrcUrl: "/media/GrooveB_120bpm_Tanggu.mp3",
    },
    {
      name: "pad4",
      audioSrcUrl: "/media/GrooveB_120bpm_Tanggu.mp3",
    }
  ];

  const buttonsState = {};
  const looperKeyPausedState = {};
  let playing = false;

  for (const pad of looperPads) {
	  buttonsState[pad.name] = false
	  looperKeyPausedState[pad.name] = true
  }


  const handleClick = (buttonId) => {
    buttonsState[buttonId] = !buttonsState[buttonId];
    syncLooperKeysState();
  };

  const syncLooperKeysState = () => {
	  console.log(playing)
	  console.log(looperKeyPausedState)
    for (const key in looperKeyPausedState) {
      looperKeyPausedState[key] = !(playing && buttonsState[key]);
    }
  };

  const togglePlaying = () => {
    playing = !playing;
    syncLooperKeysState();
  };
</script>

<main>
  <!-- <h1>Hello {name}!</h1> -->
  <!-- <Button outline disabled={buttonDisabled}>Tertiary button</Button> -->

  <Button outline filled={playing} on:click={togglePlaying}>
    {playing ? "stop" : "play"}
  </Button>

  {#each looperPads as looperPad}
    <audio
      bind:paused={looperKeyPausedState[looperPad.name]}
      src={looperPad.audioSrcUrl}
      controls
    >
      <track kind="captions" />
    </audio>

    <div>
      <Button
        outline
        on:click={handleClick.bind(this, looperPad.name)}
        filled={buttonsState[looperPad.name]}
        >{looperPad.name}
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

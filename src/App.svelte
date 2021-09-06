<script>
  import { Button } from 'attractions';

  export let name;
  export let buttonDisabled;

  let playing = false
  const buttonsState = {
	  '1': false,
	  '2': false,
	  '3': false,
	  '4': false,
	  '5': false,
	  '6': false,
	  '7': false,
	  '8': false,
	  '9': false,
  }

  const handleClick = (buttonId) => {
	  buttonsState[buttonId] = !buttonsState[buttonId]
	  console.log(buttonsState)
  }

  const togglePlaying = () =>{
	  playing = !playing
  }
</script>

<main>
  <!-- <h1>Hello {name}!</h1> -->
	<!-- <Button outline disabled={buttonDisabled}>Tertiary button</Button> -->
	<Button outline filled={playing} on:click={togglePlaying}>
		{playing? 'stop' : 'play'}
	  </Button>
	<div>
		<Button outline on:click={handleClick.bind(this, '1')} filled={buttonsState['1']}>Button</Button>
		<Button outline on:click={handleClick.bind(this, '2')} filled={buttonsState['2']}>Button</Button>
		<Button outline on:click={handleClick.bind(this, '3')} filled={buttonsState['3']}>Button</Button>
		<Button outline on:click={handleClick.bind(this, '4')} filled={buttonsState['4']}>Button</Button>
	</div>


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

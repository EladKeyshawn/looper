import App from './App.svelte';
import './recorder'

const app = new App({
	target: document.body,
	props: {
		name: 'world',
		buttonDisabled: true
	}
});



export default app;

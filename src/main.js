import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world',
		buttonDisabled: true
	}
});



export default app;

<script lang="ts">
	import '../app.css';
	import { setDBProvider } from '$lib/db.svelte';
	import { browser } from '$app/environment';

	if (browser) {
		setDBProvider();
	}
	let { children } = $props();
</script>

{@render children()}

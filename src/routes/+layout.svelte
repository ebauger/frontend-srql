<script lang="ts">
	import '../app.css';
	import { setSurrealProvider } from '$lib/SurrealProvider.svelte';

	setSurrealProvider();
	let { children } = $props();
</script>

{@render children()}

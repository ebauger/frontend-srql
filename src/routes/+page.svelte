<script lang="ts">
	import { DBProvider } from '$lib/DBProvider';
	import { getDBProvider, withDB } from '$lib/db.svelte';
	import { RecordId } from 'surrealdb';
	import { onMount } from 'svelte';

	type UserInput = {
		email: string;
		name: string;
	};

	type User = {
		id: RecordId<string>;
		email: string;
		name: string;
	};

	let user = $state<User | null>(null);
	let error = $state<Error | null>(null);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			// Use the withDB helper function to ensure connection
			const result = await withDB(async (db) => {
				// Create the user
				const userData: UserInput = {
					email: 'user@example.com',
					name: 'Auger'
				};

				// Create and get the result
				return db.create('user', userData);
			});

			console.log('User created:', result);

			// SurrealDB returns an array, get the first item
			if (Array.isArray(result) && result.length > 0) {
				user = result[0] as User;
			}
		} catch (err) {
			console.error('Error:', err);
			error = err instanceof Error ? err : new Error(String(err));
		} finally {
			isLoading = false;
		}
	});
</script>

<h1>Welcome to SvelteKit</h1>

{#if isLoading}
	<p>Loading...</p>
{:else if error}
	<div style="color: red; border: 1px solid red; padding: 10px; margin: 10px 0;">
		<p>Error: {error.message}</p>
	</div>
{:else if user}
	<div style="border: 1px solid green; padding: 10px; margin: 10px 0;">
		<p>User created successfully:</p>
		<pre>{JSON.stringify(user, null, 2)}</pre>
	</div>
{/if}

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

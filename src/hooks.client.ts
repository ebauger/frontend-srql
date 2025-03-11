import type { HandleClientError, ClientInit } from '@sveltejs/kit';
import { DBProvider } from '$lib/DBProvider';

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	// Your error handling here
	return { message: 'An error occurred', errorId: crypto.randomUUID() };
};

export const init: ClientInit = async () => {
	// Initialize SurrealDB for the client
	try {
		// Get the singleton instance and connect
		const dbProvider = DBProvider.getInstance();
		await dbProvider.connect();
		console.log('SurrealDB initialized in client init hook');
	} catch (error) {
		console.error('Failed to connect to SurrealDB in client init hook:', error);
	}
};

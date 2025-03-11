import { DBProvider } from './DBProvider';
import { setContext, getContext } from 'svelte';

const DB_KEY = Symbol('DBState');

export function setDBProvider() {
	// Check if provider already exists in context
	try {
		const existing = getContext(DB_KEY);
		if (existing) {
			return existing;
		}
	} catch (e) {
		// No existing provider, continue with creation
	}

	const db = DBProvider.getInstance();
	setContext(DB_KEY, db);

	// If not connected, connect automatically
	if (!db.isConnected) {
		db.connect().catch((err) => console.error('Failed to connect in setDBProvider:', err));
	}

	return db;
}

export function getDBProvider() {
	const db = getContext<ReturnType<typeof setDBProvider>>(DB_KEY);
	if (!db) {
		throw new Error(
			'SurrealDB provider not found in context. Call setDBProvider first, typically in +layout.svelte'
		);
	}

	return db;
}

/**
 * Helper function to perform a database operation, handling connection status
 *
 * @param operation - Function that performs the database operation given a connected DB instance
 * @returns Promise with the result of the operation
 */
export async function withDB<T>(operation: (db: DBProvider) => Promise<T>): Promise<T> {
	const db = getDBProvider();

	if (!db.isConnected) {
		await db.connect();
	}

	return operation(db);
}

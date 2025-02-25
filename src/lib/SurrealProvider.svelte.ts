import { Surreal } from 'surrealdb';
import { setContext, getContext } from 'svelte';
//import { surrealdbWasmEngines } from '@surrealdb/wasm';
//import { SurrealProviderState } from './types';

const SURREAL_KEY = Symbol('SurrealProvider');

type browserEngine = 'memory' | 'indexdb';

class SurrealProvider {
	db = $state<Surreal>();

	constructor() {
		// this.db = new Surreal({
		// 	engines: surrealdbWasmEngines()
		// });
		this.connect();
	}
	async connect() {
		try {
			const { surrealdbWasmEngines } = await import('@surrealdb/wasm');
			// Dynamically create the DB instance
			const { Surreal } = await import('surrealdb');

			this.db = new Surreal({
				engines: surrealdbWasmEngines()
			});
			await this.db.connect('indxdb://demo');
			await this.db.use({
				namespace: 'zbranch',
				database: 'test'
			});
			console.log("SurrealDB's status:", this.db.status);
		} catch (error) {
			console.error(
				'Failled to connect to SurrealDB',
				error instanceof Error ? error.message : String(error)
			);
			await this.db?.close();
			throw error;
		}
	}
	async close() {
		await this.db?.close();
	}
}

export function setSurrealProvider() {
	return setContext<SurrealProvider>(SURREAL_KEY, new SurrealProvider());
}

export function getSurrealProvider() {
	return getContext<ReturnType<typeof setSurrealProvider>>(SURREAL_KEY);
}

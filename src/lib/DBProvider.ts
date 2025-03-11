import { Surreal } from 'surrealdb';
import { browser } from '$app/environment';

export class DBProvider {
	private static instance: DBProvider | null = null;
	private _db: Surreal | null = null;
	private _isConnected = false;

	private constructor() {
		// Private constructor for singleton pattern
		if (browser && (window as any).__surrealdb) {
			this._db = (window as any).__surrealdb;
			this._isConnected = this._db.status === 'CONNECTED';
			console.log('DBProvider: Using existing global instance');
		}
	}

	/**
	 * Get the singleton instance of DBProvider
	 */
	public static getInstance(): DBProvider {
		if (!DBProvider.instance) {
			DBProvider.instance = new DBProvider();
		}
		return DBProvider.instance;
	}

	/**
	 * Get the SurrealDB instance
	 */
	public get db(): Surreal | null {
		return this._db;
	}

	/**
	 * Check if the database is connected
	 */
	public get isConnected(): boolean {
		return this._isConnected;
	}

	/**
	 * Initialize the connection to SurrealDB
	 */
	public async connect(): Promise<DBProvider> {
		// If already connected, just return
		if (this._isConnected && this._db) {
			return this;
		}

		try {
			// If we don't have a database instance yet, create one
			if (!this._db) {
				const { surrealdbWasmEngines } = await import('@surrealdb/wasm');
				const { Surreal } = await import('surrealdb');

				this._db = new Surreal({
					engines: surrealdbWasmEngines()
				});

				await this._db.connect('indxdb://demo');
				await this._db.use({
					namespace: 'zbranch',
					database: 'test'
				});

				// Store it globally for future use
				if (browser) {
					(window as any).__surrealdb = this._db;
				}
			}

			this._isConnected = true;
			console.log("SurrealDB's status:", this._db.status);
			return this;
		} catch (error) {
			console.error(
				'Failed to connect to SurrealDB',
				error instanceof Error ? error.message : String(error)
			);
			await this.close();
			throw error;
		}
	}

	/**
	 * Close the database connection
	 */
	public async close(): Promise<void> {
		if (this._db) {
			await this._db.close();
			this._isConnected = false;
			this._db = null;

			if (browser) {
				(window as any).__surrealdb = null;
			}
		}
	}

	// /**
	//  * Select records from the database
	//  */
	// public async select(table: string, id?: string): Promise<ReturnType<Surreal['select']>> {
	// 	await this.ensureConnection();
	// 	return this._db!.select(table, id);
	// }

	/**
	 * Create a new record in the database
	 */
	public async create(table: string, data?: any): Promise<ReturnType<Surreal['create']>> {
		await this.ensureConnection();
		return this._db!.create(table, data);
	}

	// /**
	//  * Update a record in the database
	//  */
	// public async update(
	// 	table: string,
	// 	id: string,
	// 	data: any
	// ): Promise<ReturnType<Surreal['update']>> {
	// 	await this.ensureConnection();
	// 	return this._db!.update(`${table}:${id}`, data);
	// }

	// /**
	//  * Delete records from the database
	//  */
	// public async delete(table: string, id?: string): Promise<ReturnType<Surreal['delete']>> {
	// 	await this.ensureConnection();
	// 	return this._db!.delete(table, id);
	// }

	// /**
	//  * Execute a custom query
	//  */
	// public async query(
	// 	sql: string,
	// 	vars?: Record<string, unknown>
	// ): Promise<ReturnType<Surreal['query']>> {
	// 	await this.ensureConnection();
	// 	return this._db!.query(sql, vars);
	// }

	/**
	 * Ensure a connection exists before executing an operation
	 * @private
	 */
	private async ensureConnection(): Promise<void> {
		if (!this._db || !this._isConnected) {
			await this.connect();
		}
	}
}

// Type declaration for better TypeScript support
declare global {
	interface Window {
		__surrealdb?: Surreal;
	}
}

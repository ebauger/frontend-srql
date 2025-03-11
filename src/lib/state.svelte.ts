import { LocalStorage } from '$lib/storage.svelte';
import { getContext, setContext } from 'svelte';

// Define a key for your context
const STATE_KEY = 'state';

// Type for your storage
interface UserSettings {
	theme: 'light' | 'dark';
	fontSize: number;
	notifications: boolean;
}

// Default settings
const defaultSettings: UserSettings = {
	theme: 'light',
	fontSize: 16,
	notifications: true
};

// Create a function to set the context
export function setStateContext() {
	const storage = new LocalStorage<UserSettings>(STATE_KEY, defaultSettings);

	return setContext(STATE_KEY, storage);
}

// Create a function to get the context
export function getStateContext() {
	return getContext<ReturnType<typeof setStateContext>>(STATE_KEY);
}

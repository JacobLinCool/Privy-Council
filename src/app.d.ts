// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: {
				/** The user's email */
				sub?: string;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

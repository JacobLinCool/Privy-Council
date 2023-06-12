import type { User } from "@prisma/client";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token:
				| {
						/** The user's email */
						sub?: string;
				  }
				| undefined;
			user:
				| (User & {
						memberships: {
							role: string;
							team: {
								namespace_name: string;
							};
						}[];
				  })
				| null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

/**
 * @returns `true` if the user is the owner of the namespace or a member of the team that owns the namespace, `false` otherwise
 */
export function is_namespace_editable(user: App.Locals["user"], namespace: string): boolean {
	if (!user) {
		return false;
	}

	const editables = new Set([
		user.namespace_name,
		...user.memberships.map((m) => m.team.namespace_name),
	]);

	return editables.has(namespace);
}

/**
 * @returns `true` if the user is the owner of the namespace or an admin of the team that owns the namespace, `false` otherwise
 */
export function is_namespace_owner(user: App.Locals["user"], namespace: string): boolean {
	if (!user) {
		return false;
	}

	const ownerships = new Set([
		user.namespace_name,
		...user.memberships.filter((m) => m.role === "admin").map((m) => m.team.namespace_name),
	]);

	return ownerships.has(namespace);
}

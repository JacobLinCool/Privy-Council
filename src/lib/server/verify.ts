import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function verifyOwnNamespace(
	checkEmail: string,
	checkNamespace: string | undefined,
): Promise<boolean> {
	//console.log("checkEmail:", checkEmail, "checkNamespace:", checkNamespace);
	if (checkNamespace === undefined) return false;
	const userInfo = await prisma.user.findUnique({
		where: {
			email: checkEmail,
		},
		select: {
			namespace_name: true,
			teams: {
				select: {
					team: {
						select: {
							namespace_name: true,
						},
					},
				},
			},
		},
	});
	//console.log("userInfo:", userInfo);

	// if councilor not belongs to user or his team, throw error
	if (userInfo?.namespace_name != checkNamespace) {
		let found = false;
		userInfo?.teams.forEach((Inteam) => {
			if (Inteam.team.namespace_name === checkNamespace) {
				found = true;
			}
		});
		if (!found) {
			return false;
		}
	}
	return true;
}

export async function ownNamespace(checkEmail: string) {
	//console.log("checkEmail:", checkEmail, "checkNamespace:", checkNamespace);
	const userInfo = await prisma.user.findUnique({
		where: {
			email: checkEmail,
		},
		select: {
			namespace_name: true,
			teams: {
				select: {
					team: {
						select: {
							namespace_name: true,
						},
					},
				},
			},
		},
	});
	const teamNamespaces = userInfo?.teams.map((team) => team.team.namespace_name);
	// append userInfo.namespace_name to teamNamespaces
	teamNamespaces?.push(userInfo?.namespace_name ? userInfo?.namespace_name : "NULL");
	//console.log("ownNamespace userInfo:", teamNamespaces);

	// if councilor not belongs to user or his team, throw error
	return { ownNamespace: teamNamespaces };
}

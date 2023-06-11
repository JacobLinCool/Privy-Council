import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function log(do_what: string, done_by: string, namespace: string) {
	console.log("---log---");
	const userInfo = await prisma.user.findUnique({
		where: {
			email: done_by,
		},
	});
	//console.log(userInfo);

	if (userInfo?.namespace_name === namespace) {
		// create log
		await prisma.log.create({
			data: {
				content: do_what,
				time: new Date(),
				user_id: userInfo?.id,
			},
		});
		return { success: true };
	} else {
		const teamInfo = await prisma.team.findUnique({
			where: {
				namespace_name: namespace,
			},
		});
		await prisma.log.create({
			data: {
				content: do_what,
				time: new Date(),
				user_id: userInfo?.id,
				team_id: teamInfo?.id,
			},
		});
		return { success: true };
	}
}

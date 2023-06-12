import { prisma } from "./prisma";
import debug from "debug";

const console_log = debug("app:log");

export async function log(do_what: string, done_by: string, namespace: string) {
	const user_info = await prisma.user.findUnique({
		where: {
			email: done_by,
		},
	});
	console_log(user_info);

	if (user_info?.namespace_name === namespace) {
		await prisma.log.create({
			data: {
				content: do_what,
				time: new Date(),
				user_id: user_info?.id,
			},
		});
		return { success: true };
	} else {
		const team_info = await prisma.team.findUnique({
			where: {
				namespace_name: namespace,
			},
		});
		await prisma.log.create({
			data: {
				content: do_what,
				time: new Date(),
				user_id: user_info?.id,
				team_id: team_info?.id,
			},
		});
		return { success: true };
	}
}

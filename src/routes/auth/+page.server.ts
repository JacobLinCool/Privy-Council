import debug from "debug";
import { verify, JWT } from "sveltekit-jwt";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

const log = debug("app:auth");
log.enabled = true;

export const load: PageServerLoad = async ({ url, cookies }) => {
	const token = url.searchParams.get("token");
	if (!token) {
		return { ok: false };
	}

	const ok = await verify(token);
	log("token verified", ok);
	const { payload } = JWT.decode(token);

	if (!ok || !payload.sub) {
		return { ok: false };
	}

	cookies.set("token", token, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 12,
	});

	const user = await prisma.user.upsert({
		where: { email: payload.sub },
		update: {},
		create: {
			email: payload.sub,
			name: payload.sub.split("@")[0],
			bio: "",
			namespace: {
				create: {
					name:
						payload.sub.split("@")[0].toLowerCase() +
						"-" +
						Math.random().toString(36).slice(2, 8),
				},
			},
		},
		include: { namespace: true },
	});
	log("user", user);

	return { ok: true };
};

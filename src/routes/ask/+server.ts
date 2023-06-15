import { openai } from "$lib/server/generate";
import type { Councilor } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		throw error(401, "Unauthorized");
	}

	const req: { question: string; councilor: Councilor } = await request.json();

	const res = await openai.createChatCompletion({
		model: req.councilor.model,
		messages: [
			{
				role: "user",
				content:
					`I am ${locals.user.name}. You are a ` +
					req.councilor.name +
					", your trait is " +
					req.councilor.trait +
					". ",
			},
			{ role: "assistant", content: "Understood." },
			{ role: "user", content: req.question.substring(0, 200) },
		],
		max_tokens: 300,
		temperature: 0,
	});

	return json({
		answer: res.data.choices[0].message?.content || "Something went wrong.",
	});
};

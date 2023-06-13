import { Configuration, OpenAIApi } from "openai";
import { env } from "$env/dynamic/private";
import { prisma } from "$lib/server/prisma";

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class Councilor {
	name: string;
	model: string;
	trait: string;
	prompt: string;

	constructor(name: string, model: string, trait: string) {
		this.name = name;
		this.model = model;
		this.trait = trait;
		this.prompt = "Now you are a " + name + ", your trait is" + trait + ". ";
	}

	async ask(): Promise<string> {
		if (this.prompt === "") return "";

		const respond = await openai.createChatCompletion({
			model: this.model,
			messages: [{ role: "user", content: this.prompt }],
		});
		return JSON.stringify(respond.data);
	}
}

class Committee {
	speaker: Councilor;
	councilors: Councilor[];
	divide_limit = 3;
	check_limit = 3;
	works: string[] = [];
	final_works: string[] = [];

	constructor(speaker: Councilor, councilors: Councilor[]) {
		this.speaker = speaker;
		this.councilors = councilors;
	}

	create_divide_speaker(input: string) {
		const divide_speaker = this.speaker;

		divide_speaker.prompt +=
			"Now you need to finish this work," + input + ", and you are a PM.";
		divide_speaker.prompt += "You need to divide work to following workers, ";
		this.councilors.forEach((councilor) => {
			divide_speaker.prompt += councilor.name + ", ";
		});
		divide_speaker.prompt +=
			"You need to list all work with new line, and do not say any redundancy word.";

		return divide_speaker;
	}

	create_final_speaker(input: string) {
		const final_speaker = this.speaker;

		final_speaker.prompt +=
			"Please check following works could meet request that " + input + ".";

		this.final_works.forEach((final_work) => {
			final_speaker.prompt += final_work;
		});

		return final_speaker;
	}

	async divide_work(input: string) {
		const divide_speaker = this.create_divide_speaker(input);

		let counter = this.divide_limit;
		while (this.works.length != this.councilors.length) {
			let respond: string;
			try {
				respond = await divide_speaker.ask();
			} catch {
				throw new Error("fail to divide works");
			}

			this.works = respond.split("\n");

			if (counter == 0) throw new Error("fail to devide works");
			counter--;
		}

		for (let i = 0; i < this.councilors.length; i++) {
			this.councilors[i].prompt +=
				"Your need to finish" + this.works[i] + "." + "Please show how to finish.";
		}
	}

	async finish_work(input: string) {
		for (let i = 0; i < this.councilors.length; i++) {
			try {
				this.final_works[i] = await this.councilors[i].ask();
			} catch {
				throw new Error(this.councilors[i].name + "fail to finish work");
			}
		}

		const final_speaker = this.create_final_speaker(input);

		let counter = this.check_limit;
		let allow = false;
		let final = "";

		while (allow == false) {
			try {
				final = await final_speaker.ask();
			} catch {
				throw new Error("fail to check");
			}
			if (final.toLocaleLowerCase().includes("yes")) {
				allow = true;
			}

			if (counter == 0) throw new Error("answer are not allow");
			counter--;
		}

		let final_respond = "Here are each worker need to finish:\n";
		for (let i = 0; i < this.councilors.length; i++) {
			final_respond += this.councilors[i].name + ": " + this.final_works[i] + "\n";
		}
		return final_respond;
	}
}

class Conversation {
	input: string;
	intermediate: string[];
	committee: Committee;

	constructor(input: string, committee: Committee) {
		this.input = input;
		this.intermediate = [];
		this.committee = committee;
	}

	async generate() {
		await this.committee.divide_work(this.input);
		await this.committee.finish_work(this.input);
		this.intermediate = this.committee.final_works;
		return this.committee.final_works[0];
	}
}

export async function start_conversation(input: string, committee_id: number) {
	const data = await prisma.committee.findUnique({
		where: {
			id: committee_id,
		},
		include: {
			speaker: {
				include: {
					slots: {
						select: {
							library: {
								select: {
									data: true,
								},
							},
						},
					},
				},
			},
			councilors: {
				include: {
					slots: {
						select: {
							library: {
								select: {
									data: true,
								},
							},
						},
					},
				},
			},
		},
	});

	const speaker = new Councilor(data.speaker.name, data.speaker.model, data.speaker.trait);
	const councilors: Councilor[] = [];
	for (let i = 0; i < data.councilors.length; i++) {
		councilors.push(
			new Councilor(
				data.councilors[i].name,
				data.councilors[i].model,
				data.councilors[i].trait,
			),
		);
	}
	const committee = new Committee(speaker, councilors);
	const conversation = new Conversation(input, committee);

	let output: any;
	try {
		output = await conversation.generate();
		return output;
	} catch {
		return output;
	}
}

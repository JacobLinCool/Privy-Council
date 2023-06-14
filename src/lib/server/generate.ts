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
		this.prompt = "Now you are a " + name + ", your trait is " + trait + ". ";
	}

	async ask(): Promise<string> {
		console.log("prompt: ", this.prompt, "[prompt END]");
		const respond = await openai.createChatCompletion({
			model: this.model,
			messages: [{ role: "user", content: this.prompt }],
		});
		return respond.data.choices[0].message?.content || "";
	}

	async ask_divide_work(councilors: Councilor[]): Promise<string[]> {
		if (this.model != "gpt-3.5-turbo-0613" && this.model != "gpt-4-0613-4") {
			console.log("prompt: ", this.prompt, "[prompt END]");
			const respond = await openai.createChatCompletion({
				model: this.model,
				messages: [{ role: "user", content: this.prompt }],
			});
			const work_string = respond.data.choices[0].message?.content || "";
			//this.works = respond.split("\n");
			// respond split by [START] and [FINISH], save the string after [START] and before [FINISH]
			let works = work_string.split(/\[START\]|\[FINISH\]/g).filter((x) => x !== "");
			// remove all '\n', and remove all empty string
			works = works.map((x) => x.replace(/\n/g, "")).filter((x) => x !== "");
			// remove all string with only space
			works = works.filter((x) => x.replace(/\s/g, "") !== "");

			return works;
		} else {
			console.log("send respond...");

			const works: string[] = [];

			for (let i = 0; i < councilors.length; i++) {
				const prompt =
					this.prompt +
					"Now you need to deside what " +
					councilors[i].name +
					" should do.";

				const respond = await openai.createChatCompletion({
					model: this.model,
					messages: [
						{
							role: "user",
							content: prompt,
						},
					],
					functions: [
						{
							name: "divide_works",
							description: "Divde work to each worker",
							parameters: {
								type: "object",
								properties: {
									worker: { type: "string" },
									work: { type: "string" },
								},
							},
						},
					],
					function_call: { name: "divide_works" },
				});

				const work_json = respond.data.choices[0].message?.function_call?.arguments;
				if (work_json === undefined) return [];
				const work = JSON.parse(work_json).work;

				works.push(work);
			}

			return works;
		}
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
			'Now you need to finish the work - "' + input + '". And you are a PM.';
		divide_speaker.prompt += "You need to divide work to following workers, ";
		this.councilors.forEach((councilor) => {
			divide_speaker.prompt += councilor.name + ", ";
		});
		divide_speaker.prompt +=
			'You need to show what each worker need to do overall in just one line. Starting by adding "[START]" before each worker. Finished by adding "[FINISH]" after each worker. Show in order. And do not say any recudency word.';

		return divide_speaker;
	}

	create_final_speaker(input: string) {
		const final_speaker = this.speaker;
		final_speaker.prompt = "";

		this.final_works.forEach((final_work) => {
			final_speaker.prompt += final_work;
		});

		final_speaker.prompt +=
			"You are a scoring teacher, the following works could complete " +
			input +
			"? you only can reply YES or NO.";

		return final_speaker;
	}

	async divide_work(input: string) {
		const divide_speaker = this.create_divide_speaker(input);

		try {
			this.works = await divide_speaker.ask_divide_work(this.councilors);
		} catch {
			throw new Error("fail to divide works");
		}

		console.log("this.works: ", this.works);

		for (let i = 0; i < this.councilors.length; i++) {
			this.councilors[i].prompt +=
				'Your need to finish the work-"' +
				this.works[i] +
				'".' +
				"Please show how to finish.";
		}
	}

	async working() {
		this.final_works = [];
		for (let i = 0; i < this.councilors.length; i++) {
			try {
				this.final_works[i] = await this.councilors[i].ask();
				console.log('"""' + this.final_works[i] + '"""');
			} catch {
				throw new Error(this.councilors[i].name + "fail to finish work");
			}
		}
	}

	async finish_work(input: string) {
		const final_speaker = this.create_final_speaker(input);

		let counter = this.check_limit;
		let allow = false;
		let final = "";
		await this.working();

		while (allow == false) {
			try {
				final = await final_speaker.ask();
				console.log("CHECK:", final);
			} catch {
				throw new Error("fail to check");
			}
			if (final.toLocaleLowerCase().includes("yes")) {
				allow = true;
			}

			if (counter == 0) console.log("answer are not allow");
			counter--;
		}

		let final_respond = "Here are each worker need to finish:\n\n";
		for (let i = 0; i < this.councilors.length; i++) {
			final_respond +=
				(i + 1).toString() +
				". " +
				this.councilors[i].name +
				": " +
				this.final_works[i] +
				"\n\n";
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
		console.log("divwork fin");
		const output = await this.committee.finish_work(this.input);
		console.log("finwork fin");
		this.intermediate = this.committee.works;
		return output;
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
	if (data == null) throw Error("can not get data");

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

	let intermediate = "";
	conversation.intermediate.forEach((work) => {
		intermediate += work;
	});

	try {
		const output = await conversation.generate();

		return { conversation: output, intermediate: intermediate };
	} catch {
		throw new Error("Fail to generate conversation");
	}
}

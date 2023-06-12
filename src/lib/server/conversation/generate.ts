import { Configuration, OpenAIApi } from "openai";
import { env } from "$env/dynamic/private";

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
	limit = 3;
	works: string[] = [];
	final_works: string[] = [];

	constructor(speaker: Councilor, councilors: Councilor[]) {
		this.speaker = speaker;
		this.councilors = councilors;
	}

	create_divide_speaker(input: string) {
		const divide_speaker: Councilor = this.speaker;
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

	create_final_speaker() {
		const final_speaker: Councilor = this.speaker;
		final_speaker.prompt += "You need to concultion following text and extract abstract.";

		this.final_works.forEach((final_work) => {
			final_speaker.prompt += final_work;
		});

		return final_speaker;
	}

	async divide_work(input: string) {
		const divide_speaker: Councilor = this.create_divide_speaker(input);

		let counter: number = this.limit;
		while (this.works.length != this.councilors.length) {
			let respond: string;
			try {
				respond = await divide_speaker.ask();
			} catch {
				throw "fail to divide works";
			}

			this.works = respond.split("\n");

			if (counter == 0) throw "false to devide works";
			counter--;
		}

		for (let i = 0; i < this.councilors.length; i++) {
			this.councilors[i].prompt +=
				"Your need to finish" + this.works[i] + "." + "Please show how to finish.";
		}
	}

	async finish_work() {
		for (let i = 0; i < this.councilors.length; i++) {
			try {
				this.final_works[i] = await this.councilors[i].ask();
			} catch {
				throw this.councilors[i].name + "fail to finish work";
			}
		}

		const final_speaker: Councilor = this.create_final_speaker();

		try {
			const final: string = await final_speaker.ask();
			return final;
		} catch {
			throw "fail to concultion";
		}
	}
}

class Coneversation {
	input: string;
	intermediate: string[];
	committee: Committee;

	constructor(input: string, committee: Committee) {
		this.input = input;
		this.intermediate = [];
		this.committee = committee;
	}

	async generate() {
		this.committee.divide_work(this.input);
		return this.committee.final_works[0];
	}
}

export { Committee, Coneversation };

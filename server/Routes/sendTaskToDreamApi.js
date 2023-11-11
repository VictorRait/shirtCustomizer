// import express from "express";
// import * as dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();
// const router = express.Router();

// const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// router.route("/").get((req, res) => {
// 	res.status(200).json({message: "Hello from DALL.E ROUTES"});
// });

// router.route("/generateImage").post(async (req, res) => {
// 	try {
// 		const {prompt} = req.body;
// 		console.log(prompt);
// 		const response = await openai.API.create({
// 			engine: "dall-e-3",
// 			prompt,
// 			n: 1,
// 			max_tokens: 64, // Adjust token count as needed
// 			// Other parameters you want to configure
// 		});

// 		console.log("response", response);
// 		const image = response.data[0].text; // Adjust based on response structure
// 		res.status(200).json({photo: image});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({message: "Something went wrong"});
// 	}
// });

// export default router;

// steps in using dream api

import axios from "axios";

export async function sendTaskToDreamAPI(prompt) {
	const BASE_URL = "https://api.luan.tools/api/tasks/";
	const apiKey = "Zp6skQDLf57P5BwnpIeA1PTCnhyY6rsi"; // Replace with your actual Dream API key

	const headers = {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json",
	};

	try {
		// Step 1) make a POST request to the Dream API to create a task
		const response = await axios.post(
			BASE_URL,
			{use_target_image: false},
			{headers}
		);
		console.log(response.data);
		console.log("Step 1 Complete!");

		// Extracting the task ID from the response
		const taskId = response.data.id;
		const taskUrl = BASE_URL + taskId;

		// Step 3) make a PUT request to set the parameters for the task
		const putPayload = {
			input_spec: {
				style: 8,
				prompt: prompt,
				target_image_weight: 0.1,
				width: 1024,
				height: 1024,
			},
		};
		await axios.put(taskUrl, putPayload, {headers});
		console.log("Step 3 Complete!");

		// Step 4) Polling for image generation and fetching the result
		while (true) {
			const getResponse = await axios.get(taskUrl, {headers});
			const state = getResponse.data.state;

			if (state === "generating") {
				console.log("generating");
			} else if (state === "failed") {
				console.log("failed!");
				break;
			} else if (state === "completed") {
				console.log(getResponse.data);
				const finalUrl = getResponse.data.result;

				const imageBuffer = await axios
					.get(finalUrl, {responseType: "arraybuffer"})
					.then((response) => response.data);
				const base64Image = Buffer.from(imageBuffer).toString("base64");

				// Return the base64 encoded image
				return finalUrl;
			}

			await new Promise((resolve) => setTimeout(resolve, 4000));
		}
	} catch (error) {
		console.error(error);
		throw new Error("Something went wrong in generating the image");
	}
}

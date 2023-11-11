import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import {sendTaskToDreamAPI} from "./Routes/sendTaskToDreamApi.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({limit: "50mb"}));

app.post("/api/v1/dalle/generateImage", async (req, res) => {
	const {prompt} = req.body; // Assuming prompt and styleId are sent in the request body

	if (!prompt) {
		return res.status(400).json({message: "Missing prompt"});
	}

	try {
		const base64Image = await sendTaskToDreamAPI(prompt);

		if (base64Image) {
			res.status(200).json({image: base64Image});
		} else {
			throw new Error("Failed to generate image");
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({message: "Failed to generate image"});
	}
});

app.get("/", (req, res) => {
	res.status(200).json({message: "Hello from DALL.E"});
});

app.listen(5000, () => console.log("Server has started on port 5000"));

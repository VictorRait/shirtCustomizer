import config from "../config/config";
import state from "../store";
import {download} from "../assets";
import {downloadCanvasToImage, reader} from "../config/helpers";
import {EditorTabs, FilterTabs, DecalTypes} from "../config/constants";
import {fadeAnimation, slideAnimation} from "../config/motion";
import {
	AIPicker,
	FilePicker,
	ColorPicker,
	Tab,
	CustomButton,
} from "../components";
import {AnimatePresence, motion} from "framer-motion";
import {useSnapshot} from "valtio";
import {useState} from "react";
const Customizer = () => {
	const snap = useSnapshot(state);
	const [file, setFile] = useState("");
	const [prompt, setPrompt] = useState("");
	const [generatingImg, setGeneratingImg] = useState(false);
	const [activeEditorTab, setActiveEditorTab] = useState("");
	const [activeFilterTab, setActiveFilterTab] = useState({
		logoShirt: true,
		stylishShirt: false,
	});
	// show tab content depentding on tthe activeTab
	const generateTabContent = () => {
		switch (activeEditorTab) {
			case "colorpicker":
				return <ColorPicker />;

			case "filepicker":
				return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
			case "aipicker":
				return (
					<AIPicker
						prompt={prompt}
						setPrompt={setPrompt}
						generatingImg={generatingImg}
						handleSubmit={handleSubmit}
					/>
				);
			default:
				return null;
		}
	};
	async function handleSubmit(type) {
		if (!prompt) return alert("Please enter a prompt");
		try {
			setGeneratingImg(true);
			const response = await fetch(
				"http://localhost:5000/api/v1/dalle/generateImage",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({prompt}),
				}
			);
			console.log(response);
			const data = await response.json();

			if (!data)
				throw new Error(
					"Problem generating Image, max generation maybe reached"
				);
			handleDecals(type, data.image);
		} catch (error) {
			alert(error);
		} finally {
			setGeneratingImg(false);
			setActiveEditorTab("");
		}
	}
	function handleDecals(type, result) {
		const decalType = DecalTypes[type];
		state[decalType.stateProperty] = result;
		console.log(decalType, activeFilterTab[decalType.filterTab]);
		if (!activeFilterTab[decalType.filterTab])
			handleActiveFilterTab(decalType.filterTab);
	}
	function handleActiveFilterTab(tabName) {
		switch (tabName) {
			case "logoShirt":
				state.isLogoTexture = !activeFilterTab[tabName];
				break;
			case "stylishShirt":
				state.isFullTexture = !activeFilterTab[tabName];
				break;
			default:
				state.isLogoTexture = true;
				state.isFullTexture = false;
		}

		setActiveFilterTab((prevState) => {
			return {...prevState, [tabName]: !prevState[tabName]};
		});
	}
	function readFile(type) {
		reader(file).then((result) => {
			handleDecals(type, result);
			setActiveEditorTab("");
		});
	}

	return (
		<AnimatePresence>
			{!snap.intro && (
				<>
					<motion.div
						key="custom"
						className="absolute top-0 left-0 z-10"
						{...slideAnimation("left")}>
						<div className="flex items-center min-h-screen">
							<div className="editortabs-container tabs">
								{EditorTabs.map((tab) => (
									<Tab
										key={tab.name}
										tab={tab}
										handleClick={() => setActiveEditorTab(tab.name)}
									/>
								))}
								{generateTabContent()}
							</div>
						</div>
					</motion.div>
					<motion.div
						className="absolute z-10 top-5 right-5"
						{...fadeAnimation}>
						<CustomButton
							type="filled"
							title="Go Back"
							handleClick={() => (state.intro = true)}
							customStyles="w-fit px-4 py-2.5 font-bold text-sm "
						/>
					</motion.div>
					<motion.div
						className="filtertabs-container "
						{...slideAnimation("up")}>
						{FilterTabs.map((tab) => (
							<Tab
								key={tab.name}
								isFilterTab
								isActiveTab={activeFilterTab[tab.name]}
								tab={tab}
								handleClick={() => {
									handleActiveFilterTab(tab.name);
								}}
							/>
						))}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default Customizer;

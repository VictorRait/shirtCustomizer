import CustomButton from "./CustomButton";

function AIPicker({prompt, setPrompt, generatingImg, handleSubmit}) {
	return (
		<div className="aipicker-container">
			<textarea
				className="aipicker-textarea placeholder-slate-500 "
				placeholder="AI generation is limited. Use of Dream by Wombo Api "
				rows={5}
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
			/>
			<div className="flex flex-wrap gap-5">
				{generatingImg ? (
					<CustomButton
						type="outline"
						title="Asking AI..."
						customStyles="text-xs"
					/>
				) : (
					<>
						<CustomButton
							type="outline"
							title="AI Logo"
							handleClick={() => handleSubmit("logo")}
							customStyles="text-xs"
						/>
						<CustomButton
							type="filled"
							title="AI Full"
							handleClick={() => handleSubmit("full")}
							customStyles="text-xs"
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AIPicker;

import {motion, AnimatePresence} from "framer-motion";
import {useSnapshot} from "valtio";
import {CustomButton} from "../components";
import {
	headContainerAnimation,
	headContentAnimation,
	headTextAnimation,
	slideAnimation,
} from "../config/motion";
import state from "../store";

const Home = () => {
	const snap = useSnapshot(state);

	return (
		<AnimatePresence>
			{snap.intro && (
				<motion.section className="home" {...slideAnimation("left")}>
					<motion.header {...slideAnimation("down")}>
						<img
							src="./threejs.png"
							alt="logo"
							className="w-8 h-8 object-contain"
						/>
						<img
							src={`https://luan-images.wombo.art/generated/206b07b2-41fd-4aac-ba1e-4f75f9b7debb/final.jpg?Expires=1699673842&Signature=Q41RD6UHkhKccXp2yv4PSn2TxfjrCPcs1hn8ZjeR--HvsP4qY-dOkCsWx4c4jl~xLgrhYHU15WsvF7xV6vlf0jO5~0-WFWPqVnQm68nNdC4X5Amq-J-WeTdU9Padj8ZX9y1QOIRnVGNz7eFGf4geoN6w6qNTrlWDpSeR9-gXzU1dyysLQlz-EfsNfIAg9iwx~BfcvS0rUKOGJAuZZGK2KObOcddC7I4so4Cn7IQwPVV0oJMsfRGJCYoHPNDUDA-t~xAKGPVvPj02GOZU9fOqvP3DEo9-Fqx9D5uqAN879c7Nvk43-LKEMwO~Lhifqj430CzthTcO5C2CYD6g61skIg__&Key-Pair-Id=KYPMZXZJT38IY`}
							alt="Base64 Image"
						/>
					</motion.header>
					<motion.div className="home-content" {...headContainerAnimation}>
						<motion.div {...headTextAnimation}>
							<h1 className="head-text">
								LET'S <br className="xl:block hidden" /> DO IT
							</h1>
						</motion.div>
						<motion.div
							{...headContentAnimation}
							className="flex flex-col gap-5">
							<p className="max-w-md font-normal text-gray-600 text-base">
								Create your unique and exclusive shirt with our brand-new 3D
								customization tool. <strong>Unleash your imagination</strong>{" "}
								and define your own style.
							</p>
							<CustomButton
								type="filled"
								title="Customize It"
								handleClick={() => (state.intro = false)}
								customStyles="w-fit px-4 py-2.5 font-bold text-sm "
							/>
						</motion.div>
					</motion.div>
				</motion.section>
			)}
		</AnimatePresence>
	);
};

export default Home;

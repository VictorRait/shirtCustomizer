import {AccumulativeShadows, RandomizedLight} from "@react-three/drei";
import {useRef} from "react";

function Backdrop() {
	const shadows = useRef();
	return (
		<AccumulativeShadows
			ref={shadows}
			position={[0, 0, -0.14]}
			temporal
			frames={60}
			alphaTest={0.85}
			scale={10}
			rotation={[Math.PI / 2, 0, 0]}>
			<RandomizedLight
				amount={4}
				radius={9}
				intensity={1.5}
				ambient={0.25}
				position={[5, 5, -10]}
			/>
			<RandomizedLight
				amount={4}
				radius={5}
				intensity={0.5}
				ambient={1.8}
				position={[-5, 5, -9]}
			/>
		</AccumulativeShadows>
	);
}

export default Backdrop;

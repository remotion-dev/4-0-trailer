import {Composition} from 'remotion';
import {MyComposition} from './Composition';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={Math.round(20 * Math.PI * 4)}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};

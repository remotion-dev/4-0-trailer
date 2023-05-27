import {Composition} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {MyComposition} from './Composition';
import {RenderButton} from './RenderButton';
import {Sparks} from './Sparks';

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
			<Composition
				id="RenderButton"
				component={RenderButton}
				durationInFrames={200}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="Stars"
				component={Sparks}
				durationInFrames={200}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="Logo"
				component={TriangleOut}
				durationInFrames={200}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};

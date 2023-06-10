import {Composition} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {AudioViz} from './AudioViz';
import {MyComposition} from './Composition';
import {Cube, cubeSchema} from './Cube';
import {Main} from './Main';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {Sparks} from './Sparks';
import {Timeline} from './Timeline';

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
				durationInFrames={600}
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
				durationInFrames={1200}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="RenderProgress"
				component={RenderProgress}
				durationInFrames={1200}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="AudioViz"
				component={AudioViz}
				durationInFrames={1200}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={1500}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Cube"
				component={Cube}
				durationInFrames={60}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{label: '@remotion/tailwind', step: 1}}
				schema={cubeSchema}
			/>
			<Composition
				id="Timeline"
				component={Timeline}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};

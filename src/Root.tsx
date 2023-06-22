import {Composition} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {AudioViz} from './AudioViz';
import {MyComposition} from './Composition';
import {DistinctlyReact} from './DistinctlyReact';
import {FeatureMap} from './FeatureMap';
import {Main} from './Main';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';
import {Cube, cubeSchema} from './NumberedChapter';
import {Reencoding} from './ReEncoding';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {RightPaneLogo} from './RightPaneLogo';
import {RustLogo} from './RustLogo';
import {Sparks} from './Sparks';
import {Teaser} from './Teaser';
import {TimelinePerspective1, TimelinePerspective2} from './Timeline';
import {WaysToRender} from './WaysToRender';

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
				defaultProps={{
					str: 'Introducing Remotion 4.0',
				}}
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
				durationInFrames={1400}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={2000}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="NumberedChapter"
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
				component={TimelinePerspective1}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Timeline2"
				component={TimelinePerspective2}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					withAudio: true,
				}}
			/>
			<Composition
				id="NpmInitVideo"
				component={NpmIniVideo}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="ZodSupport"
				component={RightPaneLogo}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Teaser"
				component={Teaser}
				durationInFrames={15.4 * 30}
				fps={30}
				width={1080}
				height={1080}
			/>
			<Composition
				id="DistinctlyReact"
				component={DistinctlyReact}
				durationInFrames={Math.floor(22 * 25 + 44 / 100)}
				fps={25}
				width={1920 * 2}
				height={1080 * 2}
			/>
			<Composition
				id="WaysToRender"
				component={WaysToRender}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="RustLogo"
				component={RustLogo}
				durationInFrames={44.68 * 25}
				fps={25}
				width={1920 * 2}
				height={1080 * 2}
			/>
			<Composition
				id="Improvement"
				component={Reencoding}
				durationInFrames={12 * 25}
				fps={25}
				width={1920 * 2}
				height={1080 * 2}
			/>
			<Composition
				id="FeatureMap"
				component={FeatureMap}
				durationInFrames={12 * 25}
				fps={25}
				width={1920 * 2}
				height={1080 * 2}
			/>
		</>
	);
};

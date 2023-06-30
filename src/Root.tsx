import {Composition, Folder} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {AudioViz} from './AudioViz';
import {DiscoverRemotion4} from './DiscoverRemotion4';
import {DistinctlyReact} from './DistinctlyReact';
import {EndCard} from './EndCard';
import {Everything} from './Everything';
import {FeatureMap} from './FeatureMap';
import {InFrameLogo} from './InFrameLogo';
import {Main} from './Main';
import {NpmIniVideo} from './NpmInitVideo/NpmInitVideo';
import {Cube, cubeSchema} from './NumberedChapter';
import {OgImage, ogImageSchema} from './OgImage';
import {Reencoding} from './ReEncoding';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';
import {RightPaneLogo} from './RightPaneLogo';
import {RustLogo} from './RustLogo';
import {Spiral} from './Spiral';
import {Studio} from './Studio';
import {Teaser} from './Teaser';
import {Wheel} from './TeaserWheel';
import {TimelinePerspective1, TimelinePerspective2} from './Timeline';
import {WaysToRender} from './WaysToRender';
import {WrittenInReact} from './WrittenInReact';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Folder name="Intro">
				<Composition
					id="Intro"
					component={Main}
					durationInFrames={1900}
					fps={30}
					width={1920}
					height={1080}
				/>
			</Folder>
			<Folder name="IntroScenes">
				<Composition
					id="1-Logo"
					component={TriangleOut}
					durationInFrames={1200}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{
						background: 'white',
						dark: false,
					}}
				/>
				<Composition
					id="2-NpmInitVideo"
					component={NpmIniVideo}
					durationInFrames={600}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="3-Timeline"
					component={TimelinePerspective1}
					durationInFrames={600}
					fps={30}
					width={1920}
					height={1080}
				/>
				<Composition
					id="4-RenderButton"
					component={RenderButton}
					durationInFrames={600}
					fps={30}
					width={1280}
					height={720}
				/>
				<Composition
					id="5-RenderProgress"
					component={RenderProgress}
					durationInFrames={1200}
					fps={30}
					width={1280}
					height={720}
				/>
				<Composition
					id="6-Spiral"
					component={Spiral}
					durationInFrames={1200}
					fps={25}
					width={1920}
					height={1080}
				/>
				<Composition
					id="7-AudioTimeline"
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
					id="8-Studio"
					component={Studio}
					durationInFrames={1200}
					fps={25}
					width={1920}
					height={1080}
				/>
			</Folder>
			<Folder name="Throwaways">
				<Composition
					id="AudioViz"
					component={AudioViz}
					durationInFrames={1400}
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
					id="Everything"
					component={Everything}
					durationInFrames={300}
					fps={25}
					width={1920}
					height={1080}
				/>
			</Folder>
			<Folder name="KeynoteOverlays">
				<Composition
					id="RustLogo"
					component={RustLogo}
					durationInFrames={44.68 * 25}
					fps={25}
					width={1920 * 2}
					height={1080 * 2}
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
				<Composition
					id="Discover"
					component={DiscoverRemotion4}
					durationInFrames={700}
					fps={25}
					width={1920}
					height={1080}
				/>
				<Composition
					component={WrittenInReact}
					durationInFrames={500}
					fps={25}
					width={1920}
					height={1080}
					id="WrittenInReact"
				/>
				<Composition
					component={EndCard}
					durationInFrames={700}
					fps={25}
					width={1920}
					height={1080}
					id="EndCard"
				/>
			</Folder>
			<Folder name="SocialMediaAssets">
				<Composition
					id="Teaser"
					component={Teaser}
					durationInFrames={15.4 * 30}
					fps={30}
					width={1080}
					height={1080}
				/>
				<Composition
					id="OgImage"
					component={OgImage}
					durationInFrames={12 * 25}
					fps={25}
					width={1920 * 2}
					height={1080 * 2}
					schema={ogImageSchema}
					defaultProps={{
						dark: true,
					}}
				/>
				<Composition
					id="InFrameLogo"
					component={InFrameLogo}
					durationInFrames={100000}
					fps={25}
					width={1920 * 2}
					height={1080 * 1.5}
					defaultProps={{
						background: 'transparent',
					}}
				/>
				<Composition
					id="TeaserWheel"
					component={Wheel}
					durationInFrames={100000}
					fps={25}
					width={1080}
					height={1080}
					defaultProps={{
						topLayer: true,
					}}
				/>
			</Folder>
		</>
	);
};

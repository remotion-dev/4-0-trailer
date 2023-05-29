import React from 'react';
import {Audio, Series, staticFile} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {AudioViz} from './AudioViz';
import {RenderButton} from './RenderButton';
import {RenderProgress} from './RenderProgress';

export const Main: React.FC = () => {
	return (
		<>
			<Audio src={staticFile('illstandmyground.mp3')} />
			<Series>
				<Series.Sequence durationInFrames={9 * 30}>
					<TriangleOut />
				</Series.Sequence>
				<Series.Sequence durationInFrames={4 * 30}>
					<RenderButton />
				</Series.Sequence>
				<Series.Sequence durationInFrames={7 * 30}>
					<RenderProgress />
				</Series.Sequence>
				<Series.Sequence durationInFrames={4 * 30}>
					<AudioViz />
				</Series.Sequence>
			</Series>
		</>
	);
};

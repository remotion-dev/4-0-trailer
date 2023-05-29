import {Audio, staticFile} from 'remotion';
import React from 'react';
import {Series} from 'remotion';
import {TriangleOut} from './3DRemotionLogo';
import {RenderProgress} from './RenderProgress';

export const Main: React.FC = () => {
	return (
		<>
			<Audio src={staticFile('illstandmyground.mp3')} />
			<Series>
				<Series.Sequence durationInFrames={9 * 30}>
					<TriangleOut />
				</Series.Sequence>
				<Series.Sequence durationInFrames={9 * 30}>
					<RenderProgress />
				</Series.Sequence>
			</Series>
		</>
	);
};

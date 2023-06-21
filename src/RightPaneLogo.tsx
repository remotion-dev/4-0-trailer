import {parsePath, resetPath} from '@remotion/paths';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {centerPath} from './center';
import {BLUE} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {rotateX, rotateY, scaled, translateX, translateY} from './matrix';

export const RightPaneLogo: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	const viewBox = [-width / 4, -height / 2, width / 2, height];

	const frame = useCurrentFrame();

	const progress = (delay: number) =>
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			delay,
			durationInFrames: 60,
		});

	const inbetweenFaces = extrudeElement({
		points: parsePath(
			centerPath(
				resetPath(
					'M1825.05,4726.89L1250.49,4726.89L1040.57,4935.73L1517.16,5509.64L1555.18,5466.98L2026.94,4937.69L1825.05,4726.89Z'
				)
			)
		),
		depth: 30,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: BLUE,
		strokeWidth: 20,
		description: 'text',
		strokeColor: 'black',
	});

	const y = interpolate(progress(5), [0, 1], [1600, 400]);

	const rotated = transformElement(inbetweenFaces, [
		scaled(0.9),
		rotateX(progress(5) * -Math.PI * 0.2),
		rotateY((progress(5) * -Math.PI) / 8),
		translateY(y),
		translateX(30),
	]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					left: 'calc(50% - 10px)',
					width: '50%',
					borderLeft: '10px solid black',
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundColor: 'white',
					left: '50%',
					width: '50%',
				}}
			>
				<AbsoluteFill>
					<div
						style={{
							textAlign: 'center',
							fontFamily: 'Variable',
							fontSize: 80,
							marginTop: 140,
							fontVariationSettings: '"wght" 600',
							opacity: progress(0),
							translate:
								'0 ' + interpolate(progress(0), [0, 1], [100, 0]) + 'px',
						}}
					>
						Zod
					</div>
				</AbsoluteFill>
				<AbsoluteFill>
					<svg viewBox={viewBox.join(' ')}>
						<Faces elements={[rotated]} />
					</svg>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

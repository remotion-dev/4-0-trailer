import {
	getBoundingBox,
	parsePath,
	resetPath,
	serializeInstructions,
	translatePath,
} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {transformElement} from './element';
import {extrudeElement} from './join-inbetween-tiles';
import {translateZ} from './matrix';

const rotations = (frame: number, fps: number) => {
	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
	});

	return spr * Math.PI;
};

export const EmailSignature: React.FC<{
	background: string;
}> = ({background}) => {
	const {width, height, fps} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();

	const i = 1;

	const triangle = makeTriangle({
		direction: 'right',
		length: (1500 + i * 675) * 0.4,
		edgeRoundness: 0.71,
	});
	const path = resetPath(triangle.path);
	const boundingBox = getBoundingBox(path);
	const boxWidth = boundingBox.x2 - boundingBox.x1;
	const boxHeight = boundingBox.y2 - boundingBox.y1;

	const parsed = parsePath(translatePath(path, -boxWidth / 2, -boxHeight / 2));

	const depth = (5 + frame / 20) * 0;
	const spread = depth + (frame / 1.2) * 7.5;

	const color = '#C1DBF9';

	const extruded = extrudeElement({
		backFaceColor: color,
		sideColor: 'transparent',
		frontFaceColor: color,
		depth,
		points: parsed,
		strokeWidth: 0,
		description: `triangle-${i}`,
		strokeColor: 'transparent',
		crispEdges: false,
	});

	const edge =
		(spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			durationInFrames: 30,
		}) -
			spring({
				fps,
				frame,
				config: {
					damping: 200,
				},
				durationInFrames: 30,
				delay: 20,
			})) *
		40;

	const projected = transformElement(extruded, [
		translateZ(spread * i - spread),
	]);

	const paths = [projected];

	return (
		<AbsoluteFill
			style={{
				backgroundColor: background,
				perspective: 200,
			}}
		>
			<AbsoluteFill
				style={{
					perspective: 1000,
				}}
			>
				<svg
					viewBox={viewBox.join(' ')}
					style={{
						overflow: 'visible',
					}}
				>
					<path
						d={serializeInstructions(parsed)}
						fill="red"
						style={{
							transform: `rotateZ(${rotations(frame, fps)}rad)`,
							transformOrigin: triangle.transformOrigin,
						}}
					/>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

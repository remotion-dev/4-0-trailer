import {parsePath, resetPath} from '@remotion/paths';
import {makeTriangle} from '@remotion/shapes';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {centerPath} from './center';
import {BLUE} from './colors';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {transformElements} from './map-face';
import {rotateY} from './matrix';

const viewBox = [-540, -540, 1080, 1080];

export const Teaser: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const font = useFont();

	if (!font) {
		return null;
	}

	const text = getText({font, text: '4', size: 400});

	const i = 0;

	const triangle = makeTriangle({
		direction: 'right',
		length: 400,
		edgeRoundness: 0.71,
	});
	const path = centerPath(resetPath(triangle.path));
	const parsed = parsePath(path);

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 50,
		delay: 30,
	});

	const depth = 25;

	const extruded = extrudeElement({
		backFaceColor: 'white',
		sideColor: 'black',
		frontFaceColor: BLUE,
		depth,
		points: parsed,
		strokeWidth: 20,
		description: `triangle-${i}`,
		strokeColor: 'black',
	});

	const textFace = extrudeElement({
		backFaceColor: 'white',
		depth,
		points: parsePath(centerPath(resetPath(text.path))),
		strokeWidth: 20,
		description: `text-${i}`,
		strokeColor: 'black',
		frontFaceColor: BLUE,
		sideColor: 'black',
	});

	const projected = transformElements([extruded], [rotateY(-spr * Math.PI)]);
	const projected2 = transformElements(
		[textFace],
		[rotateY(Math.PI - spr * Math.PI)]
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg
				viewBox={viewBox.join(' ')}
				style={{
					overflow: 'visible',
				}}
			>
				<Faces elements={spr <= 0.5 ? projected : projected2} />
			</svg>
		</AbsoluteFill>
	);
};

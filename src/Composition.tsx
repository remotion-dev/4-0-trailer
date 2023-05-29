import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {translated} from './matrix';
import {FaceType} from './map-face';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {projectPoints} from './project-points';

const scale = 1;

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const text = useText('4.0');
	if (!text) {
		return null;
	}

	const scaled = resetPath(scalePath(resetPath(text.path), scale, scale));
	const bBox = getBoundingBox(scaled);

	const parsed = turnInto3D(parsePath(scaled));

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const depth = 200;

	const inbetweenFaces: FaceType[] = extrudeInstructions({
		instructions: {
			points: parsed,
			color: '#0b84f3',
			shouldDrawLine: true,
			isStroke: false,
			centerPoint: [0, 0, 0, 1],
		},
		depth,
		sideColor: 'black',
		frontFaceColor: 'red',
		backFaceColor: 'blue',
		drawSegmentLines: true,
	});

	const rotatedFaces = inbetweenFaces.map((face) => {
		return projectPoints({
			face,
			transformations: [translated([-width / 2, -height / 2, 0])],
		});
	});

	return (
		<svg
			viewBox="-800 -800 1600 1600"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			<Faces
				faces={rotatedFaces}
				camera={getCamera(width, height, [
					Math.sin(frame / 100) * 10,
					0,
					Math.cos(frame / 100) * 10,
				])}
			/>
		</svg>
	);
};

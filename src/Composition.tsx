import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {useText} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, projectFaces} from './map-face';
import {translated} from './matrix';

const scale = 1;

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const text = useText('4.0');
	if (!text) {
		return null;
	}

	const scaled = resetPath(scalePath(resetPath(text.path), scale, scale));
	const bBox = getBoundingBox(scaled);

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const depth = 200;

	const inbetweenFaces: FaceType[] = extrudeInstructions({
		points: parsePath(scaled),
		shouldDrawLine: true,
		depth,
		sideColor: 'black',
		frontFaceColor: 'red',
		backFaceColor: 'blue',
		strokeWidth: 10,
	});

	const rotatedFaces = projectFaces({
		faces: inbetweenFaces,
		transformations: [translated([-width / 2, -height / 2, 0])],
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

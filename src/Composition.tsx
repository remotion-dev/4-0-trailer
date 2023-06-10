import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, sortFacesZIndex, transformFaces} from './map-face';
import {rotateY, translateX, translateY} from './matrix';

const scale = 1;

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const font = useFont();
	if (!font) {
		return null;
	}

	const text = getText({font, text: '4.0'});

	const scaled = resetPath(scalePath(resetPath(text.path), scale, scale));
	const bBox = getBoundingBox(scaled);

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const depth = 20;

	const inbetweenFaces: FaceType[] = extrudeInstructions({
		points: parsePath(scaled),
		shouldDrawLine: true,
		depth,
		sideColor: 'black',
		frontFaceColor: 'red',
		backFaceColor: 'blue',
		strokeWidth: 10,
	});

	const rotatedFaces = sortFacesZIndex(
		transformFaces({
			faces: inbetweenFaces,
			transformations: [
				translateX(-width / 2),
				translateY(-height / 2),
				rotateY(frame / 100),
			],
		})
	);

	return (
		<svg
			viewBox="-800 -800 1600 1600"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			<Faces
				elements={[rotatedFaces]}
				sort={false}
				camera={getCamera(width, height)}
			/>
		</svg>
	);
};

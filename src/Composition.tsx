import {getBoundingBox, parsePath, resetPath} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {getCamera} from './camera';
import {makeElement, transformElement} from './element';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {rotateY} from './matrix';

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const font = useFont();
	if (!font) {
		return null;
	}

	const text = getText({font, text: '4'});

	const scaled = resetPath(text.path);
	const bBox = getBoundingBox(scaled);

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const depth = 150;

	const inbetweenFaces = makeElement(
		extrudeInstructions({
			points: parsePath(scaled),
			depth,
			sideColor: 'green',
			frontFaceColor: 'red',
			backFaceColor: 'blue',
			strokeWidth: 10,
		})
	);

	const rotatedFaces = transformElement(inbetweenFaces, [rotateY(frame / 100)]);

	return (
		<svg
			viewBox="-800 -800 1600 1600"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			<Faces elements={[rotatedFaces]} camera={getCamera(width, height)} />
		</svg>
	);
};

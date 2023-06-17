import {parsePath, resetPath} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, sortFacesZIndex, transformFaces} from './map-face';
import {rotateY} from './matrix';

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const font = useFont();
	if (!font) {
		return null;
	}

	const text = getText({font, text: '4'});

	const scaled = resetPath(text.path);

	const depth = 150;

	const inbetweenFaces: FaceType[] = extrudeInstructions({
		points: parsePath(scaled),
		depth,
		sideColor: 'green',
		frontFaceColor: 'red',
		backFaceColor: 'blue',
		strokeWidth: 10,
	});

	const rotatedFaces = sortFacesZIndex(
		transformFaces({
			faces: inbetweenFaces,
			transformations: [rotateY(frame / 100)],
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
			<Faces elements={[rotatedFaces]} />
		</svg>
	);
};

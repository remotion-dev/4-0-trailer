import {
	parsePath,
	reduceInstructions,
	resetPath,
	scalePath,
} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {Camera, setupCamera, Vector} from './multiply';
import {Face} from './Face';
import {
	FaceType,
	projectPoints,
	sortFacesZIndex,
	translateSvgInstruction,
} from './map-face';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {joinInbetweenTiles} from './join-inbetween-tiles';
import {subdivideInstructions} from './subdivide-instruction';

const scale = 1;

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const text = useText('4.0');
	if (!text) {
		return null;
	}

	const scaled = resetPath(scalePath(resetPath(text.path), scale, scale));
	const bBox = getBoundingBox(scaled);

	const parsed = subdivideInstructions(
		subdivideInstructions(
			subdivideInstructions(turnInto3D(reduceInstructions(parsePath(scaled))))
		)
	);

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const facePerSubpath: FaceType = {
		points: parsed,
		color: '#0b84f3',
		shouldDrawLine: true,
		isStroke: false,
	};
	const depth = 20;

	const mainFaces: FaceType[] = [
		facePerSubpath,
		{
			...facePerSubpath,
			points: facePerSubpath.points.map((p) => {
				return translateSvgInstruction(p, 0, 0, -depth);
			}),
		},
	];
	const inbetweenFaces: FaceType[] = joinInbetweenTiles(
		facePerSubpath.points,
		depth
	);

	const camAngle = Math.PI / 12;

	const cam: Camera = {
		eye: [0, 0, 1 / Math.tan(camAngle / 2) - 1] as Vector,
		coa: [0, 0, 0],
		up: [0, 1, 0],
		near: 400,
		far: 500,
		angle: camAngle,
	};
	const vSphereCenter = [width / 2, height / 2];
	const vSphereRadius = Math.min(...vSphereCenter);

	const area = [
		-vSphereRadius,
		-vSphereRadius,
		vSphereRadius,
		vSphereRadius,
	] as const;
	const camera = setupCamera(area, 100, cam);

	const rotatedFaces = sortFacesZIndex(
		inbetweenFaces.map((face) => {
			return projectPoints({
				points: face.points,
				shouldDrawLine: face.shouldDrawLine,
				frame,
				camera,
				color: face.color,
				depth,
				height,
				width,
				isStroke: face.isStroke,
			});
		})
	);
	const [bottomFace, topFace] = sortFacesZIndex(
		mainFaces.map(({points, shouldDrawLine, color, isStroke}) =>
			projectPoints({
				points,
				frame,
				camera,
				color,
				shouldDrawLine,
				depth,
				height,
				width,
				isStroke,
			})
		)
	);

	return (
		<svg
			viewBox="-800 -800 1600 1600"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			{[bottomFace, ...rotatedFaces, topFace].map(
				({color, points, shouldDrawLine}, i) => {
					return (
						<Face
							key={JSON.stringify(points) + i}
							color={color}
							points={points}
							shouldDrawLine={shouldDrawLine}
						/>
					);
				}
			)}
		</svg>
	);
};

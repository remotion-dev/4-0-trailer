import {
	parsePath,
	ReducedInstruction,
	reduceInstructions,
	resetPath,
	scalePath,
} from '@remotion/paths';
import {getBoundingBoxFromInstructions} from '@remotion/paths/dist/get-bounding-box';
import {useCurrentFrame} from 'remotion';
import {Camera, setupCamera, Vector} from './multiply';
import {Face} from './Face';
import {projectPoints, sortFacesZIndex} from './map-face';
import {fixZ} from './fix-z';

const w =
	'M18 48.5L1.5 0.5H15L24 27.5L33 0.5H48L62 27.5L67.5 0.5H84L71 48.5H56L42 24.5L33 48.5H18Z';

const scale = 0.02;

const parsed = fixZ(
	reduceInstructions(parsePath(scalePath(resetPath(w), scale, scale)))
);

const bBox = getBoundingBoxFromInstructions(parsed);
const width = bBox.y2 - bBox.y1;
const height = bBox.x2 - bBox.x1;

const face = parsed
	.map((p) => {
		if (p.type !== 'M' && p.type !== 'L') {
			throw new Error('unexpected');
		}

		return [p.x, p.y] as const;
	})
	.map(([x, y]) => {
		return [x, y, 0] as Vector;
	});

const depth = 0.2;

const mainFaces = [
	face,
	face.map((p) => {
		return [p[0], p[1], p[2] - depth] as Vector;
	}),
];

const inbetweenFaces = [
	...parsed.map((p, i) => {
		if (p.type !== 'M' && p.type !== 'L') {
			throw new Error('unexpected');
		}

		const joined: number = i === 0 ? parsed.length - 1 : i - 1;
		const segmentToJoin: ReducedInstruction = parsed[joined];
		if (segmentToJoin.type !== 'M' && segmentToJoin.type !== 'L') {
			throw new Error('unexpected');
		}

		return [
			[p.x, p.y, 0],
			[p.x, p.y, -depth],
			[segmentToJoin.x, segmentToJoin.y, -depth],
			[segmentToJoin.x, segmentToJoin.y, 0],
			[p.x, p.y, 0],
		];
	}),
];

const camAngle = Math.PI / 12;

const cam: Camera = {
	eye: [0, 0, 1 / Math.tan(camAngle / 2) - 1] as Vector,
	coa: [0, 0, 0],
	up: [0, 1, 0],
	near: 3,
	far: 4,
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

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const rotatedFaces = sortFacesZIndex(
		inbetweenFaces.map((points) =>
			projectPoints({points, width, height, frame, camera})
		)
	);
	// Ignore bottom face as it is never rendered
	const [, topFace] = sortFacesZIndex(
		mainFaces.map((points) =>
			projectPoints({points, width, height, frame, camera})
		)
	);

	return (
		<svg
			viewBox="-10 -10 20 20"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			{rotatedFaces.map(({color, points}) => {
				return <Face color={color} points={points} />;
			})}
			<Face color="var(--blue)" points={topFace.points} />
		</svg>
	);
};

import {
	getSubpaths,
	parsePath,
	ReducedInstruction,
	reduceInstructions,
	resetPath,
	scalePath,
} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {Camera, setupCamera, Vector} from './multiply';
import {Face} from './Face';
import {projectPoints, sortFacesZIndex} from './map-face';
import {fixZ} from './fix-z';
import {useText} from './get-char';
import {replaceCurveByLines} from './tesselate-curve';
import {truthy} from './truthy';

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const scale = 0.02;

	const text = useText('i');
	if (!text) {
		return null;
	}

	const scaled = scalePath(resetPath(text.path), scale, scale);
	const subpaths = getSubpaths(scaled);

	const parsed = subpaths.map((p) => {
		return replaceCurveByLines(fixZ(reduceInstructions(parsePath(p))));
	});

	const bBox = getBoundingBox(scaled);
	const width = bBox.y2 - bBox.y1;
	const height = bBox.x2 - bBox.x1;

	const facePerSubpath = parsed.map((path) => {
		return path
			.map((p) => {
				if (p.type !== 'M' && p.type !== 'L') {
					throw new Error('unexpected');
				}

				return [p.x, p.y] as const;
			})
			.map(([x, y]) => {
				return [x, y, 0] as Vector;
			});
	});
	const depth = 0.2;
	console.log(facePerSubpath);

	const mainFaces = facePerSubpath.map((face) => {
		return [
			face,
			face.map((p) => {
				return [p[0], p[1], p[2] - depth] as Vector;
			}),
		];
	});

	const inbetweenFaces = [
		...parsed
			.map((path) => {
				return path.map((p, i) => {
					if (p.type !== 'M' && p.type !== 'L') {
						throw new Error('unexpected');
					}

					const joined: number = i === 0 ? path.length - 1 : i - 1;
					const segmentToJoin: ReducedInstruction = path[joined];
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
				});
			})
			.flat(1)
			.filter(truthy),
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

	const rotatedFaces = sortFacesZIndex(
		inbetweenFaces.map((points) =>
			projectPoints({points, width, height, frame, camera})
		)
	);
	const sorted = mainFaces.map((face) => {
		return sortFacesZIndex(
			face.map((points) =>
				projectPoints({points, width, height, frame, camera})
			)
		);
	});
	const bottomFaces = sorted.map((face) => face[0]);
	const topFaces = sorted.map((face) => face[1]);

	return (
		<svg
			viewBox="-10 -10 20 20"
			style={{
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			{bottomFaces.map(({color, points}) => {
				return <Face color="var(--blue)" points={points} />;
			})}
			{rotatedFaces.map(({color, points}) => {
				return <Face color={color} points={points} />;
			})}
			{topFaces.map(({color, points}) => {
				return <Face color="var(--blue)" points={points} />;
			})}
		</svg>
	);
};

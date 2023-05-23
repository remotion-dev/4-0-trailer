import {
	getSubpaths,
	parsePath,
	ReducedInstruction,
	reduceInstructions,
	resetPath,
	scalePath,
	translatePath,
} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {Camera, setupCamera, Vector, Vector4D} from './multiply';
import {Face} from './Face';
import {FaceType, projectPoints, sortFacesZIndex} from './map-face';
import {fixZ} from './fix-z';
import {useText} from './get-char';
import {replaceCurveByLines} from './tesselate-curve';
import {truthy} from './truthy';

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const scale = 0.02;

	const text = useText('svg');
	if (!text) {
		return null;
	}

	const _scaled = scalePath(resetPath(text.path), scale, scale);
	const _bBox = getBoundingBox(_scaled);
	const scaled = translatePath(_scaled, -_bBox.x2 / 2, _bBox.y2 / 2);
	const bBox = getBoundingBox(scaled);
	const subpaths = getSubpaths(scaled);

	const parsed = subpaths.map((p) => {
		return replaceCurveByLines(fixZ(reduceInstructions(parsePath(p))));
	});

	const width = bBox.y2 - bBox.y1;
	const height = bBox.x2 - bBox.x1;

	const facePerSubpath = parsed.map((path): FaceType => {
		return {
			points: path
				.map((p) => {
					if (p.type !== 'M' && p.type !== 'L') {
						throw new Error('unexpected');
					}

					return [p.x, p.y] as const;
				})
				.map(([x, y]) => {
					return [x, y, 0, 0] as Vector4D;
				}),
			color: '#0b84f3',
			shouldDrawLine: true,
		};
	});
	const depth = 0.2;

	const mainFaces: FaceType[][] = facePerSubpath.map((face) => {
		return [
			face,
			{
				...face,
				points: face.points.map((p) => {
					return [p[0], p[1], p[2] - depth, 0] as const;
				}),
			} as FaceType,
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
						{
							shouldDrawLine: false,
							points: [
								[p.x, p.y, 0],
								[p.x, p.y, -depth],
								[segmentToJoin.x, segmentToJoin.y, -depth],
								[segmentToJoin.x, segmentToJoin.y, 0],
								[p.x, p.y, 0],
							],
						},
						{
							shouldDrawLine: true,
							points: [
								[p.x, p.y, -depth],
								[segmentToJoin.x, segmentToJoin.y, -depth],
								[p.x, p.y, -depth],
							],
						},
						{
							shouldDrawLine: true,
							points: [
								[p.x, p.y, 0],
								[segmentToJoin.x, segmentToJoin.y, 0],
								[p.x, p.y, 0],
							],
						},
					];
				});
			})
			.flat(2)
			.filter(truthy),
	];

	const camAngle = Math.PI / 12;

	const cam: Camera = {
		eye: [0, 0, 1 / Math.tan(camAngle / 2) - 1] as Vector,
		coa: [0, 0, 0],
		up: [0, 1, 0],
		near: 2,
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
		inbetweenFaces.map(({points, shouldDrawLine}) =>
			projectPoints({
				points,
				shouldDrawLine,
				width,
				height,
				frame,
				camera,
				color: '#fff',
			})
		)
	);
	const sorted = mainFaces.map((face) => {
		return sortFacesZIndex(
			face.map(({points, shouldDrawLine, color}) =>
				projectPoints({
					points,
					width,
					height,
					frame,
					camera,
					color,
					shouldDrawLine,
				})
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
			{[...bottomFaces, ...rotatedFaces, ...topFaces].map(
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

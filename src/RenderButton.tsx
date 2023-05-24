import {
	parsePath,
	reduceInstructions,
	resetPath,
	scalePath,
} from '@remotion/paths';
import {getBoundingBox} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ThreeDReducedInstruction} from './3d-svg';
import {CursorWithButton} from './CursorAnimation';
import {Face} from './Face';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {joinInbetweenTiles} from './join-inbetween-tiles';
import {FaceType, sortFacesZIndex, translateSvgInstruction} from './map-face';
import {
	Camera,
	MatrixTransform4D,
	multiplyMatrixAndSvgInstruction,
	rotated,
	setupCamera,
	Vector,
} from './multiply';
import {Sparks} from './Sparks';
import {subdivideInstructions} from './subdivide-instruction';
import {truthy} from './truthy';

const viewBox = [-1500, -800, 3000, 1600];

const maxDepth = 20;

const projectButtonPoints = ({
	points,
	frame,
	camera,
	color,
	shouldDrawLine,
	depth,
	height,
	width,
	isStroke,
	fps,
	z,
}: {
	points: ThreeDReducedInstruction[];
	frame: number;
	fps: number;
	camera: MatrixTransform4D;
	color: string;
	shouldDrawLine: boolean;
	width: number;
	height: number;
	depth: number;
	isStroke: boolean;
	z: number;
}): FaceType => {
	const up = spring({
		fps,
		frame,
		config: {
			damping: 16,
		},
		durationInFrames: 35,
	});

	const xRotation =
		interpolate(up - 1, [0, 1], [0, -Math.PI * 5], {
			extrapolateLeft: 'clamp',
		}) + 0.15;

	const afterPress = spring({
		fps,
		frame: frame - 70,
		config: {
			damping: 200,
		},
		durationInFrames: 120,
	});

	const yRotation =
		interpolate(up, [0, 1], [Math.PI / 2, 0], {}) +
		interpolate(afterPress, [0, 1], [0, -Math.PI * 2], {});

	const y =
		interpolate(up, [0, 1], [300, 0]) +
		interpolate(afterPress, [0, 1], [0, -300]);

	const projected = points
		.map((p) => {
			return translateSvgInstruction(
				p,
				-width / 2,
				-height / 2 + y,
				maxDepth / 2 - depth + z
			);
		})
		.map((p) => {
			return multiplyMatrixAndSvgInstruction(rotated([1, 0, 0], xRotation), p);
		})
		.map((p) => {
			return multiplyMatrixAndSvgInstruction(rotated([0, 1, 0], yRotation), p);
		})
		.map((p) => {
			return multiplyMatrixAndSvgInstruction(camera, p);
		});

	return {
		color,
		points: projected,
		shouldDrawLine,
		isStroke,
	};
};

const buttonColor = '#0b84f3';

export const RenderButton: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const shape = makeRect({
		height: 60,
		width: 200,
		cornerRadius: 15,
	});

	const bBox = getBoundingBox(shape.path);
	const parsed = subdivideInstructions(
		subdivideInstructions(turnInto3D(reduceInstructions(parsePath(shape.path))))
	);

	const press =
		spring({
			fps,
			frame: frame - 60,
			config: {
				damping: 200,
			},
			durationInFrames: 10,
		}) -
		spring({
			fps,
			frame: frame - 70,
			config: {
				damping: 200,
			},
			durationInFrames: 10,
		});

	const text = useText('Render video');
	if (!text) {
		return null;
	}
	const textPath = resetPath(scalePath(text.path, 0.25, 0.25));
	const parsedText = parsePath(textPath);
	const threeD = turnInto3D(reduceInstructions(parsedText));

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const facePerSubpath: FaceType = {
		points: parsed,
		color: buttonColor,
		shouldDrawLine: true,
		isStroke: false,
	};
	const depth = maxDepth - press * maxDepth;

	const mainFaces: FaceType[] = [
		{...facePerSubpath, color: '#222'},
		{
			...facePerSubpath,
			points: facePerSubpath.points.map((p) => {
				return translateSvgInstruction(p, 0, 0, -depth);
			}),
		},
	];
	const inbetweenFaces: FaceType[] = joinInbetweenTiles(
		facePerSubpath.points,
		depth,
		'#000'
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
			return projectButtonPoints({
				points: face.points,
				shouldDrawLine: face.shouldDrawLine,
				frame,
				camera,
				color: face.color,
				depth,
				height,
				width,
				isStroke: face.isStroke,
				fps,
				z: 0,
			});
		})
	);

	const [topFace, bottomFace] = sortFacesZIndex(
		mainFaces.map(({points, shouldDrawLine, color, isStroke}) =>
			projectButtonPoints({
				points,
				frame,
				camera,
				color,
				shouldDrawLine,
				depth,
				height,
				width,
				isStroke,
				fps,
				z: 0,
			})
		)
	);

	const textVisible = topFace.color === buttonColor;

	const bBoxText = getBoundingBox(textPath);

	const textProjected = projectButtonPoints({
		camera,
		color: 'white',
		depth,
		fps,
		frame,
		height: bBoxText.y2 - bBoxText.y1,
		isStroke: false,
		points: threeD,
		shouldDrawLine: false,
		width: bBoxText.x2 - bBoxText.x1,
		z: -depth,
	});

	const allFacesSorted = sortFacesZIndex([...rotatedFaces]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'white',
				}}
			>
				<svg viewBox={viewBox.join(' ')} style={{overflow: 'visible'}}>
					{[
						bottomFace,
						...allFacesSorted,
						topFace,
						textVisible
							? {
									color: 'white',
									points: textProjected.points,
									shouldDrawLine: false,
									isStroke: false,
							  }
							: null,
					]
						.filter(truthy)
						.map(({color, points, shouldDrawLine}, i) => {
							return (
								<Face
									key={JSON.stringify(points) + i}
									strokeColor="black"
									color={color}
									points={points}
									shouldDrawLine={shouldDrawLine}
								/>
							);
						})}
				</svg>
			</AbsoluteFill>
			<CursorWithButton />
			<Sequence from={80}>
				<Sparks />
			</Sequence>
		</AbsoluteFill>
	);
};

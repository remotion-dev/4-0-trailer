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
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ThreeDReducedInstruction} from './3d-svg';
import {getCamera} from './camera';
import {CursorWithButton} from './CursorAnimation';
import {Face} from './Face';
import {turnInto3D} from './fix-z';
import {useText} from './get-char';
import {extrudeInstructions} from './join-inbetween-tiles';
import {FaceType, sortFacesZIndex, translateSvgInstruction} from './map-face';
import {
	MatrixTransform4D,
	multiplyMatrix,
	multiplyMatrixAndSvgInstruction,
	rotated,
	Vector4D,
} from './matrix';
import {Sparks} from './Sparks';
import {subdivideInstructions} from './subdivide-instruction';

const viewBox = [-1500, -800, 3000, 1600];

const maxDepth = 20;

export const projectButtonPoints = ({
	points,
	camera,
	color,
	shouldDrawLine,
	height,
	width,
	isStroke,
	transformations,
	centerPoint,
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
	transformations: MatrixTransform4D[];
	centerPoint: Vector4D;
}): FaceType => {
	let projected = points.map((p) => {
		return translateSvgInstruction(p, -width / 2, -height / 2, 0);
	});

	let newCenterPoint = centerPoint;

	for (const transformation of transformations) {
		projected = projected.map((p) =>
			multiplyMatrixAndSvgInstruction(transformation, p)
		);
		newCenterPoint = multiplyMatrix(transformation, newCenterPoint);
	}

	projected = projected.map((p) => {
		return multiplyMatrixAndSvgInstruction(camera, p);
	});

	return {
		color,
		points: projected,
		shouldDrawLine,
		isStroke,
		centerPoint: newCenterPoint,
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
	const depth = maxDepth - press * maxDepth;

	const threeD = turnInto3D(reduceInstructions(parsedText)).map((p) => {
		return translateSvgInstruction(p, 0, 0, -depth / 2);
	});

	const width = bBox.x2 - bBox.x1;
	const height = bBox.y2 - bBox.y1;

	const facePerSubpath: FaceType = {
		points: parsed,
		color: buttonColor,
		shouldDrawLine: true,
		isStroke: false,
		centerPoint: [0, 0, 0, 1],
	};

	const inbetweenFaces: FaceType[] = extrudeInstructions({
		instructions: facePerSubpath,
		depth,
		sideColor: 'black',
		frontFaceColor: 'red',
		backFaceColor: 'green',
	});

	const transformations = [rotated([0, 1, 0], frame / 10)];

	const rotatedFaces = sortFacesZIndex(
		inbetweenFaces.map((face) => {
			return projectButtonPoints({
				points: face.points,
				shouldDrawLine: face.shouldDrawLine,
				frame,
				camera: getCamera(width, height),
				color: face.color,
				depth,
				height,
				width,
				isStroke: face.isStroke,
				fps,
				centerPoint: face.centerPoint,
				transformations,
			});
		})
	);

	const bBoxText = getBoundingBox(textPath);

	const textProjected = projectButtonPoints({
		camera: getCamera(width, height),
		color: 'white',
		depth,
		fps,
		frame,
		height: bBoxText.y2 - bBoxText.y1,
		isStroke: false,
		points: threeD,
		shouldDrawLine: false,
		width: bBoxText.x2 - bBoxText.x1,
		centerPoint: [0, 0, -depth / 2, 1],
		transformations,
	});

	const allFacesSorted = sortFacesZIndex([...rotatedFaces, textProjected]);

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
					{allFacesSorted.map(({color, points, shouldDrawLine}, i) => {
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

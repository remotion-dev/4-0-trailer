import {getBoundingBox, parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect, makeTriangle} from '@remotion/shapes';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {centerPath} from './center';
import {BLUE, GREEN} from './colors';
import {makeElement, transformElement} from './element';
import {Faces} from './Faces';
import {getText, useFont} from './get-char';
import {extrudeElement} from './join-inbetween-tiles';
import {makeFace, transformElements, transformFace} from './map-face';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
	translateZ,
} from './matrix';

const rectHeight = 900;
const rectWidth = 1600;
const bottomHeight = 300;

const cursorHandlerPath = scalePath(
	'M16 0H142.332C150.616 0 157.332 6.71573 157.332 15V68.3129C157.332 72.7162 155.397 76.8972 152.041 79.7472L88.3746 133.804L89.4171 976H70L68.9575 133.804L5.64421 80.0467C2.0638 77.0067 0 72.547 0 67.8501V16C0 7.16344 7.16344 0 16 0Z',
	0.305,
	0.305
);

export const Studio: React.FC = () => {
	const {fps, width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame();

	const jump1 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
	});

	const jump2 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
		delay: 10,
	});

	const font = useFont();

	if (!font) {
		return null;
	}

	const triangle = makeTriangle({
		direction: 'right',
		length: 80,
		edgeRoundness: 0.71,
	});

	const rect = makeRect({
		height: rectHeight,
		width: rectWidth,
		cornerRadius: 25,
	});

	const bottomPane = makeRect({
		width: 1600,
		height: bottomHeight,
		cornerRadius: 25,
	});

	const bottomFace = makeFace({
		fill: '#111111',
		points: centerPath(bottomPane.path),
		strokeWidth: 0,
		strokeColor: 'black',
		description: 'bottomFace',
		crispEdges: false,
	});

	const backgroundElement = extrudeElement({
		depth: 20,
		backFaceColor: 'black',
		crispEdges: true,
		description: 'background',
		frontFaceColor: '#222',
		points: parsePath(centerPath(rect.path)),
		sideColor: 'black',
		strokeColor: 'black',
		strokeWidth: 20,
	});

	const bottomElement = transformElement(
		makeElement(bottomFace, bottomFace.centerPoint, 'bottomFace'),
		[translateY((rectHeight - bottomHeight) / 2)]
	);

	const triangleFace = makeFace({
		crispEdges: true,
		description: 'triangle',
		fill: 'white',
		strokeColor: 'black',
		strokeWidth: 10,
		points: centerPath(triangle.path),
	});

	const triangleElement = transformElement(
		makeElement(triangleFace, triangleFace.centerPoint, 'triangle'),
		[translateX(-rectWidth / 2 + 60), translateY(-rectHeight / 2 + 40)]
	);

	const blueBarElement = transformElement(
		extrudeElement({
			backFaceColor: 'black',
			crispEdges: false,
			depth: 20,
			description: 'bluebarface',
			frontFaceColor: BLUE,
			points: parsePath(
				centerPath(
					makeRect({
						width: 200,
						height: 80,
						cornerRadius: 10,
					}).path
				)
			),
			sideColor: 'black',
			strokeColor: 'black',
			strokeWidth: 10,
		}),
		[
			scaled(interpolate(jump1, [0, 1], [4, 1])),
			rotateX(-Math.PI + Math.PI * jump1),
			translateZ(-10),
			translateY(interpolate(jump1, [0, 1], [400, 240])),
			translateX(-rectWidth / 2 + 120),
		]
	);

	const blueBarFace2 = makeFace({
		crispEdges: true,
		description: 'blueBar1',
		fill: BLUE,
		points: makeRect({
			width: 900,
			height: 80,
			cornerRadius: 10,
		}).path,
		strokeColor: 'black',
		strokeWidth: 10,
	});

	const blueBarElement2 = transformElement(
		makeElement(blueBarFace2, blueBarFace2.centerPoint, 'blueBar1'),
		[translateY(280), translateX(-rectWidth / 2 + 210)]
	);

	const greenFace2 = makeFace({
		crispEdges: true,
		description: 'blueBar1',
		fill: GREEN,
		points: makeRect({
			width: 1370,
			height: 80,
			cornerRadius: 10,
		}).path,
		strokeColor: 'black',
		strokeWidth: 10,
	});

	const greenElement2 = transformElement(
		makeElement(greenFace2, greenFace2.centerPoint, 'greenface'),
		[translateY(360), translateX(-rectWidth / 2 + 210)]
	);

	const redFace = makeFace({
		description: 'cursor',
		crispEdges: true,
		fill: '#ff3232',
		points: cursorHandlerPath,
		strokeColor: 'black',
		strokeWidth: 4,
	});

	const redElement = transformElement(
		makeElement(redFace, redFace.centerPoint, 'cursor'),
		[translateY(151)]
	);

	const renderButton = makeFace({
		crispEdges: true,
		description: 'renderButton',
		fill: BLUE,
		points: makeRect({
			height: 70,
			width: 200,
			cornerRadius: 20,
		}).path,
		strokeColor: 'black',
		strokeWidth: 10,
	});

	const renderText = getText({font, text: 'Render', size: 33});
	const renderFace = makeFace({
		points: renderText.path,
		crispEdges: true,
		description: 'renderText',
		fill: 'white',
		strokeColor: 'black',
		strokeWidth: 0,
	});

	const renderElement = transformElement(
		makeElement(
			[
				renderButton,
				transformFace(renderFace, [translateX(44), translateY(45)]),
			],
			renderButton.centerPoint,
			'renderButton'
		),
		[translateX(580), translateY(70)]
	);

	const whiteCanvasShape = makeRect({
		width: 1000,
		height: 580,
		cornerRadius: 10,
	});

	const whiteCanvasFace = makeFace({
		crispEdges: true,
		description: 'whiteCanvas',
		fill: 'white',
		points: centerPath(whiteCanvasShape.path),
		strokeColor: 'black',
		strokeWidth: 10,
	});

	const whiteCanvasElement = transformElement(
		makeElement(whiteCanvasFace, whiteCanvasFace.centerPoint, 'whiteCanvas'),
		[translateX(0), translateY(-150)]
	);

	const niceTriangleFrame =
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
		}) * 103;

	const paths = new Array(3).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 1000 + i * 440,
			edgeRoundness: 0.71,
		});
		const path = resetPath(triangle.path);
		const parsed = parsePath(path);

		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const depth = (5 + niceTriangleFrame / 20) * 7.5;
		const spread = depth + (niceTriangleFrame / 1.2) * 7.5;

		const color = i === 2 ? '#E9F3FD' : i === 1 ? '#C1DBF9' : '#0b84f3';

		const actualColor = color;

		const extruded = extrudeElement({
			backFaceColor: actualColor,
			sideColor: 'black',
			frontFaceColor: actualColor,
			depth,
			points: parsed,
			strokeWidth: 14,
			description: `triangle-${i}`,
			strokeColor: 'black',
			crispEdges: true,
		});
		const projected = transformElement(extruded, [
			translateZ(spread * i - spread * 2),
			translateX(-width / 2),
			translateY(-height / 2 + 20),
			rotateX(-(i * niceTriangleFrame) / 300),
			rotateY(niceTriangleFrame / 100),
			rotateZ(niceTriangleFrame / 100),
			scaled(0.35),
			translateY(-160 + niceTriangleFrame * 1.5),
		]);

		return projected;
	});

	const allElements = [
		backgroundElement,
		bottomElement,
		triangleElement,
		blueBarElement,
		blueBarElement2,
		greenElement2,
		redElement,
		renderElement,
		whiteCanvasElement,
		...paths,
	];

	const transformed = transformElements(allElements, []);

	return (
		<AbsoluteFill>
			<svg viewBox={viewBox.join(' ')}>
				<Faces elements={transformed} />
			</svg>
		</AbsoluteFill>
	);
};

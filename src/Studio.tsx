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
import {truthy} from './truthy';

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

	const initialJump = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 70,
	});

	const smallJump = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 70,
		delay: 30,
	});

	const jump1 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 70,
		delay: 60,
	});

	const jump2 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 70,
		delay: 70,
	});

	const jump3 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 70,
		delay: 80,
	});
	const jump4 = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 50,
		delay: 100,
	});

	const finalJump = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 40,
		delay: 240,
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

	const backgroundElement = transformElement(
		extrudeElement({
			depth: 100,
			backFaceColor: 'black',
			crispEdges: true,
			description: 'background',
			frontFaceColor: '#222',
			points: parsePath(centerPath(rect.path)),
			sideColor: 'black',
			strokeColor: 'black',
			strokeWidth: 20,
		}),
		[
			scaled(0.7 + Number(initialJump * 0.3)),
			rotateY(Math.PI / 8 - (initialJump * Math.PI) / 8),
			rotateX(Math.PI / 8 - (initialJump * Math.PI) / 8),
			translateZ(10),
		]
	);

	const bottomElement = transformElement(
		makeElement(bottomFace, bottomFace.centerPoint, 'bottomFace'),
		[
			scaled(interpolate(smallJump, [0, 1], [4, 1])),
			translateY(interpolate(smallJump, [0, 1], [1000, 0])),
			translateY((rectHeight - bottomHeight) / 2),
		]
	);

	const triangleFace = makeFace({
		crispEdges: false,
		description: 'triangle',
		fill: 'white',
		strokeColor: 'black',
		strokeWidth: 10,
		points: centerPath(triangle.path),
	});

	const triangleElement = transformElement(
		makeElement(triangleFace, triangleFace.centerPoint, 'triangle'),
		[
			translateX(interpolate(jump1, [0, 1], [-1400, 0])),
			translateX(-rectWidth / 2 + 60),
			translateY(-rectHeight / 2 + 40),
		]
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
			translateY(240),
			translateY(interpolate(jump1, [0, 1], [560, 0])),
			translateX(-rectWidth / 2 + 120),
		]
	);

	const blueBarElement2 = transformElement(
		extrudeElement({
			backFaceColor: 'black',
			crispEdges: false,
			depth: 20,
			description: 'bluebarface',
			frontFaceColor: BLUE,
			points: parsePath(
				centerPath(
					makeRect({
						width: 900,
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
			scaled(interpolate(jump2, [0, 1], [4, 1])),
			rotateX(-Math.PI + Math.PI * jump2),
			translateZ(-10),
			translateY(320),
			translateY(interpolate(jump2, [0, 1], [600, 0])),
			translateX(-rectWidth / 2 + 560),
		]
	);

	const greenElement2 = transformElement(
		extrudeElement({
			backFaceColor: 'black',
			crispEdges: false,
			depth: 20,
			description: 'bluebarface',
			frontFaceColor: GREEN,
			points: parsePath(
				centerPath(
					makeRect({
						width: 1370,
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
			scaled(interpolate(jump3, [0, 1], [4, 1])),
			rotateX(-Math.PI + Math.PI * jump3),
			translateY(400),
			translateX(-rectWidth / 2 + 795),
			translateY(interpolate(jump3, [0, 1], [400, 0])),
			translateZ(-10),
		]
	);

	const triangleProgress = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 90,
		delay: 160,
	});

	const niceTriangleFrame = triangleProgress * 103;

	const {width: cursorWeight, height: cursorHeight} =
		getBoundingBox(cursorHandlerPath);
	const redElement = transformElement(
		extrudeElement({
			backFaceColor: '#ff3232',
			crispEdges: false,
			depth: 5,
			description: 'bluebarface',
			frontFaceColor: '#ff3232',
			points: parsePath(cursorHandlerPath),
			sideColor: 'black',
			strokeColor: 'black',
			strokeWidth: 4,
		}),
		[
			translateX(-cursorWeight / 2),
			translateY(-cursorHeight / 2),
			scaled(interpolate(jump4, [0, 1], [4, 1])),
			rotateY(Math.PI * 2 * jump4),
			translateY(151),
			translateZ(-10),
			translateY(interpolate(jump4, [0, 1], [1000, 0])),
			translateX(cursorWeight / 2),
			translateY(cursorHeight / 2),
			translateX(-800),
			translateX(triangleProgress * 900),
		]
	);

	const renderButtonDepth = 20;

	const renderButton = extrudeElement({
		backFaceColor: 'black',
		crispEdges: false,
		depth: renderButtonDepth,
		description: 'bluebarface',
		frontFaceColor: BLUE,
		points: parsePath(
			centerPath(
				makeRect({
					height: 70,
					width: 200,
					cornerRadius: 20,
				}).path
			)
		),
		sideColor: 'black',
		strokeColor: 'black',
		strokeWidth: 10,
	});

	const welcomeText = getText({
		font,
		text: 'Welcome to Remotion 4.0',
		size: 32,
	});
	const welcomeFace = transformFace(
		makeFace({
			points: centerPath(resetPath(welcomeText.path)),
			crispEdges: false,
			description: 'welcomeText',
			fill: 'black',
			strokeColor: 'white',
			strokeWidth: 0,
		}),
		[scaled(0.9 + finalJump * 0.45), translateZ(-2), translateY(-150)]
	);

	const renderText = getText({font, text: 'Render', size: 33});
	const renderFace = transformFace(
		makeFace({
			points: centerPath(resetPath(renderText.path)),
			crispEdges: false,
			description: 'renderText',
			fill: 'white',
			strokeColor: 'black',
			strokeWidth: 0,
		}),
		[translateZ(-renderButtonDepth / 2 - 0.001)]
	);

	const welcomeElement = makeElement(
		welcomeFace,
		welcomeFace.centerPoint,
		'welcomeFace'
	);

	const renderElement = transformElements(
		[
			renderButton,
			makeElement(renderFace, renderButton.centerPoint, 'renderButton'),
		],
		[
			translateZ(-renderButtonDepth),
			scaled(interpolate(jump4, [0, 1], [4, 1])),
			rotateY(Math.PI + jump4 * Math.PI),
			translateX(680),
			translateY(100),
			translateY(interpolate(jump4, [0, 1], [1000, 0])),
		]
	);

	const whiteCanvasShape = makeRect({
		width: 1024,
		height: 576,
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
		[
			scaled(interpolate(smallJump, [0, 1], [2, 1])),
			translateY(interpolate(smallJump, [0, 1], [-1000, 0])),
			translateY(-150),
		]
	);

	const paths = new Array(3).fill(true).map((out, i) => {
		const triangle = makeTriangle({
			direction: 'right',
			length: 1000 + i * 440,
			edgeRoundness: 0.71,
		});
		const moveIn = spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			durationInFrames: 30,
			delay: (2 - i) * 3 + 90,
		});
		const path = resetPath(triangle.path);
		const parsed = parsePath(path);

		const boundingBox = getBoundingBox(path);
		const width = boundingBox.x2 - boundingBox.x1;
		const height = boundingBox.y2 - boundingBox.y1;

		const depth = (5 + niceTriangleFrame / 20) * 7.5;
		const spread = depth + (niceTriangleFrame / 1.2) * 7.5 + finalJump * 100;

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
			scaled(interpolate(moveIn, [0, 1], [4, 1], {})),
			translateY(interpolate(moveIn, [0, 1], [-8000, 0], {})),
			translateZ(spread * i - spread * 2),
			translateX(-width / 2 + 40),
			translateY(-height / 2 + 20),
			rotateX(-(i * niceTriangleFrame) / 300 - finalJump * 0.5),
			rotateY(niceTriangleFrame / 100),
			rotateZ(niceTriangleFrame / 100),
			scaled(0.25 + triangleProgress * 0.1),
			translateY(-160 + niceTriangleFrame * 1.5),
			translateY(finalJump * -800),
			translateX(finalJump * 40),
		]);

		return projected;
	});

	const allElements = [
		backgroundElement,
		bottomElement,
		frame > 243 ? welcomeElement : null,
		triangleElement,
		blueBarElement,
		blueBarElement2,
		greenElement2,
		redElement,
		...renderElement,
		whiteCanvasElement,
		...paths,
	].filter(truthy);

	const transformed = transformElements(allElements, [
		scaled(1 + finalJump * 0.92),
		translateY(finalJump * 290),
	]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<svg viewBox={viewBox.join(' ')}>
				<Faces elements={transformed} />
			</svg>
		</AbsoluteFill>
	);
};

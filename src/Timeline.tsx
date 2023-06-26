import {
	getWaveformPortion,
	useAudioData,
	visualizeAudio,
} from '@remotion/media-utils';
import {parsePath, resetPath, scalePath} from '@remotion/paths';
import {makeRect} from '@remotion/shapes';
import React, {useMemo} from 'react';
import {
	Audio,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {BLUE, GREEN} from './colors';
import {makeElement, ThreeDElement, transformElement} from './element';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {extrudeElement} from './join-inbetween-tiles';
import {makeFace} from './map-face';
import {
	MatrixTransform4D,
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
	translateZ,
} from './matrix';
import {truthy} from './truthy';

const cursorHandlerPath = scalePath(
	'M16.0234 0.73407H142.355C150.64 0.73407 157.355 7.4498 157.355 15.7341V69.0469C157.355 73.4503 155.421 77.6313 152.064 80.4813L88.398 134.538C88.398 134.538 91.5 2925.5 91.5 2938.5C91.5 2951.5 72.0829 2952 72.0829 2938.5C72.0829 2925 68.9809 134.538 68.9809 134.538L5.66765 80.7808C2.08724 77.7408 0.0234375 73.2811 0.0234375 68.5842V16.7341C0.0234375 7.89751 7.18688 0.73407 16.0234 0.73407Z',
	0.6,
	0.6
);

type Track = {
	x: number;
	depth: number;
	frontColor: string;
	backColor: string;
	width: number;
};

const TRACK_HEIGHT = 150;
const LAYER_DEPTH = 150;

const SAMPLES = 200;
const SAMPLE_DURATION = 40;
const BAR_WIDTH = 15;
const BAR_SPACING = 7;

const Timeline: React.FC<{
	startTimeInSeconds: number;
	matrices: MatrixTransform4D[];
	delay?: number;
	second?: boolean;
	amplitude?: number;
}> = ({startTimeInSeconds, matrices, delay, second, amplitude}) => {
	const {width, height} = useVideoConfig();
	const viewBox = [-width / 2, -height / 2, width, height];
	const frame = useCurrentFrame() - (delay ?? 0);
	const {fps} = useVideoConfig();

	const audioData = useAudioData(staticFile('illstandmyground.mp3'));

	const waveForm = useMemo(() => {
		if (!audioData) {
			return null;
		}
		return getWaveformPortion({
			audioData,
			durationInSeconds: SAMPLE_DURATION,
			numberOfSamples: SAMPLES,
			startTimeInSeconds,
		});
	}, [audioData, startTimeInSeconds]);

	if (!waveForm) {
		return null;
	}

	const faces: Track[] = [
		second
			? null
			: {
					depth: LAYER_DEPTH,
					x: 0,
					frontColor: BLUE,
					backColor: 'black',
					width: 50 * 7.5,
			  },
		{
			depth: LAYER_DEPTH,
			x: 49 * 7.5,
			frontColor: BLUE,
			backColor: 'black',
			width: 101 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 49 * 7.5,
			frontColor: GREEN,
			backColor: 'black',
			width: 600 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 150 * 7.5,
			frontColor: BLUE,
			backColor: 'black',
			width: 300 * 7.5,
		},
		{
			depth: LAYER_DEPTH,
			x: 150 * 7.5,
			frontColor: BLUE,
			backColor: 'black',
			width: 300 * 7.5,
		},
	].filter(truthy);

	const depth = 150;

	const timePerBar = SAMPLE_DURATION / SAMPLES;
	const barWidthPlusSpacing = BAR_WIDTH + BAR_SPACING;

	const timeInSeconds = frame / fps;

	const cursorOffset =
		timeInSeconds * timePerBar * barWidthPlusSpacing * fps -
		6 +
		(second ? 670 : 0);

	const facesProject = faces.map((f, i) => {
		const z =
			spring({
				frame,
				delay: i * 20 - 40,
				fps,
				from: 1,
				to: 0,
				config: {
					damping: 200,
				},
				durationInFrames: 80,
			}) *
			200 *
			7.5;

		const strip = transformElement(
			extrudeElement({
				depth,
				backFaceColor: f.backColor,
				frontFaceColor: f.frontColor,
				points: makeRect({
					width: f.width,
					height: TRACK_HEIGHT,
					cornerRadius: 15,
				}).instructions,
				sideColor: 'black',
				strokeWidth: 10,
				description: `Track ${i}`,
				strokeColor: 'black',
				crispEdges: false,
			}),
			[translateX(f.x), translateY((TRACK_HEIGHT + 2) * i), translateZ(z)]
		);

		if (f.frontColor === BLUE) {
			return [strip];
		}

		const startVisualIndex = 61;

		const activeCursorIndex =
			(((frame + (delay ?? 0)) / fps) * 1.2) / timePerBar +
			startVisualIndex -
			4;

		const waves = new Array(SAMPLES).fill(true).map((w, idx): ThreeDElement => {
			const distanceToIndex = Math.abs(idx - activeCursorIndex);
			const factor = Math.max(0, 1 - distanceToIndex / 1);

			const _actualAmplitude = amplitude
				? amplitude * (factor + 0.2) * 2.5 + 0.2
				: 1;

			const actualAmplitude = interpolate(
				factor,
				[0, 1],
				[1, _actualAmplitude]
			);

			const cornerRadius = 8;
			const waveHeight = Math.max(
				waveForm[idx].amplitude * TRACK_HEIGHT * 0.6 * Number(actualAmplitude),
				cornerRadius * 2
			);

			const audioWave = makeRect({
				width: BAR_WIDTH,
				height: waveHeight,
				cornerRadius,
			}).path;

			const yo = turnInto3D(parsePath(audioWave));

			const opacity = interpolate(factor, [0, 1], [0.25, 0.9]);

			const face = makeFace({
				points: yo,
				fill: 'rgba(255, 255, 255, ' + opacity + ')',
				description: 'Audio Wave',
				strokeColor: 'black',
				strokeWidth: 0,
				crispEdges: false,
			});

			const element = makeElement(face, face.centerPoint, 'Audio Wave');

			return transformElement(element, [
				translateX(f.x + 30 + idx * barWidthPlusSpacing),
				translateY((TRACK_HEIGHT + 2) * i + TRACK_HEIGHT / 2 - waveHeight / 2),
				translateZ(-depth / 2),
				translateZ(z),
			]);
		});

		return [strip, ...waves];
	});

	const cursor = transformElement(
		extrudeElement({
			depth: 2 * 7.5,
			backFaceColor: 'black',
			frontFaceColor: 'red',
			points: parsePath(resetPath(cursorHandlerPath)),
			sideColor: 'black',
			strokeWidth: 10,
			description: 'Cursor',
			strokeColor: 'black',
			crispEdges: false,
		}),
		[
			translateX(cursorOffset),
			translateY(-12 * 7.5),
			translateZ(-LAYER_DEPTH / 2 - 1),
		]
	);

	const facesMapped = [...facesProject, cursor];

	return (
		<svg
			style={{
				backgroundColor: 'white',
			}}
			viewBox={viewBox.join(' ')}
		>
			<Faces
				noSort
				elements={facesMapped.flat(1).map((element) => {
					return transformElement(element, matrices);
				})}
			/>
		</svg>
	);
};

export const TimelinePerspective1: React.FC = () => {
	const frame = useCurrentFrame();
	const xRotation = interpolate(frame, [-200, 200], [0, Math.PI / 4]);
	const scale = interpolate(frame, [0, 300], [1.3, 1.8]);

	return (
		<Timeline
			startTimeInSeconds={16}
			matrices={[
				translateX(-frame * 0.6 * 7.5),
				translateY(-30 * 7.5),
				rotateX(-xRotation),
				rotateZ(-frame / 1500),
				rotateY(interpolate(frame, [0, 4000], [0, -Math.PI])),
				scaled(scale),
			]}
		/>
	);
};

export const TimelinePerspective2: React.FC<{
	withAudio: boolean;
}> = ({withAudio}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const audioData = useAudioData(staticFile('illstandmyground.mp3'));
	if (!audioData) {
		return null;
	}

	const start = 37;
	const visualize = visualizeAudio({
		audioData,
		fps,
		frame: frame + start * fps,
		numberOfSamples: 1,
	});

	return (
		<>
			{withAudio && (
				<Audio
					src={staticFile('illstandmyground.mp3')}
					startFrom={start * fps}
				/>
			)}
			<Timeline
				second
				delay={-200}
				startTimeInSeconds={start + 7.5}
				amplitude={visualize[0]}
				matrices={[
					translateX(-1800 - frame * 4),
					translateY(-200),
					rotateY(Math.PI / 8),
					rotateX(-Math.PI / 8),
					rotateZ(0.15),
					scaled(2.2 - frame / 400),
				]}
			/>
		</>
	);
};

import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {noise2D} from '@remotion/noise';
import {getBoundingBox, parsePath, resetPath} from '@remotion/paths';
import {makeCircle} from '@remotion/shapes';
import {
	AbsoluteFill,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Audio,
} from 'remotion';
import {getCamera} from './camera';
import {Faces} from './Faces';
import {turnInto3D} from './fix-z';
import {extrudeInstructions} from './join-inbetween-tiles';
import {rotated, translated, Vector4D} from './matrix';
import {projectPoints} from './project-points';
import {subdivideInstructions} from './subdivide-instruction';

const audio = staticFile('illstandmyground.mp3');
const samples = 8;

export const AudioViz: React.FC = () => {
	const {fps, width, height} = useVideoConfig();
	const frame = useCurrentFrame();

	const viewBox = [0 - width / 2, 0 - height / 2, width, height];

	const audioData = useAudioData(audio);

	console.log(audioData);

	if (!audioData) {
		return null;
	}

	const visualize = visualizeAudio({
		audioData,
		fps,
		frame,
		numberOfSamples: samples,
	});

	const minDb = -100;
	const maxDb = -0;

	const amplitudes = visualize.map((value) => {
		// Convert to decibels (will be in the range `-Infinity` to `0`)
		const db = 20 * Math.log10(value);

		// Scale to fit between min and max
		const scaled = (db - minDb) / (maxDb - minDb);

		return scaled;
	});

	const rearranged = [
		amplitudes[6],
		amplitudes[4],
		amplitudes[2],
		amplitudes[0],
		amplitudes[1],
		amplitudes[3],
		amplitudes[5],
		amplitudes[7],
	];

	const paths = (() => {
		return amplitudes.map((ampli, i) => {
			const circle = makeCircle({radius: 10});
			const path = resetPath(circle.path);
			const threeD = subdivideInstructions(turnInto3D(parsePath(path)));

			const boundingBox = getBoundingBox(path);
			const boxWidth = boundingBox.x2 - boundingBox.x1;
			const boxHeight = boundingBox.y2 - boundingBox.y1;

			const depthIn = 50 - Math.max(0, rearranged[i] + 0.1) * 40;
			const depthOut = Math.max(0, rearranged[i] - 0.3) * 80;
			const depth = i % 2 === 0 ? depthIn : depthOut;
			const color = '#0b84f3';

			const extruded = extrudeInstructions({
				backFaceColor: color,
				sideColor: 'black',
				frontFaceColor: color,
				depth,
				instructions: {
					centerPoint: [0, 0, 0, 1] as Vector4D,
					color: 'black',
					isStroke: false,
					points: threeD,
					shouldDrawLine: true,
				},
				drawSegmentLines: false,
			});

			const spacing = boxWidth * 1.5;

			return extruded.map((e) => {
				return projectPoints({
					transformations: [
						translated([0, noise2D('seed', frame / 100, i) * 5, 0]),
						translated([
							-boxWidth / 2 + i * spacing - (spacing * (samples - 1)) / 2,
							-boxHeight / 2,
							-depth / 2,
						]),
						rotated([1, 0, 0], -noise2D('rotate2', frame / 800, 0) * 0.5),
						rotated([1, 1, 0], -noise2D('rotate3', frame / 200, 0) * 0.5),
						rotated([0, 0, 1], noise2D('rotate', frame / 400, 0) * 0.5),
					],
					face: e,
				});
			});
		});
	})();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<Audio src={audio} />
			<svg viewBox={viewBox.join(' ')}>
				<Faces
					camera={getCamera(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1], [
						Math.sin(frame / 100) * 10,
						0,
						Math.cos(frame / 100) * 10,
					])}
					faces={paths.flat(1)}
				/>
			</svg>
		</AbsoluteFill>
	);
};

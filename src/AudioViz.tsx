import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {noise2D} from '@remotion/noise';
import {getBoundingBox, parsePath, resetPath} from '@remotion/paths';
import {makeCircle} from '@remotion/shapes';
import {
	AbsoluteFill,
	Audio,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	translateX,
	translateY,
	translateZ,
} from './matrix';

const audio = staticFile('illstandmyground.mp3');
const samples = 8;

export const AudioViz: React.FC = () => {
	const {fps, width, height} = useVideoConfig();
	const frame = useCurrentFrame();

	const viewBox = [0 - width / 2, 0 - height / 2, width, height];

	const audioData = useAudioData(audio);

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

			const boundingBox = getBoundingBox(path);
			const boxWidth = boundingBox.x2 - boundingBox.x1;
			const boxHeight = boundingBox.y2 - boundingBox.y1;

			const depthIn = 50 - Math.max(0, rearranged[i] + 0.1) * 40;
			const depthOut = Math.max(0, rearranged[i] - 0.3) * 80;
			const depth: number = i % 2 === 0 ? depthIn : depthOut;
			const color = '#0b84f3';

			const extruded = extrudeElement({
				backFaceColor: color,
				sideColor: 'black',
				frontFaceColor: color,
				depth,
				points: parsePath(path),
				strokeWidth: 10,
				description: `circle-${i}`,
				strokeColor: color,
			});

			const spacing = boxWidth * 1.5;

			return transformElement(extruded, [
				translateY(noise2D('seed', frame / 100, i) * 5),
				translateX(-boxWidth / 2 + i * spacing - (spacing * (samples - 1)) / 2),
				translateY(-boxHeight / 2),
				translateZ(-depth / 2),
				rotateX(-noise2D('rotate2', frame / 800, 0) * 0.5),
				rotateY(-noise2D('rotate3', frame / 200, 0) * 0.5),
				rotateZ(noise2D('rotate', frame / 400, 0) * 0.5),
			]);
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
				<Faces elements={paths} />
			</svg>
		</AbsoluteFill>
	);
};

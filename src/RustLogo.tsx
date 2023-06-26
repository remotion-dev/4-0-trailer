import {parsePath, resetPath} from '@remotion/paths';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	OffthreadVideo,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {centerPath} from './center';
import {BLUE} from './colors';
import {transformElement} from './element';
import {Faces} from './Faces';
import {extrudeElement} from './join-inbetween-tiles';
import {
	rotateX,
	rotateY,
	rotateZ,
	scaled,
	translateX,
	translateY,
} from './matrix';

export const RustLogo: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	const viewBox = [-width / 4, -height / 2, width / 2, height];

	const frame = useCurrentFrame();

	const progress = (delay: number) =>
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			delay,
			durationInFrames: 60,
		});

	const inbetweenFaces = extrudeElement({
		points: parsePath(
			centerPath(
				resetPath(
					`
					M2983 5895 c-12 -8 -52 -66 -89 -128 -37 -61 -68 -113 -69 -115 -2
					-2 -18 -5 -36 -8 -32 -5 -38 -1 -117 88 -160 178 -186 174 -262 -44 -43 -121
					-46 -127 -78 -136 -33 -10 -38 -8 -140 69 -110 82 -136 95 -175 85 -32 -8 -45
					-40 -62 -159 -22 -152 -24 -156 -55 -172 -27 -14 -34 -12 -158 46 -138 63
					-163 67 -198 28 -15 -17 -16 -35 -11 -166 7 -148 7 -148 -20 -167 -26 -19 -27
					-19 -162 13 -111 27 -141 31 -164 22 -52 -20 -53 -45 -15 -199 35 -139 35
					-139 12 -166 -24 -27 -24 -27 -152 -20 -159 8 -179 4 -198 -42 -15 -35 -14
					-37 45 -166 58 -124 60 -131 46 -158 -16 -31 -20 -33 -175 -55 -115 -17 -153
					-36 -158 -78 -4 -34 6 -52 94 -168 70 -93 72 -98 62 -130 -10 -33 -15 -36
					-136 -79 -218 -76 -222 -102 -44 -262 89 -79 93 -85 88 -117 -3 -18 -6 -34 -8
					-36 -2 -1 -54 -32 -116 -69 -120 -72 -148 -100 -137 -138 12 -37 32 -54 142
					-119 159 -94 160 -104 19 -230 -107 -94 -123 -119 -107 -161 13 -35 25 -42
					161 -90 111 -40 126 -48 137 -75 11 -29 9 -34 -72 -144 -93 -126 -103 -158
					-62 -197 17 -16 48 -25 127 -37 174 -25 168 -23 186 -57 16 -30 15 -32 -42
					-151 -64 -134 -70 -170 -33 -200 22 -18 34 -19 169 -14 145 6 145 6 164 -20
					19 -26 19 -27 -13 -162 -27 -111 -31 -141 -22 -164 20 -52 45 -53 199 -15 139
					35 139 35 165 12 26 -23 26 -23 20 -166 -5 -133 -4 -145 14 -167 30 -37 66
					-31 200 33 119 57 121 58 151 42 34 -18 33 -13 57 -186 13 -90 19 -108 41
					-127 42 -38 69 -30 193 62 110 81 115 83 144 72 27 -11 35 -26 75 -137 48
					-136 55 -148 90 -161 42 -16 67 0 161 107 126 141 136 140 230 -19 65 -110 82
					-130 119 -142 38 -11 66 17 138 137 37 62 68 114 69 116 2 2 18 5 36 8 32 5
					38 1 117 -88 160 -178 186 -174 262 44 43 121 46 127 78 136 33 10 38 8 140
					-69 110 -82 136 -95 175 -85 32 8 45 40 62 159 22 152 24 156 55 172 27 14 34
					12 158 -46 138 -63 163 -67 198 -28 15 17 16 35 11 166 -7 148 -7 148 20 167
					26 19 27 19 162 -13 111 -27 141 -31 164 -22 52 20 53 45 15 199 -35 139 -35
					139 -12 166 24 27 24 27 152 20 159 -8 179 -4 198 42 15 35 14 37 -45 166 -58
					124 -60 131 -46 158 16 31 20 33 175 55 115 17 153 36 158 78 4 34 -6 52 -94
					168 -70 93 -72 98 -62 130 10 33 15 36 136 79 218 76 222 102 44 262 -89 79
					-93 85 -88 117 3 18 6 34 8 36 2 1 54 32 116 69 120 72 148 100 137 138 -12
					37 -32 54 -142 119 -159 94 -160 104 -19 230 107 94 123 119 107 161 -13 35
					-25 42 -161 90 -111 40 -126 48 -137 75 -11 29 -9 34 72 144 93 126 103 158
					62 197 -17 16 -48 25 -127 37 -174 25 -168 23 -186 57 -16 30 -15 32 42 151
					64 134 70 170 33 200 -22 18 -34 19 -169 14 -145 -6 -145 -6 -164 20 -19 26
					-19 27 13 162 27 111 31 141 22 164 -20 52 -45 53 -199 15 -139 -35 -139 -35
					-165 -12 -26 23 -26 23 -20 166 5 133 4 145 -14 167 -30 37 -66 31 -200 -33
					-119 -57 -121 -58 -151 -42 -34 18 -33 13 -57 186 -13 90 -19 108 -41 128 -42
					37 -69 29 -193 -63 -110 -81 -115 -83 -144 -72 -27 11 -35 26 -75 137 -48 136
					-55 148 -90 161 -42 16 -67 0 -161 -107 -126 -141 -136 -140 -230 19 -34 58
					-69 111 -79 120 -27 24 -64 30 -89 12z m192 -699 c289 -14 648 -138 910 -314
					429 -288 723 -729 827 -1242 20 -102 23 -143 23 -360 0 -217 -3 -258 -23 -360
					-140 -692 -629 -1249 -1287 -1466 -239 -78 -463 -107 -732 -92 -403 22 -795
					181 -1127 459 -380 318 -637 833 -664 1332 -20 369 47 692 208 1004 272 530
					768 902 1350 1014 108 20 318 38 385 32 17 -1 75 -4 130 -7z`
				)
			)
		),
		depth: 120,
		sideColor: 'black',
		frontFaceColor: BLUE,
		backFaceColor: BLUE,
		strokeWidth: 20,
		description: 'text',
		strokeColor: 'black',
		crispEdges: false,
	});

	const y = interpolate(progress(5), [0, 1], [1600, 800]);

	const rotated = transformElement(inbetweenFaces, [
		rotateZ(frame / 100),
		scaled(0.5),
		rotateX(progress(5) * -Math.PI * 0.2),
		rotateY((progress(5) * -Math.PI) / 8),
		translateY(y),
		translateX(30),
	]);

	const shift = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 120,
		durationInFrames: 45,
	});

	const shiftOut = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		delay: 12 * 30,
		durationInFrames: 45,
	});

	const x = interpolate(shift + shiftOut, [0, 1, 2], [0, -900, 0]);
	const xSlide = interpolate(shift + shiftOut, [0, 1, 2], [1945, 0, 1945]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					transform: `translateX(${x}px)`,
				}}
			>
				<OffthreadVideo src={staticFile('rustpane.mov')} />
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					transform: `translateX(${xSlide}px)`,
				}}
			>
				<AbsoluteFill
					style={{
						left: 'calc(50% - 10px)',
						width: '50%',
						borderLeft: '20px solid black',
					}}
				/>
				<AbsoluteFill
					style={{
						backgroundColor: 'white',
						left: '50%',
						width: '50%',
					}}
				>
					<AbsoluteFill>
						<div
							style={{
								textAlign: 'center',
								fontFamily: 'Variable',
								fontSize: 160,
								marginTop: 280,
								fontVariationSettings: '"wght" 600',
								opacity: progress(0),
								translate:
									'0 ' + interpolate(progress(0), [0, 1], [100, 0]) + 'px',
							}}
						>
							Adopting Rust
						</div>
					</AbsoluteFill>
					<AbsoluteFill>
						<svg viewBox={viewBox.join(' ')}>
							<Faces elements={[rotated]} />
						</svg>
					</AbsoluteFill>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

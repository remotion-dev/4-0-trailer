import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const FeatureMap: React.FC = () => {
	const {fps, width, height} = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = (delay: number) =>
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
			durationInFrames: 30,
			delay,
		});

	const resize = spr(55);
	const resizeOffset = 150;
	const arrowScale = spring({
		fps,
		frame,
		delay: 85,
		config: {damping: 200},
	});

	const pointerStyle: React.CSSProperties = {
		transformOrigin: 'center center',
		transformBox: 'fill-box',
		transform: `translateX(${
			interpolate(spr(25), [0, 1], [0, 0]) +
			interpolate(resize, [0, 1], [-resizeOffset, 0])
		}px) translateY(${
			interpolate(spr(25), [0, 1], [-400, 0]) +
			interpolate(arrowScale, [0, 1], [0, -400])
		}px)`,
	};

	const showResize = frame >= 47 && frame <= 89;

	const outY = (delay: number) => (spr(180 + delay / 2) * -height) / 2;

	return (
		<AbsoluteFill
			style={{
				translate:
					interpolate(spr(0), [0, 1], [width, 0]) +
					interpolate(spr(200), [0, 1], [0, -width - 10]) +
					'px',
			}}
		>
			<AbsoluteFill
				style={{
					borderLeft: '15px solid black',
					marginLeft: -15,
				}}
			/>
			<AbsoluteFill
				style={{
					borderRight: '15px solid black',
					marginLeft: 15,
				}}
			/>
			<AbsoluteFill style={{backgroundColor: 'white'}}>
				<svg
					width={1920 * 2}
					height={1080 * 2}
					viewBox="0 0 1920 1080"
					fill="none"
				>
					<g id="Frame 10">
						<rect width="1920" height="1080" fill="white" />
						<g
							id="browserlogs"
							style={{
								transform: `translateX(${interpolate(
									spr(23),
									[0, 1],
									[-1000, 0]
								)}px) translateY(${outY(6)}px)`,
							}}
						>
							<rect
								id="Rectangle 8"
								x="146.635"
								y="445.164"
								width="474.306"
								height="191.601"
								rx="22.5413"
								fill="#EAEAEA"
								stroke="black"
								stroke-width="11.2706"
							/>
							<text
								id="Clean browser logs"
								fill="black"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="54.4748"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="198.525" y="530.292">
									Clean browser&#10;
								</tspan>
								<tspan x="330.324" y="593.292">
									logs
								</tspan>
							</text>
						</g>
						<g
							id="pdf"
							style={{
								transform: `translateY(${interpolate(
									spr(10),
									[0, 1],
									[1200, 0]
								)}px) translateY(${outY(15)}px)`,
							}}
						>
							<rect
								id="Rectangle 8_2"
								x="683.87"
								y="445.164"
								width="531.599"
								height="443.312"
								rx="22.5413"
								fill="#00FBBF"
								stroke="black"
								stroke-width="11.2706"
							/>
							<g id="PDF +">
								<text
									fill="black"
									xmlSpace="preserve"
									style={{whiteSpace: 'pre'}}
									font-family="GT Planar"
									font-size="94.8612"
									font-weight="900"
									letter-spacing="0em"
								>
									<tspan x="845.425" y="690.777">
										PDF{' '}
									</tspan>
								</text>
								<text
									fill="black"
									xmlSpace="preserve"
									style={{whiteSpace: 'pre'}}
									font-family="GT Planar"
									font-size="56.3532"
									font-weight="900"
									letter-spacing="0em"
								>
									<tspan x="1055.44" y="690.777">
										+
									</tspan>
								</text>
							</g>
							<text
								id="WebP"
								fill="black"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="94.8612"
								font-weight="900"
								letter-spacing="0em"
							>
								<tspan x="817.871" y="802.544">
									WebP
								</tspan>
							</text>
							<text
								id="Export as"
								fill="black"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="56.3532"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="821.773" y="566.758">
									Export as
								</tspan>
							</text>
						</g>
						<g
							id="types"
							style={{
								transform: `translateX(${interpolate(
									spr(13),
									[0, 1],
									[-1000, 0]
								)}px) translateY(${interpolate(
									spr(13),
									[0, 1],
									[1000, 0]
								)}px) translateY(${outY(12)}px)`,
							}}
						>
							<rect
								id="Rectangle 8_3"
								x="146.635"
								y="696.875"
								width="474.306"
								height="191.601"
								rx="22.5413"
								fill="#FF3232"
								stroke="black"
								stroke-width="11.2706"
							/>
							<text
								id="Stricter types and validation"
								fill="white"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="51.47"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="240.88" y="780.11">
									Stricter types&#10;
								</tspan>
								<tspan x="238.115" y="839.11">
									and validation
								</tspan>
							</text>
							<g id="Frame">
								<path
									id="Vector"
									d="M196 819C202.896 819 209.509 816.261 214.385 811.385C219.261 806.509 222 799.896 222 793C222 786.104 219.261 779.491 214.385 774.615C209.509 769.739 202.896 767 196 767C189.104 767 182.491 769.739 177.615 774.615C172.739 779.491 170 786.104 170 793C170 799.896 172.739 806.509 177.615 811.385C182.491 816.261 189.104 819 196 819ZM198.438 780V782.438V793.812V796.25H193.562V793.812V782.438V780H198.438ZM193.562 804.375V799.5H198.438V804.375H193.562Z"
									fill="white"
								/>
							</g>
						</g>
						<g
							id="datafetching"
							style={{
								transform: `translateX(${interpolate(
									spr(19),
									[0, 1],
									[1000, 0]
								)}px) translateY(${outY(9)}px)`,
							}}
						>
							<rect
								id="Rectangle 8_4"
								x="1284.97"
								y="445.164"
								width="488.395"
								height="191.601"
								rx="22.5413"
								fill="#232323"
								stroke="black"
								stroke-width="11.2706"
							/>
							<text
								id="Data fetching recipes"
								fill="white"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="54.4748"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="1349.62" y="530.291">
									Data fetching&#10;
								</tspan>
								<tspan x="1431.46" y="593.291">
									recipes
								</tspan>
							</text>
						</g>
						<g
							id="templates"
							style={{
								transform: `translateX(${interpolate(
									spr(15),
									[0, 1],
									[1000, 0]
								)}px) translateY(${interpolate(
									spr(13),
									[0, 1],
									[1000, 0]
								)}px) translateY(${outY(18)}px)`,
							}}
						>
							<rect
								id="Rectangle 8_5"
								x="1284.97"
								y="696.875"
								width="488.395"
								height="191.601"
								rx="22.5413"
								fill="#EAEAEA"
								stroke="black"
								stroke-width="11.2706"
							/>
							<text
								id="Two new templates"
								fill="black"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="54.4748"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="1412.21" y="782.002">
									Two new&#10;
								</tspan>
								<tspan x="1395" y="845.002">
									templates
								</tspan>
							</text>
						</g>
						<g
							id="dynamicduration"
							style={{
								transform: `translateX(${interpolate(
									spr(25),
									[0, 1],
									[-1000, 0]
								)}px) translateY(${
									interpolate(spr(13), [0, 1], [-1000, 0]) + outY(0)
								}px)`,
							}}
						>
							<rect
								id="Rectangle 7"
								x="146.635"
								y="190.635"
								width={String(
									interpolate(resize, [0, 1], [768.282 - resizeOffset, 768.282])
								)}
								height="205.689"
								rx="22.5413"
								fill="#0B84F3"
								stroke="black"
								stroke-width="11.2706"
							/>
							<text
								id="Easier dynamic duration"
								fill="white"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="54.4748"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="210.016" y="281.398">
									Easier dynamic&#10;
								</tspan>
								<tspan x="210.016" y="344.398">
									duration
								</tspan>
							</text>
						</g>
						<g
							id="ffmpeg"
							style={{
								transform: `translateX(${interpolate(
									spr(25),
									[0, 1],
									[1000, 0]
								)}px) translateY(${
									interpolate(spr(25), [0, 1], [-1000, 0]) + outY(3)
								}px)`,
							}}
						>
							<rect
								id="Rectangle 7_2"
								x={974.088 - resizeOffset + resize * resizeOffset}
								y="190.635"
								width={799.276 + resizeOffset - resize * resizeOffset}
								height="205.689"
								rx="22.5413"
								fill="white"
								stroke="black"
								stroke-width="11.2706"
							/>
							<g id="Frame_2" clip-path="url(#clip0_291_10)">
								<path
									id="Vector_2"
									d="M1459.01 252.116C1460.33 253.435 1460.33 255.576 1459.01 256.894L1432.16 283.894C1430.85 285.212 1428.72 285.212 1427.4 283.894L1413.98 270.394C1412.66 269.076 1412.66 266.935 1413.98 265.616C1415.29 264.298 1417.42 264.298 1418.73 265.616L1429.79 276.722L1454.27 252.116C1455.58 250.798 1457.71 250.798 1459.02 252.116H1459.01Z"
									fill="black"
								/>
							</g>
							<text
								id="FFmpeg"
								fill="black"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="92.47"
								font-weight="900"
								letter-spacing="0em"
							>
								<tspan
									x={1015 - resizeOffset + resizeOffset * resize}
									y="323.231"
								>
									FFmpeg
								</tspan>
							</text>
							<text
								id="built in 4x smaller"
								fill="black"
								xmlSpace="preserve"
								style={{whiteSpace: 'pre'}}
								font-family="GT Planar"
								font-size="54.4748"
								font-weight="bold"
								letter-spacing="0em"
							>
								<tspan x="1475" y="283.255">
									built in&#10;
								</tspan>
								<tspan x="1475" y="346.255">
									4x smaller
								</tspan>
							</text>
							<path
								id="Vector_3"
								d="M1459.01 312.116C1460.33 313.435 1460.33 315.576 1459.01 316.894L1432.16 343.894C1430.85 345.212 1428.72 345.212 1427.4 343.894L1413.98 330.394C1412.66 329.076 1412.66 326.935 1413.98 325.616C1415.29 324.298 1417.42 324.298 1418.73 325.616L1429.79 336.722L1454.27 312.116C1455.58 310.798 1457.71 310.798 1459.02 312.116H1459.01Z"
								fill="black"
							/>
						</g>
						{!showResize && (
							<g
								id="pointer"
								style={{
									...pointerStyle,
									transform:
										pointerStyle.transform +
										' ' +
										'translateX(110px) translateY(-20px)',
								}}
							>
								<mask
									id="path-22-outside-2_291_10"
									maskUnits="userSpaceOnUse"
									x="795"
									y="284"
									width="47"
									height="62"
									fill="black"
								>
									<rect fill="white" x="795" y="284" width="47" height="62" />
									<path d="M800 291.693V334.734C800 336.15 801.145 337.287 802.544 337.287C803.272 337.287 803.977 336.974 804.463 336.417L814.014 325.448L820.732 338.947C821.645 340.781 823.865 341.524 825.692 340.607C827.519 339.69 828.259 337.461 827.345 335.627L820.789 322.43H834.445C835.855 322.43 837 321.281 837 319.864C837 319.133 836.688 318.437 836.144 317.949L804.463 289.685C803.966 289.244 803.342 289 802.683 289C801.203 289 800 290.207 800 291.693Z" />
								</mask>
								<path
									d="M800 291.693V334.734C800 336.15 801.145 337.287 802.544 337.287C803.272 337.287 803.977 336.974 804.463 336.417L814.014 325.448L820.732 338.947C821.645 340.781 823.865 341.524 825.692 340.607C827.519 339.69 828.259 337.461 827.345 335.627L820.789 322.43H834.445C835.855 322.43 837 321.281 837 319.864C837 319.133 836.688 318.437 836.144 317.949L804.463 289.685C803.966 289.244 803.342 289 802.683 289C801.203 289 800 290.207 800 291.693Z"
									fill="black"
								/>
								<path
									d="M800 291.693V334.734C800 336.15 801.145 337.287 802.544 337.287C803.272 337.287 803.977 336.974 804.463 336.417L814.014 325.448L820.732 338.947C821.645 340.781 823.865 341.524 825.692 340.607C827.519 339.69 828.259 337.461 827.345 335.627L820.789 322.43H834.445C835.855 322.43 837 321.281 837 319.864C837 319.133 836.688 318.437 836.144 317.949L804.463 289.685C803.966 289.244 803.342 289 802.683 289C801.203 289 800 290.207 800 291.693Z"
									stroke="white"
									stroke-width="8.6"
									mask="url(#path-22-outside-2_291_10)"
								/>
							</g>
						)}

						{showResize && (
							<g id="arrow" style={pointerStyle}>
								<mask id="path-21-inside-1_291_10" fill="white">
									<path d="M958.662 291.309C959.513 290.527 960 289.414 960 288.25C960 287.085 959.513 285.99 958.662 285.19L939.193 267.112C937.976 265.982 936.203 265.687 934.691 266.347C933.178 267.008 932.188 268.52 932.188 270.172V279.906H898.812V270.172C898.812 268.52 897.822 267.008 896.309 266.347C894.797 265.687 893.024 265.982 891.807 267.112L872.338 285.19C871.487 285.99 871 287.085 871 288.25C871 289.414 871.487 290.51 872.338 291.309L891.807 309.387C893.024 310.517 894.797 310.813 896.309 310.152C897.822 309.492 898.812 307.979 898.812 306.328V296.594H932.188V306.328C932.188 307.979 933.178 309.492 934.691 310.152C936.203 310.813 937.976 310.517 939.193 309.387L958.662 291.309Z" />
								</mask>
								<path
									d="M958.662 291.309C959.513 290.527 960 289.414 960 288.25C960 287.085 959.513 285.99 958.662 285.19L939.193 267.112C937.976 265.982 936.203 265.687 934.691 266.347C933.178 267.008 932.188 268.52 932.188 270.172V279.906H898.812V270.172C898.812 268.52 897.822 267.008 896.309 266.347C894.797 265.687 893.024 265.982 891.807 267.112L872.338 285.19C871.487 285.99 871 287.085 871 288.25C871 289.414 871.487 290.51 872.338 291.309L891.807 309.387C893.024 310.517 894.797 310.813 896.309 310.152C897.822 309.492 898.812 307.979 898.812 306.328V296.594H932.188V306.328C932.188 307.979 933.178 309.492 934.691 310.152C936.203 310.813 937.976 310.517 939.193 309.387L958.662 291.309Z"
									fill="black"
									stroke="white"
									stroke-width="8.6"
									mask="url(#path-21-inside-1_291_10)"
								/>
							</g>
						)}
					</g>

					<defs>
						<clipPath id="clip0_291_10">
							<rect
								width="47"
								height="54"
								fill="white"
								transform="translate(1413 241)"
							/>
						</clipPath>
					</defs>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

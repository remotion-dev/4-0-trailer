import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Cursor: React.FC<{
	scale: number;
	rotation: number;
	positionX: number;
	positionY: number;
}> = ({scale, rotation, positionX, positionY}) => {
	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<svg
				style={{
					width: 80,
					transformBox: 'border-box',
					transform: `scale(${scale}) rotate(${rotation}deg) translateX(${
						positionX + 30
					}px) translateY(${positionY + 45}px)`,
				}}
				viewBox="0 0 217 291"
			>
				<path
					fill="white"
					d="M7.5 271V16.5L197 181L84.5 183L7.5 271Z"
					stroke="black"
					strokeWidth={15}
				/>
			</svg>
		</AbsoluteFill>
	);
};

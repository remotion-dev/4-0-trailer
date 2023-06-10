import React, {useState} from 'react';
import {random} from 'remotion';
import {threeDIntoSvgPath, ThreeDReducedInstruction} from './3d-svg';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	shouldDrawLine: boolean;
	strokeColor: string;
	strokeWidth: number;
}> = ({color, points, shouldDrawLine, strokeColor, strokeWidth}) => {
	const [id] = useState(() => random(null).toString().replace('.', ''));
	const d = threeDIntoSvgPath(points);

	return (
		<>
			<defs>
				{shouldDrawLine ? (
					<mask id={id}>
						<path d={d} fill="white" />
					</mask>
				) : null}
			</defs>
			<path
				d={d}
				fill={color}
				mask={shouldDrawLine ? `url(#${id})` : undefined}
				strokeLinecap="round"
				stroke={strokeColor}
				shapeRendering="crispEdges"
				strokeWidth={shouldDrawLine ? strokeWidth : 0}
			/>
		</>
	);
};

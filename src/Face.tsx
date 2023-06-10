import React, {useState} from 'react';
import {random} from 'remotion';
import {threeDIntoSvgPath, ThreeDReducedInstruction} from './3d-svg';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	strokeColor: string;
	strokeWidth: number;
}> = ({color, points, strokeColor, strokeWidth}) => {
	const [id] = useState(() => random(null).toString().replace('.', ''));
	const d = threeDIntoSvgPath(points);

	return (
		<>
			<defs>
				{strokeWidth ? (
					<mask id={id}>
						<path d={d} fill="white" />
					</mask>
				) : null}
			</defs>
			<path
				d={d}
				fill={color}
				mask={strokeWidth ? `url(#${id})` : undefined}
				strokeLinecap="round"
				stroke={strokeColor}
				shapeRendering="crispEdges"
				strokeWidth={strokeWidth}
			/>
		</>
	);
};

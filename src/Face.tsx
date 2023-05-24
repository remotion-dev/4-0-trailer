import React from 'react';
import {threeDIntoSvgPath, ThreeDReducedInstruction} from './3d-svg';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	shouldDrawLine: boolean;
	strokeColor: string;
}> = ({color, points, shouldDrawLine, strokeColor}) => {
	return (
		<path
			d={threeDIntoSvgPath(points)}
			fill={color}
			strokeLinejoin="bevel"
			strokeLinecap="round"
			stroke={strokeColor}
			shapeRendering="crispEdges"
			strokeWidth={shouldDrawLine ? 10 : 0}
		/>
	);
};

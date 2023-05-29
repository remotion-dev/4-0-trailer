import React from 'react';
import {threeDIntoSvgPath, ThreeDReducedInstruction} from './3d-svg';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	shouldDrawLine: boolean;
	strokeColor: string;
	strokeWidth: number;
}> = ({color, points, shouldDrawLine, strokeColor, strokeWidth}) => {
	return (
		<path
			d={threeDIntoSvgPath(points)}
			fill={color}
			strokeLinejoin="bevel"
			strokeLinecap="round"
			stroke={strokeColor}
			shapeRendering="crispEdges"
			strokeWidth={shouldDrawLine ? strokeWidth : 0}
		/>
	);
};

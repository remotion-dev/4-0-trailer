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
			strokeLinejoin="round"
			strokeLinecap="round"
			stroke={strokeColor}
			shapeRendering="crispEdges"
			strokeWidth={shouldDrawLine ? STROKE_WIDTH : 0}
		/>
	);
};

export const STROKE_WIDTH = 1;

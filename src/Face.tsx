import React from 'react';
import {threeDIntoSvgPath, ThreeDReducedInstruction} from './3d-svg';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	shouldDrawLine: boolean;
}> = ({color, points, shouldDrawLine}) => {
	return (
		<path
			d={threeDIntoSvgPath(points)}
			fill={color}
			strokeLinejoin="bevel"
			strokeLinecap="round"
			stroke="black"
			shapeRendering="crispEdges"
			strokeWidth={shouldDrawLine ? 0.1 : 0}
		/>
	);
};

import {serializeInstructions} from '@remotion/paths';
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
			strokeLinecap="butt"
			stroke="black"
			shapeRendering="crispEdges"
			strokeWidth={shouldDrawLine ? 0.1 : 0}
		/>
	);
};

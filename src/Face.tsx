import React from 'react';
import {Vector4D} from './multiply';

export const Face: React.FC<{
	points: Vector4D[];
	color: string;
	shouldDrawLine: boolean;
}> = ({color, points, shouldDrawLine}) => {
	return (
		<path
			d={points
				.map((p, i) => {
					if (i === points.length - 1) {
						return `Z`;
					}
					if (i === 0) {
						return `M ${p[0]} ${p[1]}`;
					}
					return `L ${p[0]} ${p[1]}`;
				})
				.join(' ')}
			fill={color}
			strokeLinejoin="bevel"
			strokeLinecap="butt"
			stroke="black"
			shapeRendering="crispEdges"
			strokeWidth={shouldDrawLine ? 0.1 : 0}
		/>
	);
};

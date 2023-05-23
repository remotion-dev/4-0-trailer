import React from 'react';
import {ThreeDReducedInstruction} from './3d-svg';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	shouldDrawLine: boolean;
}> = ({color, points, shouldDrawLine}) => {
	return (
		<path
			d={points
				.map((p) => {
					if (p.type === 'C') {
						return `C ${p.cp1[0]} ${p.cp1[2]} ${p.cp2[0]} ${p.cp2[1]} ${p.point[0]} ${p.point[1]}`;
					}
					if (p.type === 'L') {
						return `L ${p.point[0]} ${p.point[1]}`;
					}
					if (p.type === 'M') {
						return `M ${p.point[0]} ${p.point[1]}`;
					}
					if (p.type === 'Q') {
						return `Q ${p.cp[0]} ${p.cp[1]} ${p.point[0]} ${p.point[1]}`;
					}
					throw new Error('Unexpected');
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

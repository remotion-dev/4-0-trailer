import React from 'react';
import {Vector4D} from './multiply';

export const Face: React.FC<{
	points: Vector4D[];
	color: string;
}> = ({color, points}) => {
	return (
		<path
			d={points
				.map((p, i) => {
					if (i === 0) return `M ${p[0]} ${p[1]}`;
					return `L ${p[0]} ${p[1]}`;
				})
				.join(' ')}
			fill={color}
			stroke="black"
			strokeWidth={0.1}
		/>
	);
};

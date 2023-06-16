import React, {useState} from 'react';
import {threeDIntoSvgPath, ThreeDReducedInstruction} from './3d-svg';
import {makeId} from './make-id';

export const Face: React.FC<{
	points: ThreeDReducedInstruction[];
	color: string;
	strokeColor: string;
	strokeWidth: number;
}> = ({color, points, strokeColor, strokeWidth}) => {
	const [id] = useState(() => makeId());
	const d = threeDIntoSvgPath(points);

	return (
		<>
			<defs>
				{strokeWidth ? (
					<mask id={id}>
						<path shapeRendering="crispEdges" d={d} fill="white" />
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

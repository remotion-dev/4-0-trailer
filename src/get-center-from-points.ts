import {Vector4D} from './matrix';

export const getCenterFromPoints = (
	points: [Vector4D, Vector4D, Vector4D, Vector4D]
): Vector4D => {
	return [
		(points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4,
		(points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4,
		(points[0][2] + points[1][2] + points[2][2] + points[3][2]) / 4,
		1,
	];
};

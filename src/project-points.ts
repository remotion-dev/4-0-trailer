import {FaceType} from './map-face';
import {
	MatrixTransform4D,
	multiplyMatrix,
	multiplyMatrixAndSvgInstruction,
} from './matrix';

export const projectPoints = ({
	transformations,
	face,
}: {
	transformations: MatrixTransform4D[];
	face: FaceType;
}): FaceType => {
	let projected = face.points;
	let newCenterPoint = face.centerPoint;

	for (const transformation of transformations) {
		projected = projected.map((p) =>
			multiplyMatrixAndSvgInstruction(transformation, p)
		);
		newCenterPoint = multiplyMatrix(transformation, newCenterPoint);
	}

	return {
		color: face.color,
		points: projected,
		shouldDrawLine: face.shouldDrawLine,
		centerPoint: newCenterPoint,
		strokeWidth: face.strokeWidth,
	};
};

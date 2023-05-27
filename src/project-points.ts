import {FaceType} from './map-face';
import {
	MatrixTransform4D,
	multiplyMatrix,
	multiplyMatrixAndSvgInstruction,
} from './matrix';

export const projectPoints = ({
	camera,
	transformations,
	face,
}: {
	camera: MatrixTransform4D;
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

	projected = projected.map((p) => {
		return multiplyMatrixAndSvgInstruction(camera, p);
	});

	return {
		color: face.color,
		points: projected,
		shouldDrawLine: face.shouldDrawLine,
		isStroke: face.isStroke,
		centerPoint: newCenterPoint,
	};
};

import {FaceType, translateSvgInstruction} from './map-face';
import {
	MatrixTransform4D,
	multiplyMatrix,
	multiplyMatrixAndSvgInstruction,
} from './matrix';

export const projectPoints = ({
	camera,
	height,
	width,
	transformations,
	face,
}: {
	camera: MatrixTransform4D;
	width: number;
	height: number;
	transformations: MatrixTransform4D[];
	face: FaceType;
}): FaceType => {
	let projected = face.points.map((p) => {
		return translateSvgInstruction(p, -width / 2, -height / 2, 0);
	});

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

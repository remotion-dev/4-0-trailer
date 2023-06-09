import {FaceType} from './map-face';
import {MatrixTransform4D, multiplyMatrixAndSvgInstruction} from './matrix';

export const projectPoints = ({
	transformations,
	face,
}: {
	transformations: MatrixTransform4D[];
	face: FaceType;
}): FaceType => {
	let projected = face.points;

	for (const transformation of transformations) {
		projected = projected.map((p) =>
			multiplyMatrixAndSvgInstruction(transformation, p)
		);
	}

	return {
		color: face.color,
		points: projected,
		shouldDrawLine: face.shouldDrawLine,
		strokeWidth: face.strokeWidth,
	};
};

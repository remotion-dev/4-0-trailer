import {
	MatrixTransform4D,
	multiplyMatrixAndPoint,
	rotated,
	Vector4D,
} from './multiply';

type Face = {
	color: string;
	points: Vector4D[];
};

export const projectPoints = ({
	points,
	width,
	height,
	frame,
	camera,
}: {
	points: number[][];
	width: number;
	height: number;
	frame: number;
	camera: MatrixTransform4D;
}): Face => {
	const projected = points
		.map((p) => {
			return [p[0] - width / 2, p[1] - height / 2, p[2], 1] as Vector4D;
		})
		.map((p) => {
			return [p[0], p[1], p[2], p[3]] as Vector4D;
		})
		.map((p) => {
			return multiplyMatrixAndPoint(rotated([0, 1, 0], frame / 20), p);
		})
		.map((p) => {
			return multiplyMatrixAndPoint(rotated([1, 0, 0], frame / 40), p);
		})
		.map((p) => {
			return multiplyMatrixAndPoint(camera, p);
		});
	return {
		color: 'white',
		points: projected,
	};
};

export const sortFacesZIndex = (face: Face[]): Face[] => {
	return face.slice().sort((a, b) => {
		const aZ =
			a.points.reduce((acc, curr) => acc + curr[2], 0) / a.points.length;
		const bZ: number =
			b.points.reduce((acc, curr) => acc + curr[2], 0) / b.points.length;
		return bZ - aZ;
	});
};

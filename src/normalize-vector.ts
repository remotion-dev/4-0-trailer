import {Vector4D} from './matrix';

export const normalizeVector = (vec: Vector4D, width: number) => {
	const magnitude = Math.sqrt(
		vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]
	);

	if (magnitude === 0) {
		throw new Error('Cannot normalize a zero vector');
	}

	return [
		(vec[0] / magnitude) * width,
		(vec[1] / magnitude) * width,
		(vec[2] / magnitude) * width,
		(vec[3] / magnitude) * width,
	];
};

export const cross = (vec: Vector4D, other: Vector4D): Vector4D => {
	const [x, y, z, w] = vec;

	const newX = y * other[2] - z * other[1];
	const newY = z * other[0] - x * other[2];
	const newZ = x * other[1] - y * other[0];

	return [newX, newY, newZ, w];
};
export const isZero = (vec: Vector4D) => {
	const [x, y, z, w] = vec;

	return x === 0 && y === 0 && z === 0 && w === 0;
};

export const getOrthogonalVector = (vec: Vector4D): Vector4D => {
	const basisVectors: Vector4D[] = [
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
	];

	let otherVector: Vector4D | null = null;
	for (const basisVector of basisVectors) {
		const crossProduct = cross(vec, basisVector);
		if (!isZero(crossProduct)) {
			otherVector = basisVector;
			break;
		}
	}

	if (otherVector === null) {
		throw new Error('Could not find an orthogonal vector');
	}

	const crossProduct = cross(vec, otherVector);

	return [
		vec[0] + crossProduct[0],
		vec[1] + crossProduct[1],
		vec[2] + crossProduct[2],
		vec[3] + crossProduct[3],
	];
};

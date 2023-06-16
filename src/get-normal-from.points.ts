// https://chat.openai.com/share/64b88cfd-a02f-46ce-8186-ea316019b24b

import {Vector4D} from './matrix';

export const getNormalFromPoints = (
	a: Vector4D,
	b: Vector4D,
	c: Vector4D
): Vector4D => {
	const x1 = a[0];
	const y1 = a[1];
	const z1 = a[2];

	const x2 = b[0];
	const y2 = b[1];
	const z2 = b[2];

	const x3 = c[0];
	const y3 = c[1];
	const z3 = c[2];

	const nx = (y2 - y1) * (z3 - z1) - (z2 - z1) * (y3 - y1);
	const ny = (z2 - z1) * (x3 - x1) - (x2 - x1) * (z3 - z1);
	const nz = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);

	return [nx, ny, nz, 1];
};

import {ThreeDReducedInstruction} from './3d-svg';

export const translated4d = function (vec: Vector) {
	return stride({v: vec, m: identity4(), width: 4, offset: 3, colStride: 0});
};

const stride = function ({
	v,
	m,
	width,
	offset,
	colStride,
}: {
	v: Vector;
	m: MatrixTransform4D;
	width: number;
	offset: number;
	colStride: number;
}) {
	for (let i = 0; i < v.length; i++) {
		m[
			i * width + // Column
				((i * colStride + offset + width) % width) // Row
		] = v[i];
	}
	return m;
};

const identity4 = function (): MatrixTransform4D {
	const n = 4;
	let size = n * n;
	const m = new Array(size) as MatrixTransform4D;
	while (size--) {
		m[size] = size % (n + 1) === 0 ? 1.0 : 0.0;
	}
	return m;
};

export const m44multiply = (
	...matrices: MatrixTransform4D[]
): MatrixTransform4D => {
	return multiplyMany(4, matrices);
};

// Accept an integer indicating the size of the matrices being multiplied (3 for 3x3), and any
// number of matrices following it.
function multiplyMany(
	size: number,
	listOfMatrices: MatrixTransform4D[]
): MatrixTransform4D {
	if (listOfMatrices.length < 2) {
		throw new Error('multiplication expected two or more matrices');
	}
	let result = mul(listOfMatrices[0], listOfMatrices[1], size);
	let next = 2;
	while (next < listOfMatrices.length) {
		result = mul(result, listOfMatrices[next], size);
		next++;
	}
	return result as MatrixTransform4D;
}

function mul(m1: number[], m2: number[], size: number): number[] {
	if (m1.length !== m2.length) {
		throw new Error(
			`Undefined for matrices of different sizes. m1.length=${m1.length}, m2.length=${m2.length}`
		);
	}
	if (size * size !== m1.length) {
		throw new Error(
			`Undefined for non-square matrices. array size was ${size}`
		);
	}

	const result = Array(m1.length);
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			// Accumulate a sum of m1[r,k]*m2[k, c]
			let acc = 0;
			for (let k = 0; k < size; k++) {
				acc += m1[size * r + k] * m2[size * k + c];
			}
			result[r * size + c] = acc;
		}
	}
	return result;
}

export type Vector = [number, number, number];
export type Vector4D = [number, number, number, number];

export const rotated = function (
	axisVec: Vector,
	radians: number
): MatrixTransform4D {
	return rotatedUnitSinCos(
		normalize(axisVec),
		Math.sin(radians),
		Math.cos(radians)
	);
};

export type MatrixTransform4D = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
];

const rotatedUnitSinCos = function (
	axisVec: Vector,
	sinAngle: number,
	cosAngle: number
): MatrixTransform4D {
	const x = axisVec[0];
	const y = axisVec[1];
	const z = axisVec[2];
	const c = cosAngle;
	const s = sinAngle;
	const t = 1 - c;
	return [
		t * x * x + c,
		t * x * y - s * z,
		t * x * z + s * y,
		0,
		t * x * y + s * z,
		t * y * y + c,
		t * y * z - s * x,
		0,
		t * x * z - s * y,
		t * y * z + s * x,
		t * z * z + c,
		0,
		0,
		0,
		0,
		1,
	];
};

const normalize = function (v: Vector): Vector {
	return mulScalar(v, 1 / vectorLength(v));
};

const vectorLength = function (v: number[]) {
	return Math.sqrt(lengthSquared(v));
};

const lengthSquared = function (v: number[]) {
	return dot(v, v);
};
const dot = function (a: number[], b: number[]) {
	if (a.length !== b.length) {
		throw new Error(
			`Cannot perform dot product on arrays of different length (${a.length} vs ${b.length})`
		);
	}
	return a
		.map((v, i) => {
			return v * b[i];
		})
		.reduce((acc, cur) => {
			return acc + cur;
		});
};

const scaled = function (vec: Vector) {
	return stride({v: vec, m: identity4(), width: 4, offset: 0, colStride: 1});
};

export const translated = function (vec: Vector) {
	return stride({v: vec, m: identity4(), width: 4, offset: 3, colStride: 0});
};

const invert4d = function (m: MatrixTransform4D): MatrixTransform4D {
	if (!m.every((m) => !isNaN(m))) {
		throw new Error('some members of matrix are NaN m=' + m);
	}

	const a00 = m[0];
	const a01 = m[4];
	const a02 = m[8];
	const a03 = m[12];
	const a10 = m[1];
	const a11 = m[5];
	const a12 = m[9];
	const a13 = m[13];
	const a20 = m[2];
	const a21 = m[6];
	const a22 = m[10];
	const a23 = m[14];
	const a30 = m[3];
	const a31 = m[7];
	const a32 = m[11];
	const a33 = m[15];

	let b00 = a00 * a11 - a01 * a10;
	let b01 = a00 * a12 - a02 * a10;
	let b02 = a00 * a13 - a03 * a10;
	let b03 = a01 * a12 - a02 * a11;
	let b04 = a01 * a13 - a03 * a11;
	let b05 = a02 * a13 - a03 * a12;
	let b06 = a20 * a31 - a21 * a30;
	let b07 = a20 * a32 - a22 * a30;
	let b08 = a20 * a33 - a23 * a30;
	let b09 = a21 * a32 - a22 * a31;
	let b10 = a21 * a33 - a23 * a31;
	let b11 = a22 * a33 - a23 * a32;

	// Calculate determinate
	const det =
		b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	const invdet = 1.0 / det;

	// Bail out if the matrix is not invertible
	if (det === 0 || invdet === Infinity) {
		throw new Error('Warning, uninvertible matrix');
	}

	b00 *= invdet;
	b01 *= invdet;
	b02 *= invdet;
	b03 *= invdet;
	b04 *= invdet;
	b05 *= invdet;
	b06 *= invdet;
	b07 *= invdet;
	b08 *= invdet;
	b09 *= invdet;
	b10 *= invdet;
	b11 *= invdet;

	// Store result in row major order
	const tmp: MatrixTransform4D = [
		a11 * b11 - a12 * b10 + a13 * b09,
		a12 * b08 - a10 * b11 - a13 * b07,
		a10 * b10 - a11 * b08 + a13 * b06,
		a11 * b07 - a10 * b09 - a12 * b06,

		a02 * b10 - a01 * b11 - a03 * b09,
		a00 * b11 - a02 * b08 + a03 * b07,
		a01 * b08 - a00 * b10 - a03 * b06,
		a00 * b09 - a01 * b07 + a02 * b06,

		a31 * b05 - a32 * b04 + a33 * b03,
		a32 * b02 - a30 * b05 - a33 * b01,
		a30 * b04 - a31 * b02 + a33 * b00,
		a31 * b01 - a30 * b03 - a32 * b00,

		a22 * b04 - a21 * b05 - a23 * b03,
		a20 * b05 - a22 * b02 + a23 * b01,
		a21 * b02 - a20 * b04 - a23 * b00,
		a20 * b03 - a21 * b01 + a22 * b00,
	];

	if (
		!tmp.every((val) => {
			return !isNaN(val) && val !== Infinity && val !== -Infinity;
		})
	) {
		throw new Error('inverted matrix contains infinities or NaN ' + tmp);
	}
	return tmp;
};

const mustInvert = function (m: MatrixTransform4D): MatrixTransform4D {
	const m2 = invert4d(m);
	if (m2 === null) {
		throw new Error('Matrix not invertible');
	}
	return m2;
};

const perspective = function (near: number, far: number, angle: number) {
	if (far <= near) {
		throw new Error(
			'far must be greater than near when constructing M44 using perspective.'
		);
	}
	const dInv = 1 / (far - near);
	const halfAngle = angle / 2;
	const cot = Math.cos(halfAngle) / Math.sin(halfAngle);
	return [
		cot,
		0,
		0,
		0,
		0,
		cot,
		0,
		0,
		0,
		0,
		(far + near) * dInv,
		2 * far * near * dInv,
		0,
		0,
		-1,
		1,
	] as MatrixTransform4D;
};

export type Camera = {
	near: number;
	far: number;
	angle: number;
	eye: Vector;
	coa: Vector;
	up: Vector;
};

type Area = readonly [number, number, number, number];

export const setupCamera = function (area: Area, zscale: number, cam: Camera) {
	const camera = lookat(cam.eye, cam.coa, cam.up);
	const persp = perspective(cam.near, cam.far, cam.angle);
	const center: Vector = [(area[0] + area[2]) / 2, (area[1] + area[3]) / 2, 0];
	const viewScale: Vector = [
		(area[2] - area[0]) / 2,
		(area[3] - area[1]) / 2,
		zscale,
	];
	const viewport = m44multiply(translated4d(center), scaled(viewScale));
	return m44multiply(viewport, persp, camera, mustInvert(viewport));
};

const sub = function (a: Vector, b: Vector): Vector {
	return a.map((v, i) => {
		return v - b[i];
	}) as Vector;
};

const mulScalar = function <T extends number[]>(v: T, s: number): T {
	return v.map((i) => {
		return i * s;
	}) as T;
};

const lookat = function (eyeVec: Vector, centerVec: Vector, upVec: Vector) {
	const f = normalize(sub(centerVec, eyeVec));
	const u = normalize(upVec);
	const s = normalize(cross(f, u));

	const m = identity4();
	// Set each column's top three numbers
	stride({v: s, m, width: 4, offset: 0, colStride: 0});
	stride({
		v: cross(s, f),
		m,
		width: 4,
		offset: 1,
		colStride: 0,
	});
	stride({
		v: mulScalar(f, -1),
		m,
		width: 4,
		offset: 2,
		colStride: 0,
	});
	stride({v: eyeVec, m, width: 4, offset: 3, colStride: 0});

	const m2 = invert4d(m);
	if (m2 === null) {
		return identity4();
	}
	return m2;
};

const cross = function (a: Vector, b: Vector): Vector {
	if (a.length !== 3 || a.length !== 3) {
		throw new Error(
			`Cross product is only defined for 3-dimensional vectors (a.length=${a.length}, b.length=${b.length})`
		);
	}
	return [
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0],
	];
};

export function multiplyMatrixAndPoint(
	matrix: MatrixTransform4D,
	point: Vector4D
): Vector4D {
	const result: number[] = [];

	for (let i = 0; i < 4; i++) {
		result[i] =
			matrix[i] * point[0] +
			matrix[i + 4] * point[1] +
			matrix[i + 8] * point[2] +
			matrix[i + 12] * point[3];
	}

	return result as Vector4D;
}

export function multiplyMatrixAndSvgInstruction(
	matrix: MatrixTransform4D,
	point: ThreeDReducedInstruction
): ThreeDReducedInstruction {
	if (point.type === 'C') {
		return {
			type: 'C',
			cp1: multiplyMatrix(matrix, point.cp1),
			cp2: multiplyMatrix(matrix, point.cp2),
			point: multiplyMatrix(matrix, point.point),
		};
	}
	if (point.type === 'Q') {
		return {
			type: 'Q',
			cp: multiplyMatrix(matrix, point.cp),
			point: multiplyMatrix(matrix, point.point),
		};
	}
	if (point.type === 'M') {
		return {
			type: 'M',
			point: multiplyMatrix(matrix, point.point),
		};
	}
	if (point.type === 'L') {
		return {
			type: 'L',
			point: multiplyMatrix(matrix, point.point),
		};
	}
	throw new Error('Unknown instruction type: ' + JSON.stringify(point));
}

export const multiplyMatrix = (matrix: MatrixTransform4D, point: Vector4D) => {
	const result = [];

	for (let i = 0; i < 4; i++) {
		result[i] =
			matrix[i] * point[0] +
			matrix[i + 4] * point[1] +
			matrix[i + 8] * point[2] +
			matrix[i + 12] * point[3];
	}
	return result as Vector4D;
};

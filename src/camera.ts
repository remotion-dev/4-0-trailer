import {
	identity4,
	MatrixTransform4D,
	mulScalar,
	normalize,
	stride,
	Vector,
	Vector4D,
} from './matrix';

export const cameraEye = [0, 0, 10000, 1] as Vector4D;

type Area = readonly [number, number, number, number];

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

export const cross = function (a: Vector, b: Vector): Vector {
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

const sub = function (a: Vector, b: Vector): Vector {
	return a.map((v, i) => {
		return v - b[i];
	}) as Vector;
};

export const sub4d = function (a: Vector4D, b: Vector4D): Vector4D {
	return a.map((v, i) => {
		return v - b[i];
	}) as Vector4D;
};

export const add4d = function (a: Vector4D, b: Vector4D): Vector4D {
	return a.map((v, i) => {
		return v + b[i];
	}) as Vector4D;
};

export const multiply4d = function (a: Vector4D, t: number): Vector4D {
	return a.map((v) => {
		return v * t;
	}) as Vector4D;
};

const mustInvert = function (m: MatrixTransform4D): MatrixTransform4D {
	const m2 = invert4d(m);
	if (m2 === null) {
		throw new Error('Matrix not invertible');
	}
	return m2;
};

// Choose a camAngle so that the cotan of half the angle is 1.
// Then the SVG path at 0 will get its natural size.
const camAngle = 0.5 * (4 * Math.PI + Math.PI);

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

export const invert4d = function (m: MatrixTransform4D): MatrixTransform4D {
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

const scaled = function (vec: Vector) {
	return stride({v: vec, m: identity4(), width: 4, offset: 0, colStride: 1});
};

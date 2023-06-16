// https://chat.openai.com/share/7f0b2f9b-5789-49c9-a75d-3c0e7aafbbf1

import {add4d, multiply4d, sub4d} from './camera';
import {dot, Vector4D} from './matrix';

type Result =
	| {
			type: 'parallel';
	  }
	| {
			type: 'intersection';
			point: Vector4D;
	  };

export const rayTracing = ({
	camera,
	firstPlaneCorner,
	secondPlanePoint,
	secondPlaneNormal,
	debug,
}: {
	camera: Vector4D;
	firstPlaneCorner: Vector4D;
	secondPlanePoint: Vector4D;
	secondPlaneNormal: Vector4D;
	debug?: boolean;
}): Result => {
	// Point on the line: P1
	const p1 = camera;
	const p2 = firstPlaneCorner;

	//  Point in the plane: P0
	const p0 = secondPlanePoint;
	// Normal to the plane: n
	const n = secondPlaneNormal;
	// Direction vector of the line: d = P2 - P1
	const d = sub4d(p2, p1);

	const dDotN = dot(d, n);

	if (Math.abs(dDotN) < 1e-6) {
		return {
			type: 'parallel',
		};
	}

	const t = dot(sub4d(p0, p1), n) / dDotN;

	if (debug) {
		console.log({t, dDotN});
	}

	// P(t) = P1 + t * d
	const intersection = add4d(p1, multiply4d(d, t));

	return {
		type: 'intersection',
		point: intersection,
	};
};

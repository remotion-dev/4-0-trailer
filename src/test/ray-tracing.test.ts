import {expect, test} from 'vitest';
import {rayTracing} from '../ray-tracing';

test('do ray tracing', () => {
	expect(
		rayTracing({
			camera: [0, 0, 10000, 1],
			firstPlaneCorner: [-176.95, -229.5, 75, 1],
			secondPlanePoint: [562.5, 225, 0, 1],
			secondPlaneNormal: [-1, 0, 0, 1],
		})
	).toBe(1);
});

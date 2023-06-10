import {sub4d} from './camera';
import {dot, normalize4d, Vector4D} from './matrix';

export class Quad3D {
	constructor(public vertices: Vector4D[]) {
		if (vertices.length !== 4)
			throw new Error('Quadrilateral must have 4 vertices');
	}
}

function projectQuadOnAxis(quad: Quad3D, axis: Vector4D): [number, number] {
	let min = Infinity;
	let max = -Infinity;

	for (const vertex of quad.vertices) {
		const d = dot(vertex, axis);
		min = Math.min(min, d);
		max = Math.max(max, d);
	}

	return [min, max];
}

export function quadrilateralsOverlap(quad1: Quad3D, quad2: Quad3D): boolean {
	const edges = [
		sub4d(quad1.vertices[1], quad1.vertices[0]),
		sub4d(quad1.vertices[2], quad1.vertices[1]),
		sub4d(quad2.vertices[0], quad2.vertices[1]),
		sub4d(quad2.vertices[1], quad2.vertices[2]),
	];

	for (const edge of edges) {
		const axis = normalize4d(edge);
		const [min1, max1] = projectQuadOnAxis(quad1, axis);
		const [min2, max2] = projectQuadOnAxis(quad2, axis);

		if (max1 < min2 || max2 < min1) return false;
	}

	return true;
}

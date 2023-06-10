import {expect, test} from 'vitest';
import {multiplyMatrix, translateX} from '../matrix';

test('Translation', () => {
	const result = multiplyMatrix(translateX(30), [0, 0, 0, 1]);
	expect(result).toEqual([30, 20, 10, 1]);
});

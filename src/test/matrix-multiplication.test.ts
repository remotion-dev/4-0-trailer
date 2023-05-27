import {expect, test} from 'vitest';
import {multiplyMatrix, translated} from '../matrix';

test('Translation', () => {
	const result = multiplyMatrix(translated([30, 20, 10]), [0, 0, 0, 1]);
	expect(result).toEqual([30, 20, 10, 1]);
});

import { generateMathRandomValues } from '../src/random';

it('should generate random array of numbers', () => {
    const length = 32;
    const result = generateMathRandomValues(length);
    expect(result.length).toEqual(length);
});

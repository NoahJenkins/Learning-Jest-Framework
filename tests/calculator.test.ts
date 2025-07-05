import { sum, subtract, multiply, divide } from '../src/calculator';

describe('Calculator', () => {
    test('sum', () => {
        expect(sum(1, 2)).toBe(3);
    });

    test('subtract', () => {
        expect(subtract(5, 3)).toBe(2);
    });

    test('multiply', () => {
        expect(multiply(4, 3)).toBe(12);
    });

    test('divide', () => {
        expect(divide(10, 2)).toBe(5);
    });

    test('divide by zero', () => {
        expect(() => divide(10, 0)).toThrow('Division by zero is not allowed');
    });

    test('sum with negative numbers', () => {
        expect(sum(-1, -2)).toBe(-3);
        expect(sum(-1, 2)).toBe(1);
    });

    test('subtract resulting in negative numbers', () => {
        expect(subtract(3, 5)).toBe(-2);
        expect(subtract(-5, -3)).toBe(-2);
    });

    test('multiply with zero', () => {
        expect(multiply(0, 5)).toBe(0);
        expect(multiply(5, 0)).toBe(0);
    });

    test('divide resulting in fractions', () => {
        expect(divide(1, 2)).toBe(0.5);
        expect(divide(3, 4)).toBe(0.75);
    });

    test('divide with negative numbers', () => {
        expect(divide(-10, 2)).toBe(-5);
        expect(divide(10, -2)).toBe(-5);
        expect(divide(-10, -2)).toBe(5);
    });
});
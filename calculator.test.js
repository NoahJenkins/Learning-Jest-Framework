import { sum, subtract, multiply, divide } from './calculator.js';

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
});

import { runInteractiveCalculator } from '../src/calculator';
import * as readline from 'readline';

// Mock readline module
jest.mock('readline');
const mockReadline = readline as jest.Mocked<typeof readline>;

describe('Interactive Calculator', () => {
    let mockRl: any;
    let mockQuestion: jest.Mock;
    let mockClose: jest.Mock;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        // Setup mocks
        mockQuestion = jest.fn();
        mockClose = jest.fn();
        
        mockRl = {
            question: mockQuestion,
            close: mockClose
        };

        mockReadline.createInterface.mockReturnValue(mockRl);
        
        // Spy on console.log to capture output
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    test('should display welcome message', () => {
        runInteractiveCalculator();

        expect(consoleSpy).toHaveBeenCalledWith('Welcome to the Interactive Calculator!');
        expect(consoleSpy).toHaveBeenCalledWith('Available operations: +, -, *, /');
        expect(consoleSpy).toHaveBeenCalledWith('Type "exit" or "quit" at any time to close the calculator\n');
    });

    test('should create readline interface with correct options', () => {
        runInteractiveCalculator();

        expect(mockReadline.createInterface).toHaveBeenCalledWith({
            input: process.stdin,
            output: process.stdout
        });
    });

    test('should exit when user types "exit" as first input', () => {
        runInteractiveCalculator();

        // Simulate user typing "exit"
        const questionCallback = mockQuestion.mock.calls[0][1];
        questionCallback('exit');

        expect(consoleSpy).toHaveBeenCalledWith('Thank you for using the calculator! Goodbye!');
        expect(mockClose).toHaveBeenCalled();
    });

    test('should exit when user types "quit" as first input', () => {
        runInteractiveCalculator();

        // Simulate user typing "quit"
        const questionCallback = mockQuestion.mock.calls[0][1];
        questionCallback('quit');

        expect(consoleSpy).toHaveBeenCalledWith('Thank you for using the calculator! Goodbye!');
        expect(mockClose).toHaveBeenCalled();
    });

    test('should handle invalid number input and ask again', () => {
        runInteractiveCalculator();

        // Simulate invalid number input
        const questionCallback = mockQuestion.mock.calls[0][1];
        questionCallback('invalid');

        expect(consoleSpy).toHaveBeenCalledWith('Invalid number. Please try again.\n');
        // Should call question again for retry
        expect(mockQuestion).toHaveBeenCalledTimes(2);
    });

    test('should proceed to operation input with valid first number', () => {
        runInteractiveCalculator();

        // Simulate valid number input
        const questionCallback = mockQuestion.mock.calls[0][1];
        questionCallback('10');

        // Should ask for operation
        expect(mockQuestion).toHaveBeenCalledTimes(2);
        expect(mockQuestion.mock.calls[1][0]).toBe('Enter the operation (+, -, *, /): ');
    });

    test('should handle invalid operation and restart', () => {
        runInteractiveCalculator();

        // First input: valid number
        const firstQuestionCallback = mockQuestion.mock.calls[0][1];
        firstQuestionCallback('10');

        // Second input: invalid operation
        const secondQuestionCallback = mockQuestion.mock.calls[1][1];
        secondQuestionCallback('invalid');

        expect(consoleSpy).toHaveBeenCalledWith('Invalid operation. Please use +, -, *, or /\n');
        // Should restart the calculation
        expect(mockQuestion).toHaveBeenCalledTimes(3);
    });

    test('should proceed to second number with valid operation', () => {
        runInteractiveCalculator();

        // First input: valid number
        const firstQuestionCallback = mockQuestion.mock.calls[0][1];
        firstQuestionCallback('10');

        // Second input: valid operation
        const secondQuestionCallback = mockQuestion.mock.calls[1][1];
        secondQuestionCallback('+');

        // Should ask for second number
        expect(mockQuestion).toHaveBeenCalledTimes(3);
        expect(mockQuestion.mock.calls[2][0]).toBe('Enter the second number: ');
    });

    test('should perform addition calculation correctly', () => {
        runInteractiveCalculator();

        // First input: number
        expect(mockQuestion).toHaveBeenCalledTimes(1);
        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('10');

        // Second input: operation
        expect(mockQuestion).toHaveBeenCalledTimes(2);
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');

        // Third input: second number
        expect(mockQuestion).toHaveBeenCalledTimes(3);
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('5');

        expect(consoleSpy).toHaveBeenCalledWith('Result: 10 + 5 = 15\n');
        
        // Should ask if user wants to continue
        expect(mockQuestion).toHaveBeenCalledTimes(4);
        expect(mockQuestion.mock.calls[3][0]).toBe('Would you like to perform another calculation? (y/n): ');
    });

    test('should perform subtraction calculation correctly', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('15');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('-');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('7');

        expect(consoleSpy).toHaveBeenCalledWith('Result: 15 - 7 = 8\n');
    });

    test('should perform multiplication calculation correctly', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('6');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('*');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('7');

        expect(consoleSpy).toHaveBeenCalledWith('Result: 6 * 7 = 42\n');
    });

    test('should perform division calculation correctly', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('20');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('/');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('4');

        expect(consoleSpy).toHaveBeenCalledWith('Result: 20 / 4 = 5\n');
    });

    test('should handle division by zero error', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('10');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('/');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('0');

        expect(consoleSpy).toHaveBeenCalledWith('Error: Division by zero is not allowed\n');
        
        // Should still ask if user wants to continue
        expect(mockQuestion).toHaveBeenCalledTimes(4);
    });

    test('should continue calculation when user chooses "y"', () => {
        runInteractiveCalculator();

        // Complete first calculation
        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('5');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('3');
        
        // Choose to continue
        const fourthCallback = mockQuestion.mock.calls[3][1];
        fourthCallback('y');

        expect(consoleSpy).toHaveBeenCalledWith(''); // Blank line for readability
        // Should ask for first number again
        expect(mockQuestion).toHaveBeenCalledTimes(5);
    });

    test('should continue calculation when user chooses "yes"', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('5');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('3');
        
        const fourthCallback = mockQuestion.mock.calls[3][1];
        fourthCallback('yes');

        expect(consoleSpy).toHaveBeenCalledWith('');
        expect(mockQuestion).toHaveBeenCalledTimes(5);
    });

    test('should exit when user chooses "n"', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('5');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('3');
        
        const fourthCallback = mockQuestion.mock.calls[3][1];
        fourthCallback('n');

        expect(consoleSpy).toHaveBeenCalledWith('Thank you for using the calculator! Goodbye!');
        expect(mockClose).toHaveBeenCalled();
    });

    test('should exit when user chooses "no"', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('5');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('3');
        
        const fourthCallback = mockQuestion.mock.calls[3][1];
        fourthCallback('no');

        expect(consoleSpy).toHaveBeenCalledWith('Thank you for using the calculator! Goodbye!');
        expect(mockClose).toHaveBeenCalled();
    });

    test('should handle case-insensitive exit commands', () => {
        runInteractiveCalculator();

        // Test uppercase EXIT
        const questionCallback = mockQuestion.mock.calls[0][1];
        questionCallback('EXIT');

        expect(consoleSpy).toHaveBeenCalledWith('Thank you for using the calculator! Goodbye!');
        expect(mockClose).toHaveBeenCalled();
    });

    test('should handle invalid second number input', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('10');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('invalid');

        expect(consoleSpy).toHaveBeenCalledWith('Invalid number. Please try again.\n');
        // Should restart the calculation
        expect(mockQuestion).toHaveBeenCalledTimes(4);
    });

    test('should handle decimal numbers correctly', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('10.5');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('+');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('2.3');

        expect(consoleSpy).toHaveBeenCalledWith('Result: 10.5 + 2.3 = 12.8\n');
    });

    test('should handle negative numbers correctly', () => {
        runInteractiveCalculator();

        const firstCallback = mockQuestion.mock.calls[0][1];
        firstCallback('-5');
        
        const secondCallback = mockQuestion.mock.calls[1][1];
        secondCallback('*');
        
        const thirdCallback = mockQuestion.mock.calls[2][1];
        thirdCallback('3');

        expect(consoleSpy).toHaveBeenCalledWith('Result: -5 * 3 = -15\n');
    });
});

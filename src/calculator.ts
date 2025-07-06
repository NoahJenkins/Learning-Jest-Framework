import * as readline from 'readline';

export function sum(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}

export function multiply(a: number, b: number): number {
    return a * b;
}

export function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error('Division by zero is not allowed');
    }
    return a / b;
}

export function runInteractiveCalculator(): void {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Welcome to the Interactive Calculator!');
    console.log('Available operations: +, -, *, /');

    rl.question('Enter the first number: ', (firstInput) => {
        const firstNumber = parseFloat(firstInput);
        
        if (isNaN(firstNumber)) {
            console.log('Invalid number. Please try again.');
            rl.close();
            return;
        }

        rl.question('Enter the operation (+, -, *, /): ', (operation) => {
            if (!['+', '-', '*', '/'].includes(operation)) {
                console.log('Invalid operation. Please use +, -, *, or /');
                rl.close();
                return;
            }

            rl.question('Enter the second number: ', (secondInput) => {
                const secondNumber = parseFloat(secondInput);
                
                if (isNaN(secondNumber)) {
                    console.log('Invalid number. Please try again.');
                    rl.close();
                    return;
                }

                try {
                    let result: number;
                    
                    switch (operation) {
                        case '+':
                            result = sum(firstNumber, secondNumber);
                            break;
                        case '-':
                            result = subtract(firstNumber, secondNumber);
                            break;
                        case '*':
                            result = multiply(firstNumber, secondNumber);
                            break;
                        case '/':
                            result = divide(firstNumber, secondNumber);
                            break;
                        default:
                            throw new Error('Invalid operation');
                    }

                    console.log(`Result: ${firstNumber} ${operation} ${secondNumber} = ${result}`);
                } catch (error) {
                    console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }

                rl.close();
            });
        });
    });
}


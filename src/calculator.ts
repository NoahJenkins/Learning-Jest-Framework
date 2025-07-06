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
    console.log('Type "exit" or "quit" at any time to close the calculator\n');

    const runCalculation = () => {
        rl.question('Enter the first number (or "exit"/"quit" to close): ', (firstInput) => {
            if (firstInput.toLowerCase() === 'exit' || firstInput.toLowerCase() === 'quit') {
                console.log('Thank you for using the calculator! Goodbye!');
                rl.close();
                return;
            }

            const firstNumber = parseFloat(firstInput);
            
            if (isNaN(firstNumber)) {
                console.log('Invalid number. Please try again.\n');
                runCalculation();
                return;
            }

            rl.question('Enter the operation (+, -, *, /): ', (operation) => {
                if (operation.toLowerCase() === 'exit' || operation.toLowerCase() === 'quit') {
                    console.log('Thank you for using the calculator! Goodbye!');
                    rl.close();
                    return;
                }

                if (!['+', '-', '*', '/'].includes(operation)) {
                    console.log('Invalid operation. Please use +, -, *, or /\n');
                    runCalculation();
                    return;
                }

                rl.question('Enter the second number: ', (secondInput) => {
                    if (secondInput.toLowerCase() === 'exit' || secondInput.toLowerCase() === 'quit') {
                        console.log('Thank you for using the calculator! Goodbye!');
                        rl.close();
                        return;
                    }

                    const secondNumber = parseFloat(secondInput);
                    
                    if (isNaN(secondNumber)) {
                        console.log('Invalid number. Please try again.\n');
                        runCalculation();
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

                        console.log(`Result: ${firstNumber} ${operation} ${secondNumber} = ${result}\n`);
                    } catch (error) {
                        console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
                    }

                    // Ask if user wants to continue
                    rl.question('Would you like to perform another calculation? (y/n): ', (continueChoice) => {
                        if (continueChoice.toLowerCase() === 'y' || continueChoice.toLowerCase() === 'yes') {
                            console.log(''); // Add blank line for readability
                            runCalculation();
                        } else {
                            console.log('Thank you for using the calculator! Goodbye!');
                            rl.close();
                        }
                    });
                });
            });
        });
    };

    // Start the calculation loop
    runCalculation();
}


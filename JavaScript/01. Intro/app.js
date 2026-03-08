function calculate(operator) {
    // Get the values from input fields
    let num1 = document.getElementById("num1").value;
    let num2 = document.getElementById("num2").value;
    
    // Convert to numbers
    num1 = Number(num1);
    num2 = Number(num2);
    
    let result;
    
    // Perform calculation based on operator
    if (operator == '+') {
        result = num1 + num2;
    } else if (operator == '-') {
        result = num1 - num2;
    } else if (operator == '*') {
        result = num1 * num2;
    } else if (operator == '/') {
        if (num2 === 0) {
            document.getElementById("result").innerHTML = "Error: Division by zero";
            return;
        }
        result = num1 / num2;
    }
    
    // Display the result
    document.getElementById("result").innerHTML = "Result: " + result;
}
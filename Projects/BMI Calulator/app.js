const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const button = document.querySelector('button');
const result = document.getElementById('result');

const weightSelect = document.getElementById('weight-unit');
const heightSelect = document.getElementById('height-unit');
const weightLabel = document.getElementById('weight-unit-label');
const heightLabel = document.getElementById('height-unit-label');
const heightGroup = document.getElementById('height-single-group');
const heightFtGroup = document.getElementById('height-ft-group');
const heightFtInput = document.getElementById('height-ft');
const heightInInput = document.getElementById('height-in');

weightSelect.addEventListener('change', function() {
    weightLabel.textContent = this.value;
});

heightSelect.addEventListener('change', function() {
    const unit = this.value;
    const labels = { cm: 'cm', m: 'm', ft: 'ft', in: 'in' };
    heightLabel.textContent = labels[unit] || unit;

    if (unit === 'ft') {
        heightGroup.style.display = 'none';
        heightFtGroup.style.display = 'flex';
        heightInput.removeAttribute('required');
    } else {
        heightGroup.style.display = 'flex';
        heightFtGroup.style.display = 'none';
        heightInput.setAttribute('required', '');
    }
});

function getWeightInKg() {
    const w = parseFloat(weightInput.value);
    if (weightSelect.value === 'lbs') {
        return w * 0.453592;
    }
    return w;
}

function getHeightInMeters() {
    const unit = heightSelect.value;
    if (unit === 'cm') {
        return parseFloat(heightInput.value) / 100;
    } else if (unit === 'm') {
        return parseFloat(heightInput.value);
    } else if (unit === 'in') {
        return parseFloat(heightInput.value) * 0.0254;
    } else if (unit === 'ft') {
        const ft = parseFloat(heightFtInput.value) || 0;
        const inches = parseFloat(heightInInput.value) || 0;
        return (ft * 12 + inches) * 0.0254;
    }
    return NaN;
}

button.addEventListener('click', function() {
    // const height = parseFloat(heightInput.value); // Convert height input (string) to a floating-point number
    // const weight = parseFloat(weightInput.value); // Convert weight input (string) to a floating-point number

    // if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    //     result.textContent = "Please enter valid positive numbers for both height and weight.";
    //     result.className = "show";
    //     return;
    // }

    // const heightInMeters = height / 100;
    // const bmi = weight / (heightInMeters * heightInMeters);

    const weightKg = getWeightInKg();
    const heightM = getHeightInMeters();

    if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
        result.textContent = "Please enter valid positive numbers for both height and weight.";
        result.className = "show bmi-error";
        return;
    }

    const bmi = weightKg / (heightM * heightM);

    let category = "";
    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi < 25) {
        category = "Normal";
    } else if (bmi < 30) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    const categoryClasses = {
        'Underweight': 'bmi-underweight',
        'Normal':      'bmi-normal',
        'Overweight':  'bmi-overweight',
        'Obese':       'bmi-obese',
    };

    result.textContent = `Your BMI is ${bmi.toFixed(2)} (${category})`; // Two decimal places for BMI value

    // result.className = "show";
    result.className = `show ${categoryClasses[category]}`;
});

let bmiForm = document.getElementById('bmi-form');
bmiForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
});

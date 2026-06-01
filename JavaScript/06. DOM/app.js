// querySelector() method is used to select the first element that matches a specified CSS selector(s) in the document. 
document.querySelector('h1').innerText = 'DOM- Document Object Model';

// document.querySelector('#container-1').style.backgroundColor = 'lightblue';
const container = document.querySelector('#container-1');
container.style.border = '2px solid black';
container.style.padding = '10px';
container.style.backgroundColor = 'lightblue';

const anotherContainer = document.querySelector('.container-2');
anotherContainer.style.border = '2px solid green';
anotherContainer.style.padding = '10px';
anotherContainer.style.backgroundColor = 'lightyellow';

// getElementById() method is used to select an element by its unique ID. 
document.getElementById('container-1').style.fontSize = '24px';

// getElementsByClassName() method is used to select all elements that have a specified class name. 
const elements = document.getElementsByClassName('container-2');
for (let i = 0; i < elements.length; i++) {
    elements[i].style.fontSize = '24px';
}

const learnBtn = document.getElementById('learnBtn');
document.body.appendChild(learnBtn);
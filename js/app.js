//Constructors
function Insurance(b,y,t){
    this.brand = b;
    this.year = y;
    this.type = t;
}
Insurance.prototype.quoteInsurance = function() {
    let amount;
    let base = 2000;
    /*
        BRANDS
        1= American 1.15
        2= Asiatic 1.05
        3= European 1.35
    */
    switch(this.brand){
        case '1': 
                amount = base * 1.15;
                break;
        case '2': 
                amount = base * 1.05;
                break;
        case '3': 
                amount = base * 1.35;
                break;
        default:break;
    }
    /*
        YEARS
        +1 year --> -3%
    */
    const difference = new Date().getFullYear() - this.year;
    amount -= ((difference*3) * amount) / 100;
    /*
        TYPE
        Basic ---> +30%
        Full ---> +50%
    */
    if(this.type === 'basic'){
        amount *= 1.30;
    } else {
        amount *= 1.50;
    }
    return amount;
}

function UI(){}

//Year Select
UI.prototype.fillYearSelect = () => {
    const maxDate = new Date().getFullYear();
    const minDate = maxDate - 20;
    const yearSelect = document.querySelector('#year');

    for(let i = maxDate; i>minDate; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}
//Show Alerts
UI.prototype.showMsg = (m,t) => {
    const spinner = document.querySelector('#loading');
    const div = document.createElement('div');
    div.classList.add('message','mt-10');
    div.textContent = m;
    if (t === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correct');
        spinner.style.display = 'block';
    }
    //creating HTML
    const form = document.querySelector('#quote-insurance');
    form.insertBefore(div,document.querySelector('#result'));
    setTimeout(()=>{
        div.remove();
        spinner.style.display = 'none';
    },3000)
}

UI.prototype.showResults = (i,t) => {
    const {brand,year,type} = i;
    let brandText;
    switch(brand) {
        case '1': brandText = 'American';
        break;
        case '2': brandText = 'Asiatic';
        break;
        case '3': brandText = 'Eruopean';
        break;
        default: break;
    }
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Final quote</p>
        <p class="font-bold">Total: <span class="font-normal">${brandText} </span> </p>
        <p class="font-bold">Total: <span class="font-normal">${year} </span> </p>
        <p class="font-bold">Total: <span class="font-normal capitalize">${type} </span> </p>
        <p class="font-bold">Total: <span class="font-normal">$${t} </span> </p>
    `;
    const divResult = document.querySelector('#result');
    setTimeout( () => {
        divResult.appendChild(div);
    },3000)
}
//instance ui
const ui = new UI();

document.addEventListener('DOMContentLoaded',()=>{
    ui.fillYearSelect();
})

eventListeners();
function eventListeners(){
    const form = document.querySelector('#quote-insurance');
    form.addEventListener('submit',quoteInsurance);
}

function quoteInsurance(e){
    e.preventDefault();

    //read brand select
    const brand = document.querySelector('#brand').value;
    //read year select
    const year = document.querySelector('#year').value;
    //read type select
    const type = document.querySelector('input[name="type"]:checked').value;
    //validation
    if(brand === '' || year === '' || type === ''){
        ui.showMsg('All fields are required','error');
    } else {
        ui.showMsg('loading...','correct')
    }
    //Hiding previous quotes
    const results = document.querySelector('#result div');
    if(results != null) {
        results.remove();
    }
    //instance insurance
    const insurance = new Insurance(brand,year,type)
    const total = insurance.quoteInsurance();

    ui.showResults(insurance,total);
}
const btnSalvar = document.querySelector("#salvar");
const btnShowModal = document.querySelector('#showModal');
const containerModal = document.querySelector('.container__modal');
const btnReset = document.querySelector('#reset');
const form = document.querySelector('.formValidator');
const btnClose = document.querySelector("#close");
let countDown = '';

let formValidator = {
    handleSubmit: (event) => {
        event.preventDefault();
        let send = true;
        let formInputs = form.querySelectorAll('input');
        formValidator.clearErrors();
        for (let i = 0; i < formInputs.length; i++) {
            let input = formInputs[i];
            let check = formValidator.checkInput(input);
            if (check != true) {
                // EXISTE REGRA 
                send = false;
                formValidator.showError(input, check);
            }
        }
        // ENVIA O FORMULARIO APOS PASSAR NA VALIDAÇÃO, APENAS QUANDO SEND=TRUE
        if (send) {
            const descricaoTitulo = document.querySelector('#titulo').value;
            const descricaoParagrafo = document.querySelector('#descricaoParagrafo').value
            const date = document.querySelector('#date').value;
            const image = document.querySelector('#imagem').value;
            countDown = setInterval(calculateConvertDate, 1000, date);
            btnReset.style.display = 'block';
            btnShowModal.style.display = 'none'
            setDescription({ descricaoTitulo, image, descricaoParagrafo });
        }
    },
    checkInput: (valueImput) => {
        let rules = valueImput.getAttribute('data-rules');


        if (rules != null) {
            // CASO OS INPUTS TENHA DATA-RULES APLICO A REGRA PARA O DETERMINADO INPUT
            let data = new Date();
            data = data.toISOString().slice(0, 10);
            rules = rules.split('|');
            for (let rule in rules) {
                let datailsRule = rules[rule].split('=');
                console.log(datailsRule)
                switch (datailsRule[0]) {
                    case 'required':
                        if (valueImput.value == '') {
                            return `Campo ${valueImput.getAttribute('name')} não pode ser vazio`;
                        }
                        break;
                    case 'min':
                        if (valueImput.value.length < datailsRule[1]) {
                            return `Campo ${valueImput.getAttribute('name')} precisa ter no minimo ${datailsRule[1]} caracter!`;
                        }
                        break;
                    case 'data':
                        if (valueImput.value < data) {
                            return "Data Não pode ser menor que a Data atual!"
                        }
                        break

                    default:
                        break;
                }
            }
        }
        return true;
    },
    showError: (valueInput, valueError) => {
        valueInput.style.borderColor = '#FF0000';
        let erroElement = document.createElement('span');
        erroElement.classList.add('error');
        erroElement.innerHTML = valueError;
        valueInput.parentElement.insertBefore(erroElement, valueInput.nextSibling);

    },
    clearErrors: () => {
        let errorsElements = document.querySelectorAll('.error');
        let inputs = form.querySelectorAll('input');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style = '';
        }

        for (let i = 0; i < errorsElements.length; i++) {
            errorsElements[i].remove();
        }
    },
    closeModal: (valueClose) => {
        valueClose ? containerModal.classList.add('show') : containerModal.classList.remove('show')
    }
}
if (countDown == '') {
    btnReset.style.display = 'none';
}

btnShowModal.addEventListener('click', (e) => {
    formValidator.closeModal(true);
});

btnClose.addEventListener('click', (e) => {
    formValidator.closeModal(false);
});

btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(countDown);
    formValidator.closeModal(true);
});

function setDescription(valueDescription) {
    document.querySelector('#countDown__descricao').innerHTML = `${valueDescription.descricaoParagrafo}`
    document.querySelector('#title').innerHTML = `${valueDescription.descricaoTitulo}`
    if (valueDescription.image.trim() != '') {
        document.querySelector('#logo-produto').src = `${valueDescription.image}`;
    }
}

function setAddTime(dataValue) {

    return `    
            <span>
                <p>Dias</p>
                <h3 id="days">${addZero(dataValue.days)}</h3>
            </span>
             <span>
                <p>Horas</p>
                <h3 id="hours">${addZero(dataValue.hours)}</h3>
            </span>
             <span>
                <p>Minutos</p>
                <h3 id="minute">${addZero(dataValue.minutes)}</h3>
            </span>
                <span>
                <p>Segundos</p>
                <h3 id="seconds">${addZero(dataValue.seconds)}</h3>
            </span>           
    `
}

function addZero(valueNumber) {
    return valueNumber < 10 ? '0' + valueNumber : valueNumber;
}

function calculateConvertDate(valueDate) {

    let now = new Date().getTime();
    let countDownDate = new Date(valueDate).getTime();
    let diference = Math.abs(now - countDownDate);
    let days = Math.floor(diference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diference % (1000 * 60)) / 1000);
    document.querySelector('.time').innerHTML = setAddTime({ days, hours, minutes, seconds });
    formValidator.closeModal(false);

}

form.addEventListener('submit', formValidator.handleSubmit);
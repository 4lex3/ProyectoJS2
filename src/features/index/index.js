import { CommunityService } from "../../core/services/api/community.service.js";
import { PopulationService } from "../../core/services/api/population.service.js";
import { ProvincesService } from "../../core/services/api/province.service.js";
import { CookiesService } from "../../core/services/cookies/cookies.service.js";
import { FormService } from "../../core/services/ui/Form.service.js";
import { VoiceService } from "../../core/services/voice/voice.service.js";



document.addEventListener("DOMContentLoaded", () => {

    const communityService = new CommunityService();
    const populationService = new PopulationService();
    const provinceService = new ProvincesService();

    const voiceService = new VoiceService()
    const formService = new FormService(voiceService);

    const indexPage = new IndexComponent(communityService, populationService, provinceService, formService);
    indexPage.loadOptions();

    const box = document.getElementById('expanding-box');

    box.addEventListener('click', () => {
        box.classList.toggle('expanded');
    });

    //* - Validar la creacion de formularios 
    //*- Manejar eventos de cambio de formulario

    // TODO - Implementar documentacion
    // TODO - Setear Cookie token
    //* TODO - Setear local storage 
    //* TODO - Redireccionar a la siguiente pagina

    // voiceService.getAllVoices()
    //     .then((voices) => {
    //         console.log(voiceService.filterSpanishVoices());
    //     });


});

class IndexComponent {

    //? Services:
    communityService;
    populationService;
    provinceService;
    formService;
    cookiesService;

    //? DOMProperties:
    form; 
    communityInput;
    provinceInput;
    populationInput;
    imageContainer;



    constructor(communityService, populationService, provinceService, formService) {
        this.communityService = communityService;
        this.populationService = populationService;
        this.provinceService = provinceService;
        this.form = document.forms[0];
        this.communityInput = document.getElementById("ccaa");
        this.provinceInput = document.getElementById("provincia");
        this.populationInput = document.getElementById("poblacion");
        this.imageContainer = document.getElementById("image-container");
        this.formService = formService;
        this.cookiesService = new CookiesService();
        this.cookiesService.setCookie('textAI', 'AIzaSyCA2MWb5J0y3ekMxNLJ--kaECd_ECSQf-Q')
    }

    async loadOptions() {

        const communities = await this.communityService.getAllCommunities();
        this.setOptionsList(this.communityInput, communities);

        const provinces = await this.provinceService.getAllProvinces();
        this.communityInput.addEventListener("change", this.communityInputHandler.bind(this));

        const populations = await this.populationService.getAllPopulations();

        this.form.addEventListener("submit", this.handlePopulationForm.bind(this));

    }

    setOptionsList(selectInput, jsonResponse){

        selectInput.innerHTML = "";
        let newOptions = [];

        for (let key in jsonResponse) {

            let newOption = document.createElement("option");
            newOption.value = jsonResponse[key].label;
            newOption.textContent = jsonResponse[key].label;
            newOption.id = jsonResponse[key].code;
            newOptions.push(newOption);

        }

        selectInput.append(...newOptions);
    }

    communityInputHandler(e){

        const options = e.target.options;
        const selectedOption = options[e.target.selectedIndex].id;

        const provinces  = this.provinceService.getProvincesByCommunityCode(selectedOption);

        this.setOptionsList(this.provinceInput, provinces); 


        const provinceCodeSelected= this.provinceInput.options[this.provinceInput.selectedIndex].id;
        const populationOptions = this.populationService.getPopulationsByProvinceCode(provinceCodeSelected);

        this.setOptionsList(this.populationInput, populationOptions); 
    }

    async handlePopulationForm(e){

        e.preventDefault();

        if(!this.populationInput.value){
            this.appendWarningElement("No se ha seleccionado poblacion!");
            return;
        }

        if(document.getElementById("warningElement")) document.getElementById("warningElement").remove()

        if(document.getElementById("preferenceForm")) {
            this.appendWarningElement("Ya existe un formulario activo");
            return
        } 

        const preferenceFormStates = await this.formService.getFormState();
        this.handleVoiceForm(preferenceFormStates)
    }



    handleVoiceForm(formStates){

        const preferenceContainer = document.getElementById("preferencesContainer");
        const voiceForm = this.createPreferenceForm(formStates[0].question, formStates[0].options); 

        voiceForm.addEventListener("change", () => this.onChangePreferenceForm(formStates));
        voiceForm.addEventListener("dblclick", () => this.handleNextForm(formStates[1], voiceForm))

        preferenceContainer.append(voiceForm);
        setTimeout(() => voiceForm.classList.add('preferenceVisible'), 100);
    }

    handleNextForm(speedState, voiceForm){

        voiceForm.remove();

        const preferenceContainer = document.getElementById("preferencesContainer");
        const speedForm = this.createPreferenceForm(speedState.question, speedState.options);

        speedForm.addEventListener("change", () => {

            const selectedOption = speedForm.querySelector('input[name="voice"]:checked');
            localStorage.setItem('Speed', selectedOption.id);
            window.location.replace('./src/pages/interactive.html');
        });

        preferenceContainer.append(speedForm)
        setTimeout(() => speedForm.classList.add('preferenceVisible'), 100);
    }


    onChangePreferenceForm(preferenceState){

        const allULs = preferenceForm.querySelectorAll('ul');
        allULs.forEach(ul => ul.classList.remove('active'));

        const selectedOption = preferenceForm.querySelector('input[name="voice"]:checked');
        const selectedOptionUL= selectedOption.nextElementSibling.children[0];
        selectedOptionUL.classList.toggle('active');

        const stateSelected = preferenceState[0].options.find(state => state.name === selectedOption.id);
        localStorage.setItem('Voice', stateSelected.name);

        stateSelected.talkExample();
    }

    createPreferenceForm(question, options) {

        const form = document.createElement('form');
        form.id = 'preferenceForm';
        form.classList.add('preferenceForm');

        const title = document.createElement('h3');
        title.textContent = question;
        form.append(title);

        const optionContainer = document.createElement('div');
        optionContainer.className = 'option-container';

        options.forEach(option => {

            const input = document.createElement('input');

            input.type = 'radio';
            input.id = option.name;
            input.name = 'voice';
            input.value = option;

            const label = document.createElement('label');
            label.htmlFor = option.name;
            label.innerHTML = option.htmlElement;

            optionContainer.append(input);
            optionContainer.append(label);
        });

        form.append(optionContainer);
        return form;
    }


    appendWarningElement(message){

        const warningElement= document.createElement("p");
        warningElement.innerHTML = message;
        warningElement.id = "warningElement"

        if(!document.getElementById("warningElement")) this.form.append(warningElement);
    }

}
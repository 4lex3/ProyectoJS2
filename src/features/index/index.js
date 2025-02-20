import { CommunityService } from "../../core/services/api/community.service.js";
import { PopulationService } from "../../core/services/api/population.service.js";
import { ProvincesService } from "../../core/services/api/province.service.js";
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
    }

    async loadOptions() {

        const communities = await this.communityService.getAllCommunities();
        this.setOptionsList(this.communityInput, communities);

        const provinces = await this.provinceService.getAllProvinces();
        this.communityInput.addEventListener("change", this.communityInputHandler.bind(this));

        const populations = await this.populationService.getAllPopulations();

        this.form.addEventListener("submit", this.handleSubmit.bind(this));

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

    async handleSubmit(e){

        e.preventDefault();

        if(!this.populationInput.value){
            this.appendWarningElement("No se ha seleccionado poblacion!");
            return;
        }

        if(document.getElementById("warningElement")) document.getElementById("warningElement").remove()

        const preferenceFormStates = await this.formService.getFormState();

        this.handleNextForm(preferenceFormStates)

    }



    handleNextForm(formStates){

        // const preferenceForm = document.getElementById("preferenceForm");
        // preferenceForm.classList.add('preferenceVisible');

        const preferenceContainer = document.getElementById("preferencesContainer");
        const preferenceForm = this.createPreferenceForm(formStates[0].question, formStates[0].options); 

        preferenceForm.addEventListener("change", () => this.handlePreferenceFormEvent(formStates));
        preferenceContainer.append(preferenceForm);
        setTimeout(() => preferenceForm.classList.add('preferenceVisible'), 100);

    }


    handlePreferenceFormEvent(formStates){
        const allULs = preferenceForm.querySelectorAll('ul');
        allULs.forEach(ul => ul.classList.remove('active'));

        const selectedOption = preferenceForm.querySelector('input[name="voice"]:checked');
        const selectedOptionUL= selectedOption.nextElementSibling.children[0];
        selectedOptionUL.classList.toggle('active');

        const selectedOptionValue = formStates[0].options.find(state => state.name === selectedOption.id);
        selectedOptionValue.talkExample();
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
            label.innerHTML = option.voiceHTML;

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
import { CommunityService } from "../../core/services/api/community.service.js";
import { ImageService } from "../../core/services/api/images.service.js";
import { PopulationService } from "../../core/services/api/population.service.js";
import { ProvincesService } from "../../core/services/api/province.service.js";
import { VoiceService } from "../../core/services/voice/voice.service.js";



document.addEventListener("DOMContentLoaded", () => {

    const communityService = new CommunityService();
    const populationService = new PopulationService();
    const provinceService = new ProvincesService();
    const imageService = new ImageService();

    const indexPage = new IndexComponent(communityService, populationService, provinceService, imageService);
    indexPage.loadOptions();



    const voiceService = new VoiceService();
    voiceService.getAllVoices().then((voices) => {

        // console.log(voices);
        voiceService.talk(voices[0], "kristiano ronaldo junior")

        
        console.log(voiceService.filterSpanishVoices());
    });




});

class IndexComponent {

    //? Services:
    communityService;
    populationService;
    provinceService;
    imageService;

    //? DOMProperties:
    form; 
    communityInput;
    provinceInput;
    populationInput;
    imageContainer;



    constructor(communityService, populationService, provinceService, imageService) {
        this.communityService = communityService;
        this.populationService = populationService;
        this.provinceService = provinceService;
        this.form = document.forms[0];
        this.communityInput = document.getElementById("ccaa");
        this.provinceInput = document.getElementById("provincia");
        this.populationInput = document.getElementById("poblacion");
        this.imageContainer = document.getElementById("image-container");
        this.imageService = imageService;
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

        document.getElementById("warningElement").remove();
    
        // this.imageContainer.innerHTML = "";
        // const population = this.populationInput.value;
        // const images = await this.imageService.getImagesByPopulation(population);

        // this.createImages(images);

        console.log("Redirigir")

    }

    appendWarningElement(message){

        const warningElement= document.createElement("p");
        warningElement.innerHTML = message;
        warningElement.id = "warningElement"

        if(!document.getElementById("warningElement")) this.form.append(warningElement);
    }

    // createImages(images){

    //     if (!("query" in images)){
    //         this.appendWarningElement("No se encontraron imagenes");
    //         return;
    //     }

    //     const imagesObjects = images.query.pages;

    //     for (const item in imagesObjects) {
    //         if (imagesObjects[item]?.imageinfo) {
    //             const url = imagesObjects[item].imageinfo[0].url;
    //             this.createImage(url);
    //         } 
    //     }
        
    // }

    // createImage(src){
    //     const img = document.createElement("img");
    //     img.src = src;
    //     img.classList.add("image-element");
    //     this.imageContainer.append(img);
    // }

}
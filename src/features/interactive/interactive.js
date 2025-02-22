import { MultimediaAIService } from "../../core/services/ai/multimediaAI.service.js";
import { TextAIService } from "../../core/services/ai/textAi.service.js";
import { CookiesService } from "../../core/services/cookies/cookies.service.js";

document.addEventListener("DOMContentLoaded", () => {

    //? Services:
    const cookiesService = new CookiesService();
    const textAIKey = cookiesService.getCookie('textAIKey')
    const textAI = new TextAIService(textAIKey);


    //? Properties:
    const population = localStorage.getItem('population');
    const voice = localStorage.getItem('Voice');
    const speed = localStorage.getItem('Speed');


    //? Principal Class:
    const interactivePage = new InteractivePage(population, voice, speed, textAI);
    interactivePage.Init();


});


class InteractivePage {

    //? Properties and states:
    population;
    voice;
    speed;
    aiState = {
        past: {
            imgElement: "", 
            description: ""
        },
        present: {
            imgElement: "", 
            description: ""

        },
        future: {
            imgElement: "", 
            description: ""
        }
    };

    //? Services:
    textAiService;

    //? DOM Properties:
    copyButton;
    imageContainer;
    spinner;
    timeForm;



    constructor(population, voice, speed, textAiService) {

        this.population = population;
        this.voice = voice;
        this.speed = speed

        this.textAiService = textAiService;

        this.copyButton = document.getElementById("copy-button");
        this.imageContainer = document.getElementById("aiContainer");
        this.textAiContainer = document.getElementById("textAiContainer");
        this.spinner = document.getElementById("spinner");
        this.timeForm = document.getElementById("time-control");



    }


    async Init(){

        this.copyButton.addEventListener("click", this.CopyHandler.bind(this));

        this.timeForm.addEventListener("change",  this.timeHandler.bind(this));
        this.timeForm.dispatchEvent(new Event("change"));


        
    }

    
    timeHandler(e){

        const selectedOption = this.timeForm.querySelector('input[name="selection"]:checked');


        console.log(selectedOption.value);
        this.insertDescription(selectedOption.value);



    } 



    async insertDescription(time) {
        if (!this.textAiContainer.querySelector('svg')) {
            this.textAiContainer.classList.add("spinner");
            this.textAiContainer.innerHTML = "";
            this.textAiContainer.append(this.spinner);
        }

        // const description = await this.textAiService.createDescription(this.population, time);

        const description = "lorem askdjsaaaaajjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj aksdjalkda sdjaslkdnak jd jasd jakl djaklsjd jasjdj kalsj dakslj dakdjakdjakldjaskldjakjdkasjdja jdlasjkldjasdlakjldjajkldjaj daskj daklsdj akls djasd jaklsjdk lasj daklsdj akl jasd" 

        this.textAiContainer.classList.remove("spinner");
        this.textAiContainer.innerHTML = ""; 

        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("textAI");
        this.textAiContainer.append(descriptionElement);

        const words = description.split(" ");
        words.forEach((word, index) => {
            setTimeout(() => {
                descriptionElement.textContent += word + " ";
            }, index * 50); 
        });
    }

    CopyHandler(e){

        const copyButton = e.target;

        copyButton.classList.add("copy-active");
        setTimeout(() => copyButton.classList.remove('copy-active'), 500);

        if(!this.textAiContainer.querySelector('p')){
            navigator.clipboard.writeText('Text no copiado!');
            return;
        }

        navigator.clipboard.writeText(this.textAiContainer.textContent);

    }

}



    // async insertDescription(time){

    //     if(!this.textAiContainer.querySelector('svg')){
    //         this.textAiContainer.classList.add("spinner");
    //         this.textAiContainer.innerHTML = "";
    //         this.textAiContainer.append(this.spinner);
    //     }

    //     const description = await this.textAiService.createDescription(this.population, time);

    //     const descriptionElement = document.createElement("p");






        // descriptionElement.textContent = description;
        // this.textAiContainer.classList.remove("spinner");

        // this.textAiContainer.innerHTML = "";
        // this.textAiContainer.append(descriptionElement);

    // }























































// import { CommunityService } from "../../core/services/api/community.service.js";
// import { ImageService } from "../../core/services/api/images.service.js";
// import { PopulationService } from "../../core/services/api/population.service.js";
// import { ProvincesService } from "../../core/services/api/province.service.js";
// import { FormService } from "../../core/services/ui/Form.service.js";
// import { VoiceService } from "../../core/services/voice/voice.service.js";



// document.addEventListener("DOMContentLoaded", () => {

//     const communityService = new CommunityService();
//     const populationService = new PopulationService();
//     const provinceService = new ProvincesService();
//     const imageService = new ImageService();

//     const voiceService = new VoiceService()
//     const formService = new FormService(voiceService);

//     const indexPage = new IndexComponent(communityService, populationService, provinceService, formService);
//     indexPage.loadOptions();



//     // const voiceService = new VoiceService();
//     // voiceService.getAllVoices().then((voices) => {

//     //     // console.log(voices);
//     //     voiceService.talk(voices[0], "kristiano ronaldo junior")

        
//     //     console.log(voiceService.filterSpanishVoices());
//     // });




// });

// class IndexComponent {

//     //? Services:
//     communityService;
//     populationService;
//     provinceService;
//     formService;

//     //? DOMProperties:
//     form; 
//     communityInput;
//     provinceInput;
//     populationInput;
//     imageContainer;



//     constructor(communityService, populationService, provinceService, formService) {
//         this.communityService = communityService;
//         this.populationService = populationService;
//         this.provinceService = provinceService;
//         this.form = document.forms[0];
//         this.communityInput = document.getElementById("ccaa");
//         this.provinceInput = document.getElementById("provincia");
//         this.populationInput = document.getElementById("poblacion");
//         this.imageContainer = document.getElementById("image-container");
//         this.formService = formService;
//     }

//     async loadOptions() {

//         const communities = await this.communityService.getAllCommunities();
//         this.setOptionsList(this.communityInput, communities);

//         const provinces = await this.provinceService.getAllProvinces();
//         this.communityInput.addEventListener("change", this.communityInputHandler.bind(this));

//         const populations = await this.populationService.getAllPopulations();

//         this.form.addEventListener("submit", this.handleSubmit.bind(this));

//     }

//     setOptionsList(selectInput, jsonResponse){

//         selectInput.innerHTML = "";
//         let newOptions = [];

//         for (let key in jsonResponse) {

//             let newOption = document.createElement("option");
//             newOption.value = jsonResponse[key].label;
//             newOption.textContent = jsonResponse[key].label;
//             newOption.id = jsonResponse[key].code;
//             newOptions.push(newOption);

//         }

//         selectInput.append(...newOptions);
//     }

//     communityInputHandler(e){

//         const options = e.target.options;
//         const selectedOption = options[e.target.selectedIndex].id;

//         const provinces  = this.provinceService.getProvincesByCommunityCode(selectedOption);

//         this.setOptionsList(this.provinceInput, provinces); 


//         const provinceCodeSelected= this.provinceInput.options[this.provinceInput.selectedIndex].id;
//         const populationOptions = this.populationService.getPopulationsByProvinceCode(provinceCodeSelected);

//         this.setOptionsList(this.populationInput, populationOptions); 
//     }

//     async handleSubmit(e){

//         e.preventDefault();

//         if(!this.populationInput.value){
//             this.appendWarningElement("No se ha seleccionado poblacion!");
//             return;
//         }

//         document.getElementById("warningElement").remove();
    
//         // this.imageContainer.innerHTML = "";
//         // const population = this.populationInput.value;
//         // const images = await this.imageService.getImagesByPopulation(population);

//         // this.createImages(images);

//         console.log("Redirigir")
        


//     }

//     appendWarningElement(message){

//         const warningElement= document.createElement("p");
//         warningElement.innerHTML = message;
//         warningElement.id = "warningElement"

//         if(!document.getElementById("warningElement")) this.form.append(warningElement);
//     }

//     // createImages(images){

//     //     if (!("query" in images)){
//     //         this.appendWarningElement("No se encontraron imagenes");
//     //         return;
//     //     }

//     //     const imagesObjects = images.query.pages;

//     //     for (const item in imagesObjects) {
//     //         if (imagesObjects[item]?.imageinfo) {
//     //             const url = imagesObjects[item].imageinfo[0].url;
//     //             this.createImage(url);
//     //         } 
//     //     }
        
//     // }

//     // createImage(src){
//     //     const img = document.createElement("img");
//     //     img.src = src;
//     //     img.classList.add("image-element");
//     //     this.imageContainer.append(img);
//     // }

// }
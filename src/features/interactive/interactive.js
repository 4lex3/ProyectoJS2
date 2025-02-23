import { MultimediaAIService } from "../../core/services/ai/multimediaAI.service.js";
import { TextAIService } from "../../core/services/ai/textAi.service.js";
import { ImageAPIService } from "../../core/services/api/images.service.js";
import { CookiesService } from "../../core/services/cookies/cookies.service.js";
import { VoiceService } from "../../core/services/voice/voice.service.js";

document.addEventListener("DOMContentLoaded", () => {

    //? Services:
    const cookiesService = new CookiesService();
    const textAIKey = cookiesService.getCookie('textAIKey')
    const textAI = new TextAIService(textAIKey);

    const multimediaAIKey = cookiesService.getCookie("multimediaAIKey");
    const imageAPIService = new ImageAPIService();

    const multimediaAIService = new MultimediaAIService(multimediaAIKey, imageAPIService);
    const voiceService = new VoiceService();


    //? Properties:
    const population = localStorage.getItem('population');
    const voice = localStorage.getItem('Voice');
    const speed = localStorage.getItem('Speed');


    //? Principal Class:
    const interactivePage = new InteractivePage(population, voice, speed, textAI, multimediaAIService, voiceService);
    interactivePage.Init();
    
    const box = document.getElementById('expanding-box');

    box.addEventListener('click', () => {
        box.classList.toggle('expanded');
    });



});


class InteractivePage {

    //? Properties and states:
    population;
    voice;
    speed;

    aiState = {
        past: {
            src: "", 
            description: ""
        },
        present: {
            src: "", 
            description: ""

        },
        future: {
            src: "", 
            description: ""
        }
    };

    //? Services:
    textAiService;
    multimediaAIService;
    voiceService;



    //? DOM Properties:
    copyButton;
    imageContainer;
    spinner;
    timeForm;



    constructor(population, voice, speed, textAiService, multimediaAIService, voiceService) {

        this.population = population;
        this.voice = voice;
        this.speed = speed;

        this.textAiService = textAiService;
        this.multimediaAIService = multimediaAIService;

        this.copyButton = document.getElementById("copy-button");
        this.imageContainer = document.getElementById("aiContainer");
        this.textAiContainer = document.getElementById("textAiContainer");
        this.spinner = document.getElementById("spinner");
        this.timeForm = document.getElementById("time-control");
        this.voiceService = voiceService;
    }


    async Init(){

        this.copyButton.addEventListener("click", this.CopyHandler.bind(this));

        this.timeForm.addEventListener("change",  this.timeHandler.bind(this));
        this.timeForm.dispatchEvent(new Event("change"));

    }

    
    timeHandler(e){

        const selectedOption = this.timeForm.querySelector('input[name="selection"]:checked');

        this.insertElements(selectedOption.value);
        this.insertImage(selectedOption.value);

    } 



    async insertElements(time) {

        if (!this.textAiContainer.querySelector('svg')) {
            console.log("paso");
            this.textAiContainer.classList.add("spinner");
            this.textAiContainer.innerHTML = "";
            this.textAiContainer.append(this.spinner);
        }

        const description = this.aiState[time].description === "" ? await this.textAiService.createDescription(this.population, time) : this.aiState[time].description;

        this.aiState[time].description = description;

        this.textAiContainer.classList.remove("spinner");
        this.textAiContainer.innerHTML = ""; 

        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("textAI");
        this.textAiContainer.append(descriptionElement);

        //? Voice section 
        const voices = await this.voiceService.getAllVoices();
        const [ selectedVoice ] = voices.filter(voice => voice.name === this.voice);

        const selectedSpeed = this.voiceService.speeds[this.speed];
        this.voiceService.talk(selectedVoice, description, selectedSpeed);


        //? Text append section 
        const words = description.split(" ");
        words.forEach((word, index) => {
            setTimeout(() => {
                descriptionElement.textContent += word + " ";
            }, index * 50); 
        });


    }

    async insertImage(time){

        const imageLoader = this.spinner.cloneNode(true);
        imageLoader.classList.add("loader_image");

        if(!this.imageContainer.querySelector("svg")){
            this.imageContainer.prepend(imageLoader);
        }

        if(this.imageContainer.querySelector('img')){
            this.imageContainer.querySelector('img').remove()
        } 

        const description = this.aiState[time].description;

        const img = document.createElement("img");
        img.classList.add("aiImage");

        const src = this.aiState[time].src === "" ? await this.multimediaAIService.createPopulationImage(time, this.population, description) : this.aiState[time].src;

        this.aiState[time].src = src;
        img.src = src;

        imageLoader.remove();
        this.imageContainer.prepend(img);
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

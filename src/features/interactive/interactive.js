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

        this.imageLoader = this.spinner.cloneNode(true);
        this.imageLoader.classList.add("loader_image");
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
            this.textAiContainer.classList.add("spinner");
            this.textAiContainer.innerHTML = "";
            this.textAiContainer.append(this.spinner);
        }


        if(this.imageContainer.children.length === 1){
            this.imageContainer.prepend(this.imageLoader);
        }

        // const description = this.aiState[time].description === "" ? await this.textAiService.createDescription(this.population, time) : this.aiState[time].description;
        const description = "Allande en la época contemporánea (digamos, desde mediados del siglo XX hasta la actualidad) se caracteriza por una lucha constante entre la preservación de su rica identidad rural y la adaptación a las presiones de la globalización y la despoblación que afecta a la España rural. Su historia reciente está marcada por la paulatina decadencia de la actividad minera, antaño motor económico fundamental, y la consiguiente búsqueda de nuevas vías de desarrollo, principalmente en el sector turístico y agropecuario. Eventos importantes en este periodo incluyen esfuerzos de conservación del patrimonio arquitectónico, como la rehabilitación de casas tradicionales y la revitalización de núcleos de población. También se han impulsado iniciativas culturales para promover la música tradicional asturiana, las fiestas locales (como las relacionadas con la Virgen del Carmen o San Roque) y la artesanía, manteniendo vivas tradiciones como el cultivo del maíz o la elaboración de productos lácteos. Estas tradiciones, transmitidas de generación en generación, siguen siendo un pilar fundamental de la identidad allandesa, aunque la emigración ha afectado su perpetuación. La singularidad de Allande reside en su paisaje, un territorio montañoso de gran belleza, salpicado de brañas y bosques, que ofrece un atractivo para el turismo rural y de naturaleza. Su ubicación en el occidente asturiano, alejada de los grandes núcleos urbanos, ha contribuido a conservar un entorno natural excepcional, con una biodiversidad notable y una arquitectura tradicional bien preservada en muchos lugares. Esta naturaleza virgen, junto con la tranquilidad y la autenticidad de sus pueblos, son su principal baza para el futuro. Sin embargo, Allande, como otras zonas rurales, enfrenta el reto de la despoblación y la falta de oportunidades laborales para los jóvenes. La dependencia de las ayudas públicas y la necesidad de diversificar la economía son desafíos cruciales para su desarrollo. En resumen, el Allande contemporáneo es una lucha por el equilibrio entre la preservación de un legado cultural y natural excepcional y la adaptación a las realidades del siglo XXI, una lucha que define su carácter y su futuro."

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

    async insertImage(time) {

    
        //? IMG
        const description = this.aiState[time].description;

        if(document.getElementById('aiImage')){
            console.log("Borrando imagen");
            document.getElementById('aiImage').remove();
        }
        
              
        const img = document.createElement("img");
        img.classList.add("aiImage");
        const src = this.aiState[time].src === "" ? await this.multimediaAIService.createPopulationImage(time, this.population, description) : this.aiState[time].src;
        this.aiState[time].src = src;
        img.id = 'aiImage';
        img.src = src;

        this.imageLoader.remove();
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

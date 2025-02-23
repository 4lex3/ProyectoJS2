export class MultimediaAIService {

    imageAPIService;
    apiKey;
    baseURL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";


    constructor(apiKey, imageAPIService) {
        this.apiKey = apiKey;
        this.imageAPIService = imageAPIService;
    }

    async createPopulationImage(time, population, description){
        
        if(time === 'present'){

            try {

                const imageURL = await this.imageAPIService.getImagesByPopulation(population);
                return imageURL;


            } catch (error) {
                console.log("La API de wikipedia no encontro imagenes, generando...");                
            }

        }

        console.log(`Generando imagen de ${population} en el ${time}`);
        const prompt = this.createPrompt(time, population, description);
        const url = await this.generateImage(prompt);

        return url;
        
    }



    async generateImage(prompt){



        const res = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}` 
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if(!res.ok) {
            const errorText = await res.text(); 
            throw new Error(`Error al generar imagen: ${res.status} - ${errorText}`);
        } 

        const buffer = await res.arrayBuffer();
        const base64Image = this.bufferToBase64(buffer);
        const src = `data:image/png;base64,${base64Image}`

        return src;

    }


    bufferToBase64(buffer) {
        const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));  
        return window.btoa(binary);  
    }


    createPrompt(time = 'present', population, description){

        const basicPrompts = {

            'past': `Puedes crear una imagen sobre el lugar ${population} de Espana en la epoca contemporanea con las siguientes caracteristicas ${description}`,

            'present': `Puedes crear una imagen de  el lugar ${population} de Espana en la actualidad con las siguientes caracteristicas ${description} `,

            'future': `Puedes crear una imagen en un supuesto futuro sobre el lugar ${population} de Espana. Teniendo en cuenta las siguientes caracteristicas ${description}`
        }

        return basicPrompts[time];
    }





}
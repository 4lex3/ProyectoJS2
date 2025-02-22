export class TextAIService {


    //? Text AI
    textAIKey;
    textAIUrl;


    constructor(textAIKey){

        this.textAIKey = textAIKey;
        this.textAIUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.textAIKey}`

    }

    
    async createDescription(population, time = 'present'){

        const prompt = this.getPrompt(time, population);
        const aiResponse = await this.sendQuestion(prompt);
        return aiResponse;
    }    

    getPrompt(time, population){

        const timesPrompt = {

            past: `Puedes crear una pequeña reseña sobre ${population} en la epoca contemporanea? Habla sobre su historia, eventos importantes, tradiciones culturales y su impacto en la región en ese tiempo. Incluye aspectos únicos de la zona que la hagan especial.`,

            present: `Puedes crear una pequeña reseña sobre ${population} de manera resumida? Habla sobre su historia, eventos importantes, tradiciones culturales y su impacto en la región. Incluye aspectos únicos de la zona que la hagan especial.`,

            future: `Puedes crear una pequeña reseña sobre ${population} en un supuesto futuro? Habla sobre como se podria ver, que aspectos culturales podria evolucionar, su impacto en la region y algo que la hara especial.` 
        };

        return timesPrompt[time];
    }


    parseToText(aiResponse) {

        if (!aiResponse || !aiResponse.parts || aiResponse.parts.length === 0) return null;

        const parts = aiResponse.parts;
        
        if (!Array.isArray(parts)) {
            console.error('Invalid parts format:', parts);
            return null;
        }

        const text = parts.map(part => part.text).join("\n");

        return text;
    }


    async sendQuestion(prompt){

        const body = {
            contents: [
                {
                    parts: [
                        { text:  prompt}
                    ]
                }
            ]
        };


        console.log("Obteniendo respuesta a AI...");

        const res = await fetch(this.textAIUrl, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)

        });

        if(!res.ok) throw new Error("Error during send request");
        
        const data = await res.json();
        const parsedData = this.parseToText(data?.candidates[0].content);

        return parsedData;
    }

}
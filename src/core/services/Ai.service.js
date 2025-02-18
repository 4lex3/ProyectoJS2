export class AIService {


    apiKey = "AIzaSyCA2MWb5J0y3ekMxNLJ--kaECd_ECSQf-Q";
    baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    
    async createDescription(population){

        const basicPrompt = `Puedes crear una pequeña reseña sobre ${population} de manera resumida? Habla sobre su historia, eventos importantes, tradiciones culturales y su impacto en la región. Incluye aspectos únicos de la zona que la hagan especial.`

        const aiResponse = await this.sendQuestion(basicPrompt);
        const  responseText = this.parseToText(aiResponse);

        return responseText;
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

        const res = await fetch(this.baseUrl, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)

        });

        if(!res.ok) throw new Error("Error during send request");
        
        const data = await res.json();

        console.log(data);

        return data?.candidates[0].content;

    }

}
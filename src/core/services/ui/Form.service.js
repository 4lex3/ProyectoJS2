export class FormService {

    voiceService;

    formState = [

        {
            question: "Selecciona tu voz preferida:",
            options: [] //? Voice Objects
        }, 
        {
            question: "Selecciona tu velocidad favorita:",
            options: [

                {
                    name: 'Lento',
                    value: 0.8
                }, 
                {
                    name: 'Normal',
                    value: 1
                }, 
                {
                    name: 'Rapido',
                    value: 1.5
                }
            ]
        }

    ];

    constructor(voiceService) {
        this.voiceService = voiceService;        
    }

    async getFormState(){

        await this.voiceService.getAllVoices();
        this.formState[0].options = this.voiceService.filterSpanishVoices();

        this.parseFormState();        
        return this.formState;

    }

    parseFormState(){

        const voiceHTML = `
            <ul class="wave-menu">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        `

        this.formState[0].options.map( voice => {
            voice.talkExample = () => this.voiceService.talk(voice, "Hola, mucho gusto conocerte");
            voice.voiceHTML = voiceHTML;
        });
    }



    
}
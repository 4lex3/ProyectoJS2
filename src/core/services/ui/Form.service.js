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
                    htmlElement: this.slowSVG,
                    value: 0.8
                }, 
                {
                    name: 'Normal',
                    htmlElement: this.mediumSVG,
                    value: 1
                }, 
                {
                    name: 'Rapido',
                    htmlElement: this.fastSVG,
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

        this.parseVoiceHTML();        
        return this.formState;

    }

    parseVoiceHTML(){

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
            voice.htmlElement = voiceHTML;
        });
    }



    get slowSVG(){
        return `
            </p>Baja Velocidad</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21" />
            </svg>

        `
    }

    get mediumSVG(){
        return `
            </p>Media Velocidad</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>

        `
    }

    get fastSVG(){
        return `
            </p>Velocidad Rapida</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
        `
    }

    
}
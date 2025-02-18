export class VoiceService {

    synth;
    voices = [];

    constructor() {
        this.synth = window.speechSynthesis;
    }

    async getAllVoices() {
        
        if (this.voices.length > 0) {
            return this.voices;  
        }

        return new Promise((resolve, reject) => {
            const checkVoices = () => {
                this.voices = this.synth.getVoices();
                if (this.voices.length > 0) {
                    resolve(this.voices);  

                } else {
                    reject('No voices found');  
                }
            };

            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = checkVoices;
            } else {
                checkVoices();  
            }
        });

    }


    //! The selected voice is a type of voice object.
    talk(selectedVoice, text){

        const realtor = new SpeechSynthesisUtterance(text);

        realtor.voice = selectedVoice;

        //* Params
        realtor.rate = 1;   
        realtor.pitch = 1;  
        realtor.volume = 1; 


        this.synth.speak(realtor);
    }


    filterSpanishVoices(){

        const matches = ['español', 'ESPAÑOL', 'Español', 'Spanish', 'spanish'];

        const spanishVoices = this.voices.filter(voice => 
            matches.some(match => voice.lang.toLowerCase().includes(match) || voice.name.toLowerCase().includes(match))
        );

        
        const sortedVoices = spanishVoices.sort((voiceA, voiceB) => {

            const googleA = voiceA.name.toLowerCase().includes('google');
            const googleB = voiceB.name.toLowerCase().includes('google');

            if (googleA && !googleB) return -1;
            if (!googleA && googleB) return 1;

            return 0;  
        });

        return sortedVoices;
    }

    

}

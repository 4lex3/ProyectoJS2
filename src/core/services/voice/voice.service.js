export class VoiceService {

    synth;
    voices = [];
    speeds = {
        'Lento': 0.8,
        'Normal': 1,
        'Rapido': 1.2
    }


    constructor() {
        this.synth = window.speechSynthesis;
    }

    async getAllVoices() {
        return new Promise((resolve, reject) => {

            const checkVoices = () => {
                this.voices = this.synth.getVoices();
                if (this.voices.length > 0) {
                    resolve(this.voices);
                }
            };

            checkVoices();

            if (this.voices.length === 0) {

                this.synth.onvoiceschanged = checkVoices;

                const interval = setInterval(() => {
                    checkVoices();
                    if (this.voices.length > 0) {
                        clearInterval(interval);
                        resolve(this.voices);
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(interval);
                    if (this.voices.length === 0) {
                        reject('No voices found after waiting');
                    }
                }, 3000);
            }
        });
    }

    //! The selected voice is a type of voice object.
    talk(selectedVoice, text, rate = 1) {
        try {
            if (this.synth.speaking) {
                this.synth.cancel();
            }

            const realtor = new SpeechSynthesisUtterance(text);
            realtor.voice = selectedVoice;

            //* Params
            realtor.rate = rate;
            realtor.pitch = 1;
            realtor.volume = 1;

            // Hablar
            this.synth.speak(realtor);
        } catch (error) {
            console.error("Error en la síntesis de voz:", error);
        }
    }



    filterSpanishVoices() {

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

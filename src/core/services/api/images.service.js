export class ImageService {


    async getImagesByPopulation(population){
        const results = await fetch(this.buildURLGet(population));
        if(!results.ok) throw new Error("Error: " + results.status);
        return results.json();
    }

    buildURLGet(population){

        const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=images&titles=${population}&gimlimit=10&prop=imageinfo&iiprop=url`;
        console.log(url);

        return url;

    }
}
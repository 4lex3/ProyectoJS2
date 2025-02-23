export class ImageAPIService {

    async getImagesByPopulation(population){


        const results = await fetch(this.buildURLGet(population));
        if(!results.ok) throw new Error("Error: " + results.status);

        const jsonResults = await results.json();
        const url = this.getURLOfJsonResponse(jsonResults);

        return url;

    }

    buildURLGet(population){

        const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=images&titles=${population}&gimlimit=10&prop=imageinfo&iiprop=url`;

        return url;

    }

    getURLOfJsonResponse(jsonResponse){

        if (!("query" in jsonResponse)){
            throw new Error("No se encontraron imagenes");
        }

        const imagesObjects = jsonResponse.query.pages;

        for (const item in imagesObjects) {
            if (imagesObjects[item]?.imageinfo) {
                const url = imagesObjects[item].imageinfo[0].url;
                return url;
            } 
        }

        throw new Error("No se encontraron imagenes");
    }
}
export class CommunityService {

    URL = "https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/ccaa.json";

    async getAllCommunities(){

        const results = await fetch(this.URL);
        if(!results.ok) throw new Error(`Error - ${results.status}`);
        return await results.json();

    }

}
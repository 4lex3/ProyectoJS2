export class ProvincesService {

    provinces;
    URL = "https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/provincias.json";


    async getAllProvinces(){

        const results = await fetch(this.URL);
        const provinces = await results.json();
        this.provinces = provinces;

        return provinces;

    }

    getProvincesByCommunityCode(communityCode){
        return this.provinces.filter(province => province.parent_code === communityCode);
    }

}
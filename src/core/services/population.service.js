export class PopulationService{

    populations;
    URL = "https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/poblaciones.json";
    

    async getAllPopulations(){

        const results = await fetch(this.URL);
        const populations = await results.json();
        this.populations = populations;

        return populations;
    } 

    getPopulationsByProvinceCode(provinceCode){
        return this.populations.filter(population => population.parent_code === provinceCode);
    }

}

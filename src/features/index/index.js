import { CommunityService } from "../../core/services/community.service.js";


document.addEventListener("DOMContentLoaded", () => {


    const communityService = new CommunityService;
    const indexPage = new IndexPage(communityService);
    indexPage.loadOptions();

});

class IndexPage {

    communityService;


    constructor(communityService) {
        this.communityService = communityService;
    }

    async loadOptions() {
        const data = await this.communityService.getAllCommunities();
        console.log(data);
    }

    





}
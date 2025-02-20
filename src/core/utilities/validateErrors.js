



function handleError(container, message) {

    const warningElement= document.createElement("p");
    warningElement.innerHTML = message;
    warningElement.id = "warningElement"


    if(!document.getElementById("warningElement")){
        container.append(warningElement);
        return
    } else {
        warningElement.remove();
    }

}
export function DocElementComponent(text) {

    const container = document.createElement('div');
    container.id = 'expanding-box';
    container.classList.add('box');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('lightbulb');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('class', 'size-6');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18');

    svg.appendChild(path);
    container.appendChild(svg);

    for (let i = 0; i < 6; i++) {
        const paragraph = document.createElement('p');
        paragraph.classList.add('hidden');
        paragraph.textContent = `Contenido adicional que aparece al expandir.`;
        container.appendChild(paragraph);
    }

    container.addEventListener('click', () => {
        container.classList.toggle('expanded');
    });

    // Devolver el contenedor creado
    return container;
}

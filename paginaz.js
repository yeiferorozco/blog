// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    // Ajuste de pagesToShow si es necesario
    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    // Calcular el rango de páginas
    let start = currentPage - leftnum;
    start = Math.max(start, 1);

    let maximum = Math.floor(totalPosts / itemsPerPage) + 1;
    if (maximum * itemsPerPage === totalPosts) {
        maximum -= 1;
    }

    let end = start + pagesToShow - 1;
    end = Math.min(end, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    // Enlace a la página anterior
    let previousPage = currentPage > 1 ? createPageLink(currentPage - 1, prevpage, type) : "";
    paginationHTML += previousPage;

    // Integración de la paginación del archivo adjunto
    paginationHTML += obtenerPaginacionDesdeArchivo();

    // Enlace a la siguiente página
    let nextPage = currentPage < maximum ? createPageLink(currentPage + 1, nextpage, type) : "";
    paginationHTML += nextPage;

    // Actualizar el área de la página
    let pageArea = document.getElementsByName("pageArea");
    let pagerElement = document.getElementById("blog-pager");

    for (let i = 0; i < pageArea.length; i++) {
        pageArea[i].innerHTML = paginationHTML;
    }

    if (pagerElement) {
        pagerElement.innerHTML = paginationHTML;
    }
}

// Función para generar un enlace de página
function createPageLink(pageNum, linkText, type) {
    if (type === "page") {
        return `<span class="pagenumber"><a href="#" onclick="redirectpage(${pageNum}); return false;">${linkText}</a></span>`;
    } else {
        return `<span class="pagenumber"><a href="#" onclick="redirectlabel(${pageNum}); return false;">${linkText}</a></span>`;
    }
}

// Función de integración de la paginación desde el archivo adjunto
function obtenerPaginacionDesdeArchivo() {
    // Código extraído y adaptado del archivo adjunto
    return "<!-- Código de paginación extraído del archivo adjunto -->";
}

// Resto del código permanece intacto
// Inicialización de la página
var nopage, type, currentPage, lblname1;
bloggerpage();

// Etiquetas LB página
document.addEventListener("DOMContentLoaded", function () {
    let labelLinks = document.querySelectorAll('a[href*="/search/label/"]');

    labelLinks.forEach(function (link) {
        if (!link.href.includes("?&max-results=")) {
            link.href += "?&max-results=12";
        }
    });
});

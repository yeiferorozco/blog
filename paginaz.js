var currentPage, type, lblname1, searchQuery;

// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    // Ajuste de pagesToShow si es necesario
    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    // Calcular rango de páginas
    let start = currentPage - leftnum;
    start = Math.max(start, 1);

    let maximum = Math.ceil(totalPosts / itemsPerPage);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    // Enlace a la página anterior
    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior", type);
    }

    // Enlace a la página 1
    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type);
    }

    if (start > 2) paginationHTML += "...";

    // Generar páginas intermedias
    for (let r = start; r <= Math.min(start + pagesToShow - 1, maximum); r++) {
        if (r === currentPage) {
            paginationHTML += `<span class="pagenumber current">${r}</span>`;
        } else {
            paginationHTML += createPageLink(r, r, type);
        }
    }

    if (currentPage < maximum) paginationHTML += createPageLink(currentPage + 1, "Siguiente", type);

    // Actualizar HTML
    let pagerElement = document.getElementById("blog-pager");
    if (pagerElement) {
        pagerElement.innerHTML = paginationHTML;
    }
}

// Función para generar enlaces según el tipo
function createPageLink(pageNum, linkText, type) {
    let url = "#";

    if (type === "search") {
        url = `/search?q=${encodeURIComponent(searchQuery)}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    } else if (type === "label") {
        url = `/search/label/${lblname1}?&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    } else {
        url = `#PageNo=${pageNum}`;
    }

    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Función para manejar respuesta del feed
function paginationall(data) {
    let totalPosts = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalPosts);
}

// Función para detectar el contexto de la página
function bloggerpage() {
    let activePage = window.location.href;
    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;

    if (activePage.includes("/search/label/")) {
        type = "label";
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
    } else if (activePage.includes("?q=")) {
        type = "search";
        searchQuery = new URLSearchParams(window.location.search).get("q");
    } else {
        type = "page";
    }

    let scriptUrl = `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&alt=json-in-script&callback=paginationall`;
    if (type === "label") {
        scriptUrl = `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&max-results=${itemsPerPage}&callback=paginationall`;
    } else if (type === "search") {
        scriptUrl = `${home_page}feeds/posts/summary?q=${encodeURIComponent(searchQuery)}&alt=json-in-script&max-results=${itemsPerPage}&callback=paginationall`;
    }

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);


// Etiquetas LB página
document.addEventListener("DOMContentLoaded", function () {
    let labelLinks = document.querySelectorAll('a[href*="/search/label/"]');

    labelLinks.forEach(function (link) {
        if (!link.href.includes("?&max-results=")) {
            link.href += "?&max-results=12";
        }
    });
});

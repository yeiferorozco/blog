// Parámetros globales 
var nopage, type, currentPage, lblname1, searchQuery, lastPostDate;

// Función para obtener el término de búsqueda del usuario
function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Función principal de paginación en búsquedas
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);
    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }
    let start = Math.max(currentPage - leftnum, 1);
    let maximum = Math.ceil(totalPosts / itemsPerPage);
    let end = Math.min(start + pagesToShow - 1, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createSearchPageLink(currentPage - 1, "Anterior");
    }
    if (start > 1) {
        paginationHTML += createSearchPageLink(1, "1");
    }
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage ? `<span class="pagenumber current">${r}</span>` : createSearchPageLink(r, r);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createSearchPageLink(maximum, maximum);
    if (currentPage < maximum) {
        paginationHTML += createSearchPageLink(currentPage + 1, "Siguiente");
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Genera enlaces de paginación con la fecha correcta en búsqueda
function createSearchPageLink(pageNum, linkText) {
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let url = `/search?${searchParam}&updated-max=${lastPostDate}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Procesa los datos de Blogger para búsqueda
function paginationSearch(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    let lastEntry = data.feed.entry && data.feed.entry.length > 0 ? data.feed.entry[0].published.$t : "";
    lastPostDate = encodeURIComponent(lastEntry.replace(".000", "").replace("Z", "-05:00"));
    pagination(totalResults);
}

// Determina el tipo de página y carga información
function bloggerpage() {
    let activePage = window.location.href;
    searchQuery = getSearchQuery();
    
    if (searchQuery) {
        type = "search";
    } else if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else {
        type = "page";
    }
    
    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    
    let scriptUrl = "";
    if (type === "search") {
        scriptUrl = `${home_page}feeds/posts/summary?q=${encodeURIComponent(searchQuery)}&max-results=1&alt=json-in-script&callback=paginationSearch`;
    } else {
        scriptUrl = type === "page" 
            ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
            : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1`;
    }
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);

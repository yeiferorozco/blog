// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery, lastUpdatedMax;

// Función principal de paginación
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
        paginationHTML += createPageLink(currentPage - 1, "Anterior", type);
    }
    
    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type);
    }
    
    if (start > 2) paginationHTML += "...";
    
    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage ? `<span class="pagenumber current">${r}</span>` : createPageLink(r, r, type);
    }
    
    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);
    
    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente", type);
    }
    
    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Genera enlaces de paginación con fecha actualizada
function createPageLink(pageNum, linkText, type) {
    let updatedMax = getUpdatedMax(pageNum);
    let url;
    
    if (type === "page") {
        url = `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    } else {
        url = `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    }
    
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Obtiene la fecha del último post en formato correcto y resta 10 minutos para la siguiente página
function getUpdatedMax(pageNum) {
    let date = new Date(lastUpdatedMax);
    date.setMinutes(date.getMinutes() - (pageNum - 1) * 10);
    return encodeURIComponent(date.toISOString().replace(".000", "").replace("Z", "-05:00"));
}

// Procesa los datos de Blogger y guarda la fecha del último post
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    lastUpdatedMax = data.feed.entry[0].published.$t; // Última fecha de post en la página
    pagination(totalResults);
}

// Determina el tipo de página y carga información
function bloggerpage() {
    let activePage = window.location.href;
    
    if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else if (activePage.includes("/search?q=")) {
        let match = activePage.match(/q=([^&]+)/);
        searchQuery = match ? decodeURIComponent(match[1]) : "";
        type = "page";
    } else {
        type = "page";
        searchQuery = "";
    }
    
    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    let scriptUrl = type === "page" 
        ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1`;
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);

// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery, lastPostDate = "";

// Función principal de paginación
function pagination(totalPosts, lastPostDateParam) {
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
        paginationHTML += createPageLink(currentPage - 1, "Anterior", type, lastPostDateParam);
    }
    
    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type, lastPostDateParam);
    }
    
    if (start > 2) paginationHTML += "...";
    
    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage ? `<span class="pagenumber current">${r}</span>` : createPageLink(r, r, type, lastPostDateParam);
    }
    
    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type, lastPostDateParam);
    
    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente", type, lastPostDateParam);
    }
    
    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Genera enlaces de paginación con fecha actualizada
function createPageLink(pageNum, linkText, type, lastPostDateParam) {
    let updatedMax = lastPostDateParam || getUpdatedMax();
    let url;
    
    if (type === "page") {
        url = `/search?q=${encodeURIComponent(searchQuery)}&updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    } else {
        url = `/search/label/${lblname1}?updated-max=${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    }
    
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Obtiene la fecha del último post en formato correcto
function getUpdatedMax() {
    if (lastPostDate) {
        return encodeURIComponent(lastPostDate);
    }
    let date = new Date();
    return encodeURIComponent(date.toISOString().replace(".000", "").replace("Z", "-05:00"));
}

// Procesa los datos de Blogger y obtiene la fecha del último post
function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    
    // Obtener la fecha del último post en la página actual
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].published.$t;
    }
    
    pagination(totalResults, lastPostDate);
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
        ? `${home_page}feeds/posts/summary?max-results=${itemsPerPage}&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=${itemsPerPage}`;
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

// Inicialización
document.addEventListener("DOMContentLoaded", bloggerpage);

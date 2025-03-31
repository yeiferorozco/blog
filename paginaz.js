// Parámetros globales
var currentPage, searchQuery, lblname1, type, lastPostDate = "";

// Función para obtener el término de búsqueda del usuario
function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Función para construir enlaces de paginación con la fecha del último post
function createPageLink(pageNum, linkText) {
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let updatedMax = lastPostDate ? `&updated-max=${encodeURIComponent(lastPostDate)}` : "";
    let url = `/search?${searchParam}${updatedMax}&max-results=${itemsPerPage}#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

// Función para generar la paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let maxPages = Math.ceil(totalPosts / itemsPerPage);
    
    paginationHTML += `<span class='totalpages'>Página ${currentPage} de ${maxPages}</span>`;
    
    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior");
    }
    
    for (let i = 1; i <= maxPages; i++) {
        paginationHTML += i === currentPage ? `<span class="pagenumber current">${i}</span>` : createPageLink(i, i);
    }
    
    if (currentPage < maxPages) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente");
    }
    
    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

// Función para obtener la fecha del último post
function fetchLastPostDate(data) {
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = new Date(data.feed.entry[0].updated.$t).toISOString().replace(".000", "").replace("Z", "-05:00");
    }
    pagination(parseInt(data.feed.openSearch$totalResults.$t, 10));
}

// Función principal para determinar la configuración de la página
function bloggerPageInit() {
    searchQuery = getSearchQuery();
    let activePage = window.location.href;
    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    
    let scriptUrl = `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=fetchLastPostDate`;
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", bloggerPageInit);

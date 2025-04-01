// Parámetros globales
var currentPage, searchQuery, itemsPerPage = 12, lastPostDate = null, type, lblname1;

function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

function pagination(totalPosts) {
    let paginationHTML = "";
    const pagesToShow = 5;
    let leftnum = Math.floor(pagesToShow / 2);

    let maximum = Math.ceil(totalPosts / itemsPerPage);
    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "prevpage", type);
    }

    if (start > 1) {
        paginationHTML += type === "page"
            ? `<span class="pagenumber"><a href="${home_page}">1</a></span>`
            : `<span class="pagenumber"><a href="/search/label/${lblname1}?&max-results=${itemsPerPage}">1</a></span>`;
    }

    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        if (r === parseInt(currentPage, 10)) {
            paginationHTML += `<span class="pagenumber current">${r}</span>`;
        } else {
            paginationHTML += createPageLink(r, r, type);
        }
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);
    if (currentPage < maximum) paginationHTML += createPageLink(currentPage + 1, "nextpage", type);

    let pageArea = document.getElementsByName("pageArea");
    let pagerElement = document.getElementById("blog-pager");

    for (let i = 0; i < pageArea.length; i++) {
        pageArea[i].innerHTML = paginationHTML;
    }
    if (pagerElement) pagerElement.innerHTML = paginationHTML;
}

function createPageLink(pageNum, linkText, type) {
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let labelParam = lblname1 ? `search/label/${lblname1}` : "search";
    let startIndex = (pageNum - 1) * itemsPerPage;
    let url = `${window.location.origin}/${labelParam}?${searchParam}&updated-max=${encodeURIComponent(lastPostDate || new Date().toISOString())}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false#PageNo=${pageNum}`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

function paginationall(data) {
    console.log("Datos del feed:", data); // Depuración: muestra los datos completos
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    console.log("Total de entradas reportadas:", totalResults); // Depuración: muestra el total
    if (isNaN(totalResults) || totalResults <= 0) {
        console.error("Error: totalResults no válido, usando valor por defecto");
        totalResults = itemsPerPage; // Valor por defecto
    }
    pagination(totalResults);
}

function bloggerpage() {
    searchQuery = getSearchQuery();
    let activePage = window.location.href;

    if (activePage.includes("/search/label/")) {
        type = "label";
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
    } else if (searchQuery) {
        type = "search";
    } else {
        type = "page";
    }

    currentPage = activePage.includes("#PageNo=") 
        ? parseInt(activePage.split("#PageNo=")[1], 10) 
        : 1;

    // Asegúrate de que home_page esté definida
    if (typeof home_page === "undefined") {
        console.error("Error: home_page no está definida");
        return;
    }

    let script.Url = type === "search"
        ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?max-results=1&alt=json-in-script&callback=paginationall`;

    console.log("URL del feed:", scriptUrl); // Depuración: muestra la URL generada

    let script = document.createElement("script");
    script.src = scriptUrl;
    script.onerror = () => console.error("Error al cargar el feed:", scriptUrl);
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", bloggerpage);

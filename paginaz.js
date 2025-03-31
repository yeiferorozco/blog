// Parámetros globales
var nopage, type, currentPage, lblname1, searchQuery, itemsPerPage = 12, lastPostDate = null;

function getSearchQuery() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("q") || "";
}

// Función principal de paginación
function pagination(totalPosts) {
    let paginationHTML = "";
    let leftnum = Math.floor(pagesToShow / 2);

    if (leftnum === pagesToShow - leftnum) {
        pagesToShow = 2 * leftnum + 1;
    }

    let start = currentPage - leftnum;
    start = Math.max(start, 1);

    let maximum = Math.floor(totalPosts / itemsPerPage) + 1;
    if (maximum * itemsPerPage === totalPosts) {
        maximum -= 1;
    }

    let end = start + pagesToShow - 1;
    end = Math.min(end, maximum);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior", type);
    }

    if (start > 1) {
        paginationHTML += createPageLink(1, "1", type);
    }
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage 
            ? `<span class="pagenumber current">${r}</span>` 
            : createPageLink(r, r, type);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum, type);

    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente", type);
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

function createPageLink(pageNum, linkText, type) {
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let startIndex = (pageNum - 1) * itemsPerPage;
    let url = type === "page"
        ? `https://www.yeifer.com/search?${searchParam}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false`
        : `https://www.yeifer.com/search/label/${lblname1}?max-results=${itemsPerPage}&start=${startIndex}&by-date=false`;
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    pagination(totalResults);
}

function bloggerpage() {
    let activePage = window.location.href;
    searchQuery = getSearchQuery();

    if (activePage.includes("/search/label/")) {
        lblname1 = activePage.split("/search/label/")[1].split("?")[0];
        type = "label";
    } else {
        type = "page";
    }

    currentPage = activePage.includes("#PageNo=") ? parseInt(activePage.split("#PageNo=")[1]) : 1;
    let scriptUrl = type === "page"
        ? `${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall`
        : `${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1`;

    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", bloggerpage);

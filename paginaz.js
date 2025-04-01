// Paginación para búsquedas, etiquetas y páginas generales

// Parámetros globales
var currentPage, searchQuery, labelQuery, itemsPerPage = 12, lastPostDate = null;

function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || "";
}

function pagination(totalPosts) {
    let paginationHTML = "";
    let pagesToShow = 5;
    let leftnum = Math.floor(pagesToShow / 2);
    let maximum = Math.ceil(totalPosts / itemsPerPage);

    paginationHTML += `<span class='totalpages'>Hoja ${currentPage} de ${maximum}</span>`;

    if (currentPage > 1) {
        paginationHTML += createPageLink(currentPage - 1, "Anterior");
    }

    let start = Math.max(currentPage - leftnum, 1);
    let end = Math.min(start + pagesToShow - 1, maximum);

    if (start > 1) paginationHTML += createPageLink(1, "1");
    if (start > 2) paginationHTML += "...";

    for (let r = start; r <= end; r++) {
        paginationHTML += r === currentPage 
            ? `<span class="pagenumber current">${r}</span>` 
            : createPageLink(r, r);
    }

    if (end < maximum - 1) paginationHTML += "...";
    if (end < maximum) paginationHTML += createPageLink(maximum, maximum);

    if (currentPage < maximum) {
        paginationHTML += createPageLink(currentPage + 1, "Siguiente");
    }

    document.getElementById("blog-pager").innerHTML = paginationHTML;
}

function createPageLink(pageNum, linkText) {
    let updatedMax = lastPostDate || (pageNum === 1 ? null : new Date().toISOString().replace(".000", "").replace("Z", "-05:00"));
    let searchParam = searchQuery ? `q=${encodeURIComponent(searchQuery)}` : "";
    let labelParam = labelQuery ? `label/${encodeURIComponent(labelQuery)}` : "";
    let baseURL = home_page + (labelQuery ? `${labelParam}` : "search");
    let startIndex = (pageNum - 1) * itemsPerPage;
    
    let url = `${baseURL}?${searchParam}` + 
              (pageNum > 1 && updatedMax ? `&updated-max=${encodeURIComponent(updatedMax)}&max-results=${itemsPerPage}&start=${startIndex}&by-date=false` : "");
    
    return `<span class="pagenumber"><a href="${url}">${linkText}</a></span>`;
}

function paginationall(data) {
    let totalResults = parseInt(data.feed.openSearch$totalResults.$t, 10);
    
    if (data.feed.entry && data.feed.entry.length > 0) {
        lastPostDate = data.feed.entry[data.feed.entry.length - 1].updated.$t;
    } else if (!lastPostDate) {
        lastPostDate = new Date().toISOString().replace(".000", "").replace("Z", "-05:00");
    }

    pagination(totalResults);
}

function bloggerpage() {
    searchQuery = getQueryParam("q");
    labelQuery = window.location.href.includes("/label/") ? window.location.pathname.split("/label/")[1].split("/")[0] : "";
    currentPage = window.location.href.includes("#PageNo=") ? parseInt(window.location.href.split("#PageNo=")[1]) : 1;
    
    let baseFeed = home_page + (labelQuery ? `feeds/posts/summary/-/${encodeURIComponent(labelQuery)}` : "feeds/posts/summary");
    let scriptUrl = `${baseFeed}?max-results=${itemsPerPage}&start=${(currentPage - 1) * itemsPerPage}&alt=json-in-script&callback=paginationall`;
    
    let script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", bloggerpage);

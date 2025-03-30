var home_page = window.location.origin + "/search";
var itemsPerPage = 12;
var currentPage = 1;
var query = "";

function searchPagination() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("q")) {
        query = urlParams.get("q");
        currentPage = window.location.hash.includes("#PageNo=") 
            ? parseInt(window.location.hash.split("#PageNo=")[1], 10) 
            : 1;

        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `${home_page}?alt=json-in-script&callback=searchResultsCount&q=${query}&max-results=1`;
        document.body.appendChild(script);
    }
}

function searchResultsCount(data) {
    let totalPosts = parseInt(data.feed.openSearch$totalResults.$t, 10);
    let totalPages = Math.ceil(totalPosts / itemsPerPage);

    if (totalPages > 1) {
        let paginationHtml = `<div class='pagination'>`;
        if (currentPage > 1) {
            paginationHtml += `<a href='${home_page}?q=${query}&max-results=${itemsPerPage}#PageNo=${currentPage - 1}'>&laquo; Anterior</a>`;
        }
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<a href='${home_page}?q=${query}&max-results=${itemsPerPage}#PageNo=${i}' ${i === currentPage ? "class='active'" : ""}>${i}</a>`;
        }
        if (currentPage < totalPages) {
            paginationHtml += `<a href='${home_page}?q=${query}&max-results=${itemsPerPage}#PageNo=${currentPage + 1}'>Siguiente &raquo;</a>`;
        }
        paginationHtml += "</div>";
        document.getElementById("pagination-container").innerHTML = paginationHtml;
    }
}

window.onload = searchPagination;

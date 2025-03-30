function bloggerpage() {
    let activePage = window.location.href;

    if (activePage.includes("?q=")) {
        type = "search";
        searchQuery = new URLSearchParams(window.location.search).get("q") || "";
        searchQuery = encodeURIComponent(searchQuery);

        itemsPerPage = activePage.includes("&max-results=")
            ? parseInt(activePage.split("&max-results=")[1], 10)
            : 9;

        currentPage = activePage.includes("#PageNo=")
            ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10)
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary?q=${searchQuery}&alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    } else if (activePage.includes("/search/label/")) {
        type = "label";
        lblname1 = activePage.includes("?updated-max") 
            ? activePage.substring(activePage.indexOf("/search/label/") + 14, activePage.indexOf("?updated-max"))
            : activePage.substring(activePage.indexOf("/search/label/") + 14, activePage.indexOf("?&max"));

        currentPage = activePage.includes("#PageNo=")
            ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10)
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary/-/${lblname1}?alt=json-in-script&callback=paginationall&max-results=1"></script>`);
    } else if (!activePage.includes(".html")) {
        type = "page";
        currentPage = activePage.includes("#PageNo=")
            ? parseInt(activePage.substring(activePage.indexOf("#PageNo=") + 8), 10)
            : 1;

        document.write(`<script src="${home_page}feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall"></script>`);
    }
}

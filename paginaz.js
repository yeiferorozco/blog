(function(globalScope, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        (globalScope = typeof globalThis !== "undefined" ? globalThis : globalScope || self).CustomPager = factory();
    }
})(this, function() {
    "use strict";

    const defaultSettings = {
        pagerContainer: "#pagination",
        pageNumbersContainer: "#page-numbers",
        pageClass: "page-link",
        ellipsisClass: "page-ellipsis",
        currentPageClass: "active",
        visiblePageCount: 6,
        checkUpdates: true,
        jumpDotsEnabled: true,
        useDateSorting: false,
        itemsPerPage: null,
        searchQuery: null,
        category: null,
        startOffset: null,
        latestUpdate: null
    };

    function generatePagination({settings, currentPage, totalPages}) {
        const { visiblePageCount, currentPageClass } = settings;
        const halfRange = Math.floor(visiblePageCount / 2);
        let startPage = Math.max(currentPage - halfRange, 1);
        let endPage = Math.min(startPage + visiblePageCount - 1, totalPages);
        
        if (totalPages <= visiblePageCount) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= halfRange) {
            startPage = 1;
            endPage = visiblePageCount;
        } else if (currentPage >= totalPages - halfRange) {
            startPage = totalPages - visiblePageCount + 1;
            endPage = totalPages;
        }
        
        let paginationData = Array.from({ length: endPage - startPage + 1 }, (_, index) => ({
            number: startPage + index,
            isCurrent: startPage + index === currentPage ? currentPageClass : ""
        }));

        return paginationData;
    }

    function extractParams(url) {
        const urlParams = url.searchParams;
        return {
            itemsPerPage: Number(urlParams.get("max-results")),
            searchQuery: urlParams.get("q"),
            category: url.pathname.includes("/search/label/") ? url.pathname.split("/").pop() : null
        };
    }

    function getCachedData(key) {
        return JSON.parse(localStorage.getItem(key)) || {};
    }

    function setCachedData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function calculateTotalPages(totalItems, itemsPerPage) {
        return Math.ceil(totalItems / itemsPerPage);
    }

    function constructPageLink({ settings, pageNumber }) {
        const { baseURL, category, searchQuery, itemsPerPage, useDateSorting } = settings;
        if (pageNumber === 1) {
            return category ? `${baseURL}/search/label/${category}?max-results=${itemsPerPage}` : `${baseURL}/search?q=${searchQuery}&max-results=${itemsPerPage}&by-date=${useDateSorting}`;
        }
        return `${baseURL}/page/${pageNumber}?max-results=${itemsPerPage}`;
    }

    function renderPagination({ settings, paginationData }) {
        const pageContainer = document.querySelector(settings.pageNumbersContainer);
        if (!pageContainer) return;
        
        pageContainer.innerHTML = "";
        paginationData.forEach(({ number, isCurrent }) => {
            const pageElement = document.createElement("a");
            pageElement.className = `${settings.pageClass} ${isCurrent}`.trim();
            pageElement.textContent = number;
            pageElement.href = constructPageLink({ settings, pageNumber: number });
            pageContainer.appendChild(pageElement);
        });
    }

    return class {
        constructor(customSettings = {}) {
            this.currentURL = new URL(window.location.href);
            this.settings = { ...defaultSettings, ...customSettings, ...extractParams(this.currentURL), baseURL: this.currentURL.origin };
            this.pagerElement = document.querySelector(this.settings.pagerContainer);
        }

        async initialize() {
            if (!this.pagerElement) return;
            const cachedData = getCachedData("paginationData");
            const totalItems = cachedData.totalItems || 100; 
            const totalPages = calculateTotalPages(totalItems, this.settings.itemsPerPage);
            
            const paginationData = generatePagination({ settings: this.settings, currentPage: 1, totalPages });
            renderPagination({ settings: this.settings, paginationData });
        }
    };
});
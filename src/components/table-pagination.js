import tablePaginationStyles from "../styles/table-pagination.js";

class TablePagination extends HTMLElement {
  static observedAttributes = ["data-page"];

  constructor() {
    super();
    document.adoptedStyleSheets.push(tablePaginationStyles);
    this.attachShadow({ mode: "open" });
    this._container = document.createElement("nav");
    this.shadowRoot.append(this._container);
  }

  /* _____      _ _ _                _        
    / ____|    | | | |              | |       
   | |     __ _| | | |__   __ _  ___| | _____ 
   | |    / _` | | | '_ \ / _` |/ __| |/ / __|
   | |___| (_| | | | |_) | (_| | (__|   <\__ \
    \_____\__,_|_|_|_.__/ \__,_|\___|_|\_\___/
  */

  connectedCallback() {
    this.parentContainer = this.closest("table-container");
    console.debug(this.parentContainer);
    if (!this.parentContainer) {
      console.warn("table-pagination must be inside table-container");
      return;
    }

    this._loadPagesFromDatalist();
    if (this._pages.length <= 1) {
      this.style.display = "none";
      return;
    }

    this._render();
    this._syncFromParent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-page" && oldValue !== newValue) {
      this._updateActive(newValue);
    }
  }

  /*_____       _     _ _      
   |  __ \     | |   | (_)     
   | |__) |   _| |__ | |_  ___ 
   |  ___/ | | | '_ \| | |/ __|
   | |   | |_| | |_) | | | (__ 
   |_|    \__,_|_.__/|_|_|\___|                           
  */

  /**
   * @param {Array<{name: string, value: string | number}>} pages
   */
  setPages(pages = []) {
    if (!Array.isArray(pages)) {
      console.warn("setPages expects an array");
      return;
    }

    this._pages = pages;
    this._render();
  }

  /*_____      _            _       
   |  __ \    (_)          | |      
   | |__) | __ ___   ____ _| |_ ___ 
   |  ___/ '__| \ \ / / _` | __/ _ \
   | |   | |  | |\ V / (_| | ||  __/
   |_|   |_|  |_| \_/ \__,_|\__\___|                                
  */

  _loadPagesFromDatalist() {
    const datalist = this.querySelector("datalist");
    if (!datalist) return;

    this._pages = Array.from(datalist.options).map((opt) => ({
      name: opt.textContent.trim(),
      value: opt.value,
    }));
  }

  _syncFromParent() {
    const page = this.parentContainer.getAttribute("data-page");
    if (page != null) {
      this.setAttribute("data-page", page);
    }
  }

  _render() {
    this._container.innerHTML = "";

    if (!this._pages.length) return;

    const currentPage = this.getAttribute("data-page");

    this._pages.forEach(({ name, value }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = name;
      button.dataset.page = value;

      if (String(value) === String(currentPage)) {
        button.setAttribute("aria-current", "page");
      }

      button.addEventListener("click", () => {
        this._setPage(value);
      });

      this._container.append(button);
    });
  }

  _setPage(value) {
    this.parentContainer.setAttribute("data-page", value);
    this.setAttribute("data-page", value);
  }

  _updateActive(value) {
    [...this._container.children].forEach((button) => {
      if (button.dataset.page === String(value)) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }
}

export default TablePagination;

import tableContainerStyles from "../styles/table-container.js";
import TableViews from "./table-views.js";
import TablePagination from "./table-pagination.js";

class TableContainer extends HTMLElement {
  static observedAttributes = ["data-view", "data-page", "data-columns"];

  constructor() {
    super();
    this.initialized = false;
    document.adoptedStyleSheets = [tableContainerStyles];
  }

  /* _____      _ _ _                _        
    / ____|    | | | |              | |       
   | |     __ _| | | |__   __ _  ___| | _____ 
   | |    / _` | | | '_ \ / _` |/ __| |/ / __|
   | |___| (_| | | | |_) | (_| | (__|   <\__ \
    \_____\__,_|_|_|_.__/ \__,_|\___|_|\_\___/
*/

  connectedCallback() {
    if (!this._initialized) {
      this._initialized = true;

      this._waitForChildren().then(() => {
        this._syncWithURLParams();
        this._setupEventListeners();
        this._renderSkeleton();
      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._initialized || oldValue === newValue) return;

    switch (name) {
      case "data-view":
        this._handleViewChange(oldValue, newValue);
        break;
      case "data-page":
        this._handlePageChange(newValue);
        break;
      case "data-columns":
        if (oldValue !== newValue) {
          this._renderSkeleton();
        }
        break;
    }
  }

  /*_____       _     _ _      
   |  __ \     | |   | (_)     
   | |__) |   _| |__ | |_  ___ 
   |  ___/ | | | '_ \| | |/ __|
   | |   | |_| | |_) | | | (__ 
   |_|    \__,_|_.__/|_|_|\___|                           
  */

  setContent(node) {
    const wrapper = this.querySelector("table-wrapper");
    if (!wrapper) return;

    wrapper.replaceChildren(node);
  }

  /*_____      _            _       
   |  __ \    (_)          | |      
   | |__) | __ ___   ____ _| |_ ___ 
   |  ___/ '__| \ \ / / _` | __/ _ \
   | |   | |  | |\ V / (_| | ||  __/
   |_|   |_|  |_| \_/ \__,_|\__\___|                                
  */

  _waitForChildren() {
    return new Promise((resolve) => {
      const check = () => {
        if (this.children.length > 0) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }

  _syncWithURLParams() {
    const params = new URLSearchParams(window.location.search);
    const urlView = params.get("view");
    const urlPage = params.get("page");

    if (urlView && !this.dataset.view) {
      this.dataset.view = urlView;
    }
    if (urlPage && !this.dataset.page) {
      this.dataset.page = urlPage;
    }

    if (this.dataset.view) {
      this._updateURLParams();
    }
  }

  _setupEventListeners() {
    window.addEventListener("popstate", () => {
      this._syncWithURLParams();
    });
  }

  _updateURLParams() {
    const params = new URLSearchParams(window.location.search);

    if (this.dataset.view) {
      params.set("view", this.dataset.view);
    } else {
      params.delete("view");
    }

    if (this.dataset.page) {
      params.set("page", this.dataset.page);
    } else {
      params.delete("page");
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newURL);
  }

  _handleViewChange(oldView, newView) {
    // Remove page when view changes
    delete this.dataset.page;

    this._updateURLParams();
    this._renderSkeleton();

    // Emit change-view event
    this.dispatchEvent(
      new CustomEvent("change-view", {
        detail: {
          view: newView,
          previousView: oldView,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handlePageChange(newPage) {
    this._updateURLParams();
    this._renderSkeleton();

    // Emit change-page event
    this.dispatchEvent(
      new CustomEvent("change-page", {
        detail: {
          page: newPage,
          view: this.dataset.view,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderSkeleton() {
    const wrapper = this.querySelector("table-wrapper");
    if (!wrapper) return;

    const columns = parseInt(this.dataset.columns) || 3;
    const skeleton = this._createSkeletonLoader(columns);

    wrapper.replaceChildren(skeleton);
  }

  _createSkeletonLoader(columns) {
    const table = document.createElement("table");
    table.className = "skeleton-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    for (let i = 0; i < columns; i++) {
      const th = document.createElement("th");
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 0; i < 5; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < columns; j++) {
        const td = document.createElement("td");
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    return table;
  }

  /*_    _      _                     
   | |  | |    | |                    
   | |__| | ___| |_ __   ___ _ __ ___ 
   |  __  |/ _ \ | '_ \ / _ \ '__/ __|
   | |  | |  __/ | |_) |  __/ |  \__ \
   |_|  |_|\___|_| .__/ \___|_|  |___/
                 | |                  
                 |_|                  
  */

  getView() {
    return this.dataset.view;
  }

  getPage() {
    return this.dataset.page;
  }

  setView(viewValue) {
    this.dataset.view = viewValue;
  }

  setPage(pageValue) {
    this.dataset.page = pageValue;
  }
}

customElements.define("table-container", TableContainer);

/*_____       _      _____                                             _       
 / ____|     | |    / ____|                                           | |      
| (___  _   _| |__ | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ ___ 
 \___ \| | | | '_ \| |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __/ __|
 ____) | |_| | |_) | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_\__ \
|_____/ \__,_|_.__/ \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|___/
                                         | |                                   
                                         |_|                                   
 */

customElements.define("table-views", TableViews)
customElements.define("table-pagination", TablePagination)
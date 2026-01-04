import tableViewsStyles from "../styles/table-views.js";

class TableViews extends HTMLElement {
  constructor() {
    super();
    document.adoptedStyleSheets = [tableViewsStyles];
    this.attachShadow({ mode: "open" });

    this._views = [];
    this._currentView = null;

    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
    if (!this.parentContainer){
      console.warn("table-views must be inside table-container");
      return;
    }

    this._loadViewsFromDatalist();
    if (this._views.length <= 1) {
      this.style.display = "none";
      return;
    }

    this._currentView =
      this.parentContainer.dataset.view || this._views[0].value;

    this._render();
    this._syncWithParent(this._currentView);
  }

  /*_____       _     _ _      
   |  __ \     | |   | (_)     
   | |__) |   _| |__ | |_  ___ 
   |  ___/ | | | '_ \| | |/ __|
   | |   | |_| | |_) | | | (__ 
   |_|    \__,_|_.__/|_|_|\___|                           
  */

  setViews(views = []) {
    this._views = views;
    this._currentView = views[0]?.value || null;
    this._render();
    this._syncWithParent(this._currentView);
  }

  /*_____      _            _       
   |  __ \    (_)          | |      
   | |__) | __ ___   ____ _| |_ ___ 
   |  ___/ '__| \ \ / / _` | __/ _ \
   | |   | |  | |\ V / (_| | ||  __/
   |_|   |_|  |_| \_/ \__,_|\__\___|                                
  */

  _loadViewsFromDatalist() {
    const datalist = this.querySelector("datalist");
    if (!datalist) return;

    this._views = Array.from(datalist.options).map((opt) => ({
      name: opt.textContent.trim(),
      value: opt.value,
      columns: opt.dataset.columns,
    }));
  }

  _syncWithParent(viewValue) {
    const view = this._views.find((v) => v.value === viewValue);
    if (!view) return;

    this.parentContainer.dataset.view = view.value;
    this.parentContainer.dataset.columns = view.columns;
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <div class="labels">
        ${this._views
          .map(
            (view) => `
          <button
            data-value="${view.value}"
            class="${view.value === this._currentView ? "active" : ""}"
          >
            ${view.name}
          </button>
        `
          )
          .join("")}
      </div>

      <select>
        ${this._views
          .map(
            (view) => `
          <option value="${view.value}" ${
              view.value === this._currentView ? "selected" : ""
            }>
            ${view.name}
          </option>
        `
          )
          .join("")}
      </select>
    `;

    this.shadowRoot
      .querySelector(".labels")
      .addEventListener("click", this.handleClick);

    this.shadowRoot
      .querySelector("select")
      .addEventListener("change", this.handleSelect);
  }

  handleClick(event) {
    const btn = event.target.closest("button");
    if (!btn) return;
    this._changeView(btn.dataset.value);
  }

  handleSelect(event) {
    this._changeView(event.target.value);
  }

  _changeView(value) {
    if (value === this._currentView) return;

    this._currentView = value;
    this._syncWithParent(value);
    this._render();
  }
}

export default TableViews;
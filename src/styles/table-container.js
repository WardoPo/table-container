const styles = new CSSStyleSheet();

styles.replaceSync(`
  :host {
    display: block;
  }

  .skeleton-table{
    width:100%;
  }

 .skeleton-table th,.skeleton-table td{
 padding: 12px 16px;
 }

 .skeleton-table th::after{
  max-width: 64px;
 }

 .skeleton-table td::after,.skeleton-table th::after{
  content:"";
  display:block;
  width:100%;
  height:24px;
  background-color:#E3E3E3;
 }

`);

export default styles;
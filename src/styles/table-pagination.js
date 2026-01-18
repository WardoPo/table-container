const styles = new CSSStyleSheet();

styles.replaceSync(`
    table-pagination::part(pagination-previous)::before {
  content: "‹";
}

table-pagination::part(pagination-next)::after {
  content: "›";
}
`);

export default styles;
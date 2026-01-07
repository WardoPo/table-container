const styles = new CSSStyleSheet();

styles.replaceSync(`
      :host{
        display:inline-block
      }

        .labels {
          display: flex;
          gap: 8px;
        }

        select {
          width: 100%;
          display: none
        }

        @media screen and (max-width: 992px) {
          .labels{
            display:none;
          }
          select {
            display: block
          }
        }
`);

export default styles;

const styles = new CSSStyleSheet();

styles.replaceSync(`
  :host {
          display: block;
        }

        .labels {
          display: flex;
          gap: 8px;
        }

        button {
          border: none;
          background: none;
          padding: 4px 8px;
          cursor: pointer;
          opacity: 0.6;
        }

        button.active {
          opacity: 1;
          font-weight: 600;
        }

        select {
          width: 100%;
        }

        @media (max-width: 768px) {
          .labels {
            display: none;
          }
        }

        @media (min-width: 769px) {
          select {
            display: none;
          }
        }
`);

export default styles;

/* eslint-disable import/prefer-default-export */
export function registerWebComponent(
  elementName: string,
  importPromise: Promise<ImportWebComponent>
): void {
  importPromise.then(({ default: Component }) => {
    customElements.define(elementName, Component);
  });
}

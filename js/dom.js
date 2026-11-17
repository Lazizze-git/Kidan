// @ts-check
// Création et recherche d'éléments DOM, partagées par les modules de rendu

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

/**
 * Élément indispensable au fonctionnement d'une page : s'il manque dans le
 * HTML, l'erreur le dit clairement au lieu d'échouer plus loin.
 * @template {Element} T
 * @param {ParentNode} root
 * @param {string} selector
 * @param {{ new (): T, prototype: T }} type
 * @returns {T}
 */
export function requireElement(root, selector, type) {
  const node = root.querySelector(selector);
  if (!(node instanceof type)) {
    throw new Error(`Élément ${selector} introuvable dans la page`);
  }
  return node;
}

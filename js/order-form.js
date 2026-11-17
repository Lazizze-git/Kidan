// @ts-check
// Validation et envoi du formulaire de commande
import { CONFIG } from "./config.js";
import { formatPrice } from "./render.js";
import { validateForm, watchFields } from "./form-validation.js";

/** @typedef {import("./cart.js").CartItem} CartItem */
/**
 * @typedef {object} OrderFields
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} street
 * @property {string} zip
 * @property {string} city
 * @property {string} email
 * @property {string} phone
 * @property {string} notes
 */
/**
 * @typedef {object} OrderFormOptions
 * @property {HTMLFormElement} form
 * @property {HTMLElement} errorNode
 * @property {() => CartItem[]} getItems
 * @property {() => number} getTotal
 * @property {(total: number) => void} onSuccess
 */

/**
 * @param {HTMLFormElement} form
 * @returns {OrderFields}
 */
function readFields(form) {
  const data = new FormData(form);
  const value = (/** @type {string} */ name) => String(data.get(name) ?? "").trim();
  return {
    firstname: value("firstname"),
    lastname: value("lastname"),
    street: value("street"),
    zip: value("zip"),
    city: value("city"),
    email: value("email"),
    phone: value("phone"),
    notes: value("notes"),
  };
}

/**
 * @param {CartItem[]} items
 * @param {number} total
 * @param {OrderFields} fields
 */
function buildOrderText(items, total, fields) {
  const lines = items.map(
    ({ product, qty }) =>
      `- ${product.artist}, ${product.title} × ${qty} (${formatPrice(product.price * qty)})`
  );
  return [
    "Nouvelle commande, boutique 45 Syndicate",
    "",
    "Articles :",
    ...lines,
    "",
    `Total : ${formatPrice(total)}`,
    "",
    "Livraison :",
    `${fields.firstname} ${fields.lastname}`,
    fields.street,
    `${fields.zip} ${fields.city}`,
    `Email : ${fields.email}`,
    `Téléphone : ${fields.phone}`,
    fields.notes ? `Remarques : ${fields.notes}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

/**
 * @param {string} orderText
 * @param {OrderFields} fields
 */
async function sendOrder(orderText, fields) {
  if (CONFIG.orderEndpoint !== "") {
    const response = await fetch(CONFIG.orderEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: fields.email, message: orderText }),
    });
    if (!response.ok) {
      throw new Error(`Envoi refusé (${response.status})`);
    }
    return;
  }
  const subject = encodeURIComponent("Commande, boutique solidaire 45 Syndicate");
  const body = encodeURIComponent(orderText);
  window.location.href = `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
}

/**
 * @param {HTMLElement} errorNode
 * @param {string} message
 */
function setError(errorNode, message) {
  errorNode.textContent = message;
  errorNode.hidden = message === "";
}

/** @param {number} count */
function invalidMessage(count) {
  return count === 1
    ? "Un champ est à corriger avant d’envoyer la commande."
    : `${count} champs sont à corriger avant d’envoyer la commande.`;
}

/**
 * @param {HTMLButtonElement} button
 * @param {boolean} busy
 * @param {string} idleLabel
 */
function setBusy(button, busy, idleLabel) {
  button.disabled = busy;
  button.textContent = busy ? "Envoi en cours…" : idleLabel;
}

/** @param {OrderFormOptions} options */
export function initOrderForm({ form, errorNode, getItems, getTotal, onSuccess }) {
  watchFields(form);
  const submitButton = form.querySelector("button[type='submit']");
  if (!(submitButton instanceof HTMLButtonElement)) {
    throw new Error("Formulaire de commande : bouton d’envoi introuvable");
  }
  const idleLabel = submitButton.textContent ?? "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setError(errorNode, "");

    const { firstInvalid, invalidCount } = validateForm(form);
    if (firstInvalid !== null) {
      setError(errorNode, invalidMessage(invalidCount));
      firstInvalid.focus();
      return;
    }

    const items = getItems();
    if (items.length === 0) {
      setError(errorNode, "Votre panier est vide : ajoutez un vinyle avant de commander.");
      return;
    }

    setBusy(submitButton, true, idleLabel);
    const fields = readFields(form);
    const total = getTotal();
    try {
      await sendOrder(buildOrderText(items, total, fields), fields);
      onSuccess(total);
    } catch {
      setError(
        errorNode,
        `L’envoi a échoué. Réessayez, ou écrivez-nous directement à ${CONFIG.contactEmail}.`
      );
    } finally {
      setBusy(submitButton, false, idleLabel);
    }
  });
}

// Validation et envoi du formulaire de commande
import { CONFIG } from "./config.js";
import { formatPrice } from "./render.js";
import { validateForm, watchFields } from "./form-validation.js";

function readFields(form) {
  const data = new FormData(form);
  const value = (name) => String(data.get(name) ?? "").trim();
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

function buildOrderText(items, total, fields) {
  const lines = items.map(
    (item) =>
      `- ${item.product.artist} — ${item.product.title} × ${item.qty} (${formatPrice(
        item.product.price * item.qty
      )})`
  );
  return [
    "Nouvelle commande — Boutique 45 Syndicate",
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

  const subject = encodeURIComponent("Commande — Boutique solidaire 45 Syndicate");
  const body = encodeURIComponent(orderText);
  window.location.href = `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
}

function setError(errorNode, message) {
  errorNode.textContent = message;
  errorNode.hidden = message === "";
}

export function initOrderForm({ form, errorNode, getItems, getTotal, onSuccess }) {
  watchFields(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setError(errorNode, "");

    const { firstInvalid, invalidCount } = validateForm(form);
    if (firstInvalid !== null) {
      setError(
        errorNode,
        invalidCount === 1
          ? "Un champ est à corriger avant d’envoyer la commande."
          : `${invalidCount} champs sont à corriger avant d’envoyer la commande.`
      );
      firstInvalid.focus();
      return;
    }

    const items = getItems();
    if (items.length === 0) {
      setError(errorNode, "Votre panier est vide.");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    const idleLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours…";

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
      submitButton.disabled = false;
      submitButton.textContent = idleLabel;
    }
  });
}

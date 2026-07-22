// Validation et envoi du formulaire de commande
import { CONFIG } from "./config.js";
import { formatPrice } from "./render.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

function validate(form, fields) {
  const required = ["firstname", "lastname", "street", "zip", "city", "email", "phone"];
  let firstInvalid = null;

  required.forEach((name) => {
    const input = form.elements.namedItem(name);
    const isEmpty = fields[name] === "";
    const isBadEmail = name === "email" && !isEmpty && !EMAIL_PATTERN.test(fields.email);
    const invalid = isEmpty || isBadEmail;
    input.classList.toggle("is-invalid", invalid);
    if (invalid && firstInvalid === null) {
      firstInvalid = input;
    }
  });

  if (firstInvalid !== null) {
    firstInvalid.focus();
    return "Merci de remplir tous les champs obligatoires (email valide inclus).";
  }
  return null;
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

export function initOrderForm({ form, errorNode, getItems, getTotal, onSuccess }) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorNode.hidden = true;

    const fields = readFields(form);
    const validationError = validate(form, fields);
    if (validationError !== null) {
      errorNode.textContent = validationError;
      errorNode.hidden = false;
      return;
    }

    const items = getItems();
    const total = getTotal();
    if (items.length === 0) {
      errorNode.textContent = "Votre panier est vide.";
      errorNode.hidden = false;
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
      await sendOrder(buildOrderText(items, total, fields), fields);
      onSuccess(total);
    } catch {
      errorNode.textContent = `L'envoi a échoué. Réessayez, ou écrivez-nous directement à ${CONFIG.contactEmail}.`;
      errorNode.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
}

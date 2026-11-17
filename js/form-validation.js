// @ts-check
// Règles de validation du formulaire de commande : un message clair par champ
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_PATTERN = /^\d{4}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,}$/;

/** @typedef {"firstname" | "lastname" | "street" | "zip" | "city" | "email" | "phone"} RequiredField */

/** @type {RequiredField[]} */
export const REQUIRED_FIELDS = ["firstname", "lastname", "street", "zip", "city", "email", "phone"];

/** @type {Record<RequiredField, string>} */
const EMPTY_MESSAGES = {
  firstname: "Indiquez votre prénom.",
  lastname: "Indiquez votre nom.",
  street: "Indiquez la rue et le numéro.",
  zip: "Indiquez le NPA.",
  city: "Indiquez la localité.",
  email: "Indiquez votre adresse email.",
  phone: "Indiquez un numéro de téléphone.",
};

/** @type {Partial<Record<RequiredField, [RegExp, string]>>} */
const FORMAT_RULES = {
  email: [EMAIL_PATTERN, "Cette adresse email semble incomplète (exemple : nom@domaine.ch)."],
  zip: [ZIP_PATTERN, "Le NPA compte 4 chiffres (exemple : 1003)."],
  phone: [PHONE_PATTERN, "Ce numéro semble incomplet (exemple : 079 123 45 67)."],
};

/**
 * Renvoie le message d'erreur d'un champ, ou null s'il est valide
 * @param {RequiredField} name
 * @param {string} rawValue
 * @returns {string | null}
 */
export function getFieldError(name, rawValue) {
  const value = rawValue.trim();
  if (value === "") {
    return EMPTY_MESSAGES[name];
  }
  const rule = FORMAT_RULES[name];
  if (rule && !rule[0].test(value)) {
    return rule[1];
  }
  return null;
}

/**
 * Affiche ou efface l'erreur d'un champ ; renvoie true si le champ est invalide
 * @param {HTMLInputElement} input
 * @param {string | null} message
 */
export function showFieldError(input, message) {
  const errorNode = document.getElementById(`${input.id}-error`);
  const invalid = message !== null;
  input.setAttribute("aria-invalid", String(invalid));
  if (errorNode) {
    errorNode.textContent = message ?? "";
    errorNode.hidden = !invalid;
  }
  return invalid;
}

/**
 * Les champs obligatoires présents dans le formulaire
 * @param {HTMLFormElement} form
 * @returns {{ name: RequiredField, input: HTMLInputElement }[]}
 */
function requiredInputs(form) {
  return REQUIRED_FIELDS.flatMap((name) => {
    const input = form.elements.namedItem(name);
    return input instanceof HTMLInputElement ? [{ name, input }] : [];
  });
}

/**
 * Valide tous les champs obligatoires ; renvoie le premier champ en erreur
 * @param {HTMLFormElement} form
 * @returns {{ firstInvalid: HTMLInputElement | null, invalidCount: number }}
 */
export function validateForm(form) {
  /** @type {HTMLInputElement | null} */
  let firstInvalid = null;
  let invalidCount = 0;
  requiredInputs(form).forEach(({ name, input }) => {
    if (showFieldError(input, getFieldError(name, input.value))) {
      invalidCount += 1;
      firstInvalid = firstInvalid ?? input;
    }
  });
  return { firstInvalid, invalidCount };
}

/**
 * Validation à la sortie du champ ; l'erreur disparaît dès que la saisie est bonne.
 * Si la sortie vient d'un appui sur « Envoyer », on laisse l'envoi valider :
 * un message qui apparaîtrait à ce moment décalerait le bouton sous le doigt.
 * @param {HTMLFormElement} form
 */
export function watchFields(form) {
  let pressingSubmit = false;
  form.addEventListener("pointerdown", (event) => {
    pressingSubmit =
      event.target instanceof Element && event.target.closest("[type='submit']") !== null;
  });

  requiredInputs(form).forEach(({ name, input }) => {
    input.addEventListener("blur", () => {
      if (!pressingSubmit) {
        showFieldError(input, getFieldError(name, input.value));
      }
    });
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        showFieldError(input, getFieldError(name, input.value));
      }
    });
  });
}

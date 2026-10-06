const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector('span');
  const status = contactForm.querySelector('.contact-form-status');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity() || submitButton.disabled) return;

    submitButton.disabled = true;
    submitLabel.textContent = 'Wysyłanie…';
    status.textContent = 'Wysyłanie wiadomości…';

    const fields = new FormData(contactForm);
    const payload = {
      name: fields.get('Imię'),
      email: fields.get('E-mail'),
      message: fields.get('Wiadomość'),
    };

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Nie udało się wysłać wiadomości.');

      contactForm.reset();
      status.textContent = 'Wiadomość została wysłana. Dziękuję.';
    } catch {
      status.textContent = 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.';
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Wyślij wiadomość';
    }
  });
}

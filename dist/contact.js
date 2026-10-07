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

    try {
      const formData = new FormData(contactForm);

      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error('Nie udało się wysłać wiadomości.');
      }

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

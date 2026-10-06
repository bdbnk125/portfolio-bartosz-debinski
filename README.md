# Portfolio Bartosza Dębińskiego

## Struktura

- `index.html` — strona główna.
- `kivo.html` — gotowe case study KIVO.
- `vena.html` — gotowe case study VENA Studio.
- `templates/case-study-template.html` — wspólny szablon dla kolejnych case studies.
- `style.css` — wspólne style strony, nawigacji, homepage i stopki.
- `case-study.css` — wspólne style podstron projektów.
- `navigation.js` — obsługa nawigacji.
- `animations.js` — animacje strony głównej i podstron projektów.
- `contact.js` — obsługa formularza kontaktowego.
- `assets/social-preview.png` — miniatura podglądu udostępnionego linku.
- `assets/projects/<projekt>/` — zoptymalizowane grafiki danego projektu.
- `scripts/` — budowanie i kontrola wersji publikacyjnej.

## Formularz kontaktowy

Formularz wysyła dane metodą `POST` do `/api/contact`. Przed publikacją na hostingu statycznym trzeba podłączyć działający endpoint formularza. Bez niego formularz poprawnie pokaże komunikat o błędzie, ale wiadomość nie zostanie wysłana.

## Dodawanie kolejnego projektu

1. Utwórz folder `assets/projects/nazwa-projektu/`.
2. Skopiuj `templates/case-study-template.html` jako `nazwa-projektu.html`.
3. Uzupełnij treść, grafiki oraz teksty alternatywne.
4. Dodaj plik strony do listy `files` w `scripts/build-static.mjs`.
5. Dodaj miniaturę i link na stronie głównej.
6. Uzupełnij odnośniki w `.case-pagination` poprzedniego i nowego projektu.
7. Uruchom `npm run check` przed publikacją.

Publiczna wersja strony powstaje w katalogu `dist/`. Ten katalog jest generowany i nie jest przechowywany w repozytorium.

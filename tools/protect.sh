#!/usr/bin/env bash
# Encrypts every page in site-src/ with ONE password and writes the result to docs/.
# The plaintext pages (site-src/) stay on your computer only; they are never committed to git.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install it from https://nodejs.org (the LTS version) and run this again."
  exit 1
fi

# Ask for the password without showing it (or take it from SITE_PASSWORD if you set that).
if [ -z "${SITE_PASSWORD:-}" ]; then
  read -r -s -p "Site password: " SITE_PASSWORD; echo
  read -r -s -p "Repeat password: " SITE_PASSWORD2; echo
  if [ "$SITE_PASSWORD" != "$SITE_PASSWORD2" ]; then echo "The two passwords do not match."; exit 1; fi
fi
if [ "${#SITE_PASSWORD}" -lt 14 ]; then
  echo "WARNING: the password is short (${#SITE_PASSWORD} characters). Anyone can download the encrypted pages"
  echo "and try guesses offline, so use a long passphrase (14+ characters, e.g. four random words)."
  read -r -p "Continue anyway? (y/N) " ans; [ "$ans" = "y" ] || exit 1
fi

# Install the encryption tool the first time (into tools/node_modules, which git ignores).
if [ ! -x tools/node_modules/.bin/staticrypt ]; then
  (cd tools && npm install --silent --no-audit --no-fund)
fi

# Every page in site-src/ -> same path in docs/. All pages share one salt (tools/.staticrypt.json),
# so entering the password once unlocks the whole site ("Remember me" lasts 30 days).
find site-src -name '*.html' | while read -r f; do
  rel="${f#site-src/}"; out="docs/$(dirname "$rel")"; mkdir -p "$out"
  STATICRYPT_PASSWORD="$SITE_PASSWORD" tools/node_modules/.bin/staticrypt "$f" \
    --config tools/.staticrypt.json -d "$out" --short --remember 30 \
    --template-title "RBY Invest" \
    --template-instructions "Private site. Enter the password to continue." \
    --template-button "ENTER" --template-placeholder "Password" \
    --template-remember "Keep me signed in on this device" \
    --template-color-primary "#0b2a55" --template-color-secondary "#eef3fb" >/dev/null
  echo "encrypted: $rel"
done
echo "Done. Now run:  git add -A docs tools .gitignore && git commit -m 'Update protected site' && git pull --rebase && git push"

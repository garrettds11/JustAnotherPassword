const allowedLengths = [
  { chars: 4 },
  { chars: 8 },
  { chars: 12 },
  { chars: 16 },
  { chars: 20 },
  { chars: 24 },
  { chars: 28 },
  { chars: 32 },
  { chars: 36 },
  { chars: 40 },
  { chars: 44 },
  { chars: 48 },
  { chars: 52 },
  { chars: 56 },
  { chars: 60 },
  { chars: 64 },
  { chars: 68 },
  { chars: 72 },
  { chars: 76 },
  { chars: 80 },
  { chars: 84 },
  { chars: 88 },
  { chars: 92 },
  { chars: 96 },
  { chars: 100 },
  { chars: 104 },
  { chars: 108 },
  { chars: 112 },
  { chars: 116 },
  { chars: 120 },
  { chars: 124 },
  { chars: 128 },
  { chars: 132 },
  { chars: 136 },
  { chars: 140 },
  { chars: 144 },
  { chars: 148 },
  { chars: 152 },
  { chars: 156 },
  { chars: 160 },
  { chars: 164 },
  { chars: 168 },
  { chars: 172 },
  { chars: 176 },
  { chars: 180 },
  { chars: 184 },
  { chars: 188 },
  { chars: 192 },
  { chars: 196 },
  { chars: 200 },
  { chars: 204 },
  { chars: 208 },
  { chars: 212 },
  { chars: 216 },
  { chars: 220 },
  { chars: 224 },
  { chars: 228 },
  { chars: 232 },
  { chars: 236 },
  { chars: 240 },
  { chars: 244 },
  { chars: 248 },
  { chars: 252 }
];

const PASSWORD_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?";

let index = allowedLengths.findIndex(x => x.chars === 24);
const lengthDiv = document.getElementById("length");

lengthDiv.addEventListener("wheel", (e) => {
  e.preventDefault();
  index += (e.deltaY < 0) ? 1 : -1;
  index = Math.max(0, Math.min(allowedLengths.length - 1, index));
  lengthDiv.textContent = "Length: " + allowedLengths[index].chars + " chars";
});

function generatePassword(length) {
  const alphabetLength = PASSWORD_ALPHABET.length;
  const maxValid = Math.floor(256 / alphabetLength) * alphabetLength;

  let password = "";

  while (password.length < length) {
    const random = new Uint8Array(length * 2);
    crypto.getRandomValues(random);

    for (const byte of random) {
      if (byte >= maxValid) continue;

      password += PASSWORD_ALPHABET[byte % alphabetLength];

      if (password.length === length) break;
    }
  }

  return password;
}

document.getElementById("generate").addEventListener("click", () => {
  const pass = generatePassword(allowedLengths[index].chars);

  chrome.storage.local.set({ generatedPassword: pass }, () => {
    const width = 550;
    const height = 325;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
      "password.html",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  });

  console.log("Password added to storage.");
});
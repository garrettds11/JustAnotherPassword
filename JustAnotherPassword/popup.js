const allowedLengths = [
  { chars: 4, bytes: 1 },
  { chars: 8, bytes: 2 },
  { chars: 12, bytes: 4 },
  { chars: 16, bytes: 6 },
  { chars: 20, bytes: 7 },
  { chars: 24, bytes: 8 },
  { chars: 28, bytes: 10 },
  { chars: 32, bytes: 12 },
  { chars: 36, bytes: 14 },
  { chars: 40, bytes: 15 },
  { chars: 44, bytes: 16 },
  { chars: 48, bytes: 18 },
  { chars: 52, bytes: 20 },
  { chars: 56, bytes: 21 },
  { chars: 60, bytes: 23 },
  { chars: 64, bytes: 24 },
  { chars: 68, bytes: 26 },
  { chars: 72, bytes: 27 },
  { chars: 76, bytes: 29 },
  { chars: 80, bytes: 30 },
  { chars: 84, bytes: 32 },
  { chars: 88, bytes: 33 },
  { chars: 92, bytes: 35 },
  { chars: 96, bytes: 36 },
  { chars: 100, bytes: 38 },
  { chars: 104, bytes: 39 },
  { chars: 108, bytes: 41 },
  { chars: 112, bytes: 42 },
  { chars: 116, bytes: 44 },
  { chars: 120, bytes: 45 },
  { chars: 124, bytes: 47 },
  { chars: 128, bytes: 48 },
  { chars: 132, bytes: 50 },
  { chars: 136, bytes: 51 },
  { chars: 140, bytes: 53 },
  { chars: 144, bytes: 54 },
  { chars: 148, bytes: 56 },
  { chars: 152, bytes: 57 },
  { chars: 156, bytes: 59 },
  { chars: 160, bytes: 60 },
  { chars: 164, bytes: 62 },
  { chars: 168, bytes: 63 },
  { chars: 172, bytes: 65 },
  { chars: 176, bytes: 66 },
  { chars: 180, bytes: 68 },
  { chars: 184, bytes: 69 },
  { chars: 188, bytes: 71 },
  { chars: 192, bytes: 72 },
  { chars: 196, bytes: 74 },
  { chars: 200, bytes: 75 },
  { chars: 204, bytes: 77 },
  { chars: 208, bytes: 78 },
  { chars: 212, bytes: 80 },
  { chars: 216, bytes: 81 },
  { chars: 220, bytes: 83 },
  { chars: 224, bytes: 84 },
  { chars: 228, bytes: 86 },
  { chars: 232, bytes: 87 },
  { chars: 236, bytes: 89 },
  { chars: 240, bytes: 90 },
  { chars: 244, bytes: 92 },
  { chars: 248, bytes: 93 },
  { chars: 252, bytes: 95 }
];

let index = allowedLengths.findIndex(x => x.chars === 24);
const lengthDiv = document.getElementById("length");

lengthDiv.addEventListener("wheel", (e) => {
  e.preventDefault();
  index += (e.deltaY < 0) ? -1 : 1;
  index = Math.max(0, Math.min(allowedLengths.length - 1, index));
  lengthDiv.textContent = "Length: " + allowedLengths[index].chars + " chars";
});

document.getElementById("generate").addEventListener("click", () => {
  const byteLen = allowedLengths[index].bytes;
  const random = new Uint8Array(byteLen);
  crypto.getRandomValues(random);

  const hex = Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("");
  const b64 = btoa(hex);

  const customAlphabet = "HNO4klm6ij9n+J2hyf0gzA8uvwDEq3X1Q7ZKeFrWcVTts/MRGYbdxSo=ILaUpPBC5";
  const standardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  let customEncoded = "";
  for (let ch of b64) {
    const idx = standardAlphabet.indexOf(ch);
    customEncoded += idx !== -1 ? customAlphabet[idx] : ch;
  }

  const pass = customEncoded.slice(0, allowedLengths[index].chars);
  chrome.runtime.sendMessage({ password: pass });
  window.close();
});
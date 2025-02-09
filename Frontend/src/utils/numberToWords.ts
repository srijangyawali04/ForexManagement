import { toWords } from 'number-to-words';

function numberToWords(num: number): string {
  if (isNaN(num)) return 'Invalid number';

  // Split the number into rupees and paisa
  const integerPart = Math.floor(num);
  const paisaPart = Math.round((num - integerPart) * 100);

  // Convert the rupees part into words using the library
  let words = toWords(integerPart);

  // Remove hyphens and commas from the words (The library gives , and hypens by default)
  words = words.replace(/-/g, ' ').replace(/,/g, '');

  // Convert paisa part into words, if present
  if (paisaPart > 0) {
    let paisaWords = toWords(paisaPart);
    paisaWords = paisaWords.replace(/-/g, ' ').replace(/,/g, ''); 
    words += ` and ${paisaWords} paisa`;
  }

  return words.charAt(0).toUpperCase() + words.slice(1) + ' Only'; 
}

export default numberToWords;

function numberToWords(num: number): string {
    if (isNaN(num)) return 'Invalid number';
  
    // Use ceiling to round up the number (for decimal values)
    num = Math.ceil(num); 
  
    const belowTwenty: string[] = [
      'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
    ];
  
    const tens: string[] = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
    ];
  
    const indianGroups: string[] = ['', 'Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'];
  
    // Function to convert a chunk of 3 digits (e.g. 123, 456)
    function convertChunk(chunk: number): string {
      let words = '';
  
      if (chunk >= 100) {
        words += `${belowTwenty[Math.floor(chunk / 100)]} Hundred `;
        chunk %= 100;
      }
  
      if (chunk >= 20) {
        words += `${tens[Math.floor(chunk / 10)]} `;
        chunk %= 10;
      }
  
      if (chunk > 0) {
        words += `${belowTwenty[chunk]} `;
      }
  
      return words.trim();
    }
  
    if (num === 0) return belowTwenty[0];
  
    let words = '';
    let groupIndex = 0;
  
    // Process the number based on the Indian numbering system
    while (num > 0) {
      let chunk = num % 1000; // For Thousand, Lakh, etc.
      num = Math.floor(num / 1000);
  
      if (groupIndex === 1) {
        // Handling for Thousand group
        if (chunk > 0) words = `${convertChunk(chunk)} Thousand ${words}`;
      } else if (groupIndex === 2) {
        // Handling for Lakh group
        if (chunk > 0) words = `${convertChunk(chunk)} Lakh ${words}`;
      } else if (groupIndex === 3) {
        // Handling for Crore group
        if (chunk > 0) words = `${convertChunk(chunk)} Crore ${words}`;
      } else {
        if (chunk > 0) {
          words = `${convertChunk(chunk)} ${indianGroups[groupIndex]} ${words}`;
        }
      }
  
      groupIndex++;
    }
  
    return words.trim();
  }
  
  export default numberToWords;
  
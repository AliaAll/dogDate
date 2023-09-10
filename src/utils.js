// Edinburgh coordinates (approximate)
const edinburghLat = 55.9392; // Edinburgh's latitude
const edinburghLon = -3.2019; // Edinburgh's longitude

// Function to generate random coordinates within 1 mile of Edinburgh
export const generateRandomCoordinatesAroundEdinburgh =  () => {
  // Convert 1 mile to degrees (approximate)
  // Note: This approximation is suitable for small distances.
  let mileToDegree = 1 / 69;
  mileToDegree = mileToDegree*0.1

  // Generate random offsets for latitude and longitude within 1 mile
  const mathRandom1 = Math.random();
  const mathRandom2 = Math.random();
  const latOffset = (mathRandom1 < 0.5 ? mathRandom1-1 : mathRandom1) * mileToDegree
  const lonOffset = (mathRandom2 < 0.5 ? mathRandom2-1 : mathRandom2) * mileToDegree

 

  // Calculate the new coordinates
  const newLat = edinburghLat + latOffset;
  const newLon = edinburghLon + lonOffset;

  return [newLat, newLon];
}




/**
 * Extracts initials from a user's full name.
 * - If full name has at least two words (first and last name): returns First + Last initial (e.g. "Vikash Kumar" -> "VK")
 * - If single word: returns first letter (e.g. "Vikash" -> "V")
 * - If empty: falls back to 'U'
 */
export const getUserInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'U';
  
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'U';
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

export default getUserInitials;

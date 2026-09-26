import { describe, it, expect } from 'vitest';
import { getUserInitials } from '@/shared/utils/userAvatar.util';

describe('userAvatar.util - getUserInitials', () => {
  it('returns "U" when name is undefined, null, or not a string', () => {
    expect(getUserInitials(undefined)).toBe('U');
    expect(getUserInitials(null)).toBe('U');
    expect(getUserInitials('' as any)).toBe('U');
    expect(getUserInitials(123 as any)).toBe('U');
  });

  it('returns "U" when name is empty or only whitespace', () => {
    expect(getUserInitials('')).toBe('U');
    expect(getUserInitials('   ')).toBe('U');
  });

  it('returns first letter in uppercase for single word name', () => {
    expect(getUserInitials('vikash')).toBe('V');
    expect(getUserInitials('Alice')).toBe('A');
    expect(getUserInitials('  bob  ')).toBe('B');
  });

  it('returns first and last initials for two-word name', () => {
    expect(getUserInitials('Vikash Kumar')).toBe('VK');
    expect(getUserInitials('john doe')).toBe('JD');
    expect(getUserInitials('  Ada   Lovelace  ')).toBe('AL');
  });

  it('returns first and last initials when name has three or more words', () => {
    expect(getUserInitials('John Ronald Reuel Tolkien')).toBe('JT');
    expect(getUserInitials('Martin Luther King Jr')).toBe('MJ');
  });
});

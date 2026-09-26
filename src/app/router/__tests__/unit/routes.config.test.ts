import { describe, it, expect } from 'vitest';
import { ROUTES } from '@/app/router/routes.config';

describe('ROUTES configuration', () => {
  it('defines public routes', () => {
    expect(ROUTES.PUBLIC.LANDING).toBe('/');
    expect(ROUTES.PUBLIC.ABOUT).toBe('/about');
    expect(ROUTES.PUBLIC.CONTACT).toBe('/contact');
    expect(ROUTES.PUBLIC.HELP).toBe('/help');
    expect(ROUTES.PUBLIC.PRIVACY).toBe('/privacy');
    expect(ROUTES.PUBLIC.TERMS).toBe('/terms');
    expect(ROUTES.PUBLIC.REFUND).toBe('/refund');
    expect(ROUTES.PUBLIC.SHIPPING).toBe('/shipping');
  });

  it('defines auth routes', () => {
    expect(ROUTES.AUTH.SIGNIN).toBe('/signin');
    expect(ROUTES.AUTH.SIGNUP).toBe('/signup');
    expect(ROUTES.AUTH.VERIFY_EMAIL).toBe('/verify-email');
    expect(ROUTES.AUTH.FORGOT_PASSWORD).toBe('/forgot-password');
    expect(ROUTES.AUTH.RESET_PASSWORD).toBe('/reset-password');
  });

  it('defines protected feature routes', () => {
    expect(ROUTES.PROTECTED.DASHBOARD).toBe('/dashboard');
    expect(ROUTES.PROTECTED.SETTINGS).toBe('/settings');
    expect(ROUTES.PROTECTED.SUBMIT_IDEA).toBe('/submit-idea');
    expect(ROUTES.PROTECTED.SAVED_IDEAS).toBe('/saved-ideas');
    expect(ROUTES.PROTECTED.CREDITS).toBe('/credits');
    expect(ROUTES.PROTECTED.INVESTORS).toBe('/investors');
    expect(ROUTES.PROTECTED.INVESTOR_MATCHING).toBe('/investor-matching');
    expect(ROUTES.PROTECTED.COMPETITORS).toBe('/competitors');
    expect(ROUTES.PROTECTED.PITCH_SIMULATOR).toBe('/pitch-simulator');
    expect(ROUTES.PROTECTED.MARKET_RESEARCH).toBe('/market-research');
  });
});

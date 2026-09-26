import { http, HttpResponse } from 'msw';

export const handlers = [
  // Authentication
  http.post('*/api/auth/signin', () => {
    return HttpResponse.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        credits: 10,
        isPremium: false,
      }
    });
  }),
  http.get('*/api/v1/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        credits: 10,
        isPremium: false,
      }
    });
  }),

  // Ideas
  http.post('*/api/idea/submit', async ({ request }) => {
    const data = await request.json() as { ideaText?: string };
    return HttpResponse.json({
      _id: 'idea123',
      ideaText: data.ideaText || 'Test Idea',
      marketDemandScore: 85,
      competitionScore: 75,
      monetizationFeasibilityScore: 90,
      overallScore: 83,
      createdAt: new Date().toISOString(),
      userCredits: 9,
      analysis: {
        marketDemand: { score: 85, text: 'Good' },
        competition: { score: 75, text: 'Medium' },
        monetization: { score: 90, text: 'Excellent' },
        overall: { score: 83, text: 'Very Good' }
      }
    });
  }),

  // Global Error Handlers for testing 401, 402, 500
  http.get('*/api/idea/saved', () => {
    return HttpResponse.json({ ideas: [] });
  }),
  http.get('*/api/idea/:id', ({ params }) => {
    return HttpResponse.json({
      _id: params.id,
      ideaText: 'Test Idea',
      marketDemandScore: 85,
      competitionScore: 75,
      monetizationFeasibilityScore: 90,
      overallScore: 83,
      createdAt: new Date().toISOString(),
      analysis: {
        marketDemand: { score: 85, text: 'Good' },
        competition: { score: 75, text: 'Medium' },
        monetization: { score: 90, text: 'Excellent' },
        overall: { score: 83, text: 'Very Good' }
      }
    });
  }),
  http.post('*/api/pitchdeck/:id', ({ params }) => {
    return HttpResponse.json({
      _id: params.id,
      ideaText: 'Test Idea',
      pitchDeckContent: {
        problem: 'Test problem',
        solution: 'Test solution'
      },
      createdAt: new Date().toISOString(),
      userCredits: 8
    });
  }),
  http.get('*/api/v1/test-error/401', () => {
    return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
  }),
  http.get('*/api/v1/test-error/402', () => {
    return HttpResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }),

  // Credits
  http.get('*/api/credits/plans', () => {
    return HttpResponse.json({
      starter: {
        name: 'Starter Plan',
        description: 'Perfect for validating a single idea',
        credits: 10,
        price: 900, // $9 in cents
      },
      pro: {
        name: 'Pro Plan',
        description: 'Great for serial entrepreneurs',
        credits: 50,
        price: 3900,
      }
    });
  }),
  http.get('*/api/credits/balance', () => {
    return HttpResponse.json({ credits: 25 });
  }),
];

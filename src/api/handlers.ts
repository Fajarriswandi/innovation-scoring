import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/example', () => HttpResponse.json({ items: [{ id: 1, name: 'Item A' }] })),
];
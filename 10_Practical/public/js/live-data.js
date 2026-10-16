(() => {
  if (!window.location.pathname.includes('/public/')) return;

  const storageKey = 'travel-log-live-demo';
  const sampleTravels = [
    {
      _id: 'demo-goa',
      title: 'Sunset Weekend in Goa',
      location: 'Goa, India',
      travelDate: '2026-01-18T00:00:00.000Z',
      imageUrl: '',
      description: 'A relaxed weekend exploring beaches, local markets and a beautiful sunset.',
      createdAt: '2026-01-20T00:00:00.000Z'
    },
    {
      _id: 'demo-udaipur',
      title: 'Lakes and Palaces',
      location: 'Udaipur, India',
      travelDate: '2025-12-12T00:00:00.000Z',
      imageUrl: '',
      description: 'A memorable visit filled with lakeside walks, historic palaces and Rajasthani food.',
      createdAt: '2025-12-14T00:00:00.000Z'
    }
  ];

  const readTravels = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (Array.isArray(saved)) return saved;
    } catch (error) {
      // Restore the small demo dataset when saved data is invalid.
    }
    localStorage.setItem(storageKey, JSON.stringify(sampleTravels));
    return sampleTravels;
  };

  const saveTravels = (travels) =>
    localStorage.setItem(storageKey, JSON.stringify(travels));
  const jsonResponse = (body, status = 200) =>
    Promise.resolve(new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' }
    }));
  const realFetch = window.fetch.bind(window);

  window.fetch = (input, options = {}) => {
    const requestUrl = typeof input === 'string' ? input : input.url;
    const url = new URL(requestUrl, window.location.href);
    const marker = '/api/travels';
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return realFetch(input, options);

    const id = decodeURIComponent(url.pathname.slice(markerIndex + marker.length + 1));
    const method = (options.method || 'GET').toUpperCase();
    const travels = readTravels();
    const index = travels.findIndex((travel) => travel._id === id);

    if (method === 'GET' && !id) {
      return jsonResponse({ success: true, count: travels.length, data: travels });
    }
    if (method === 'GET') {
      return index < 0
        ? jsonResponse({ success: false, message: 'Travel experience not found' }, 404)
        : jsonResponse({ success: true, data: travels[index] });
    }
    if (method === 'POST') {
      const data = JSON.parse(options.body || '{}');
      const travel = {
        ...data,
        _id: `demo-${Date.now()}`,
        travelDate: new Date(`${data.travelDate}T00:00:00.000Z`).toISOString(),
        createdAt: new Date().toISOString()
      };
      saveTravels([travel, ...travels]);
      return jsonResponse({ success: true, data: travel }, 201);
    }
    if (index < 0) {
      return jsonResponse({ success: false, message: 'Travel experience not found' }, 404);
    }
    if (method === 'PUT') {
      const data = JSON.parse(options.body || '{}');
      travels[index] = {
        ...travels[index],
        ...data,
        travelDate: new Date(`${data.travelDate}T00:00:00.000Z`).toISOString()
      };
      saveTravels(travels);
      return jsonResponse({ success: true, data: travels[index] });
    }
    if (method === 'DELETE') {
      travels.splice(index, 1);
      saveTravels(travels);
      return jsonResponse({ success: true });
    }
    return jsonResponse({ success: false, message: 'Method not allowed' }, 405);
  };
})();

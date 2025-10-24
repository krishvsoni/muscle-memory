import {Hono} from 'hono';

const app  = new Hono();

const baseUrl='https://jsonplaceholder.typicode.com';

const CACHE_TTL = 5 * 60 * 1000;

const cache:Record<string,{lastUpdated:number,data:any[]}> ={}

async function getCachedData(endpoint:string): Promise<any[]> {
    const now = Date.now();
    if (!cache[endpoint]) {
    cache[endpoint] = { lastUpdated: 0, data: [] };
  }

    const entry = cache[endpoint];
if (now - entry.lastUpdated > CACHE_TTL || entry.data.length === 0) {
    console.log(`Fetching fresh data for: ${endpoint}`);
    const response = await fetch(`${baseUrl}/${endpoint}`);
    const json = await response.json();
    cache[endpoint] = {
      lastUpdated: now,
      data: json,
    };
  } else {
    console.log(`Using cached data for: ${endpoint}`);
  }

  return cache[endpoint].data;
}

function paginate<T>(data: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = data.slice(start, end);
  return {
    page,
    limit,
    total: data.length,
    data: paginated,
  };
}



app.get('/', (c) => c.text('Hey dude!'));

app.get('/todo', async (c) => {
  const response = await fetch(`${baseUrl}/todos/1`);
  const json = await response.json();
  return c.json(json);
});

app.get('/photos', async (c) => {
  const page = parseInt(c.req.query('page')) || 1;
  const limit = parseInt(c.req.query('limit')) || 100;

  const allPhotos = await getCachedData('photos');
  return c.json(paginate(allPhotos, page, limit));
});

app.get('/comments', async (c) => {
  const page = parseInt(c.req.query('page')) || 1;
  const limit = parseInt(c.req.query('limit')) || 50;

  const allComments = await getCachedData('comments');
  return c.json(paginate(allComments, page, limit));
});

app.get('/todos', async (c) => {
  const page = parseInt(c.req.query('page')) || 1;
  const limit = parseInt(c.req.query('limit')) || 100;

  const allTodos = await getCachedData('todos');
  return c.json(paginate(allTodos, page, limit));
});

export default app;
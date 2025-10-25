import { Hono } from 'hono'
import fetch from 'node-fetch'
import { Counter, Gauge, Registry } from 'prom-client';



const app = new Hono()

const registry = new Registry();



const requestCount = new Counter({
  name:"http_requests_total",
  help: 'Total number of requests made to the fetch API',
  labelNames: ['method', 'endpoint', 'status_code'],
  registers: [registry],
})

const fetchDuration = new Gauge({
  name: 'fetch_duration_seconds',
  help: 'Duration of fetch requests in seconds',
  registers: [registry],
})

registry.registerMetric(requestCount);
registry.registerMetric(fetchDuration);


app.get('/', (c) => {
  return c.text('Heyy Dudee!')

})



app.get('/fetch-data',async(c) =>{
    const start = Date.now();
  const response = await fetch('https://fakestoreapi.com/carts');
  const data = await response.json();
  const duration = (Date.now() - start) / 1000;
    fetchDuration.set(duration);
    requestCount.inc({ method: 'GET', status_code: response.status.toString() });
    return c.json(data);

})


app.get('/metrics', async (c) => {
  const metrics = await registry.metrics();
  return c.text(metrics, 200, {
    'Content-Type': registry.contentType,
  });
});
export default app

import { Hono } from 'hono'

const app = new Hono()

const baseUrl = 'https://jsonplaceholder.typicode.com'

let photoCache = {
  lastUpdated: 0,
  data:[]
}

const CACHE_TTL = 5 * 60 * 1000 


async function getPhotos(){
  const now = Date.now()  
  if(now - photoCache.lastUpdated > CACHE_TTL || !photoCache.data.length){
    const response=await fetch(`${baseUrl}/photos`)
    const json = await response.json()
    photoCache = {
      lastUpdated: now,
      data: json
    }
  }
  return photoCache.data
  
}


let commentCache = {
  lastUpdated: 0,
  data:[]
}

async function getComments(){
  const now = Date.now()
  if(now-commentCache.lastUpdated>CACHE_TTL || !commentCache.data.length){
    const response=await fetch(`${baseUrl}/comments`)
    const json = await response.json()
    commentCache ={
      lastUpdated: now,
      data: json
    }
  }
  return commentCache.data
}


let todoCache={
  lastUpdated:0,
  data:[]
}

async function getTodos(){
  const now = Date.now()
  if(now - todoCache.lastUpdated > CACHE_TTL || !todoCache.data.length){
    const response=await fetch(`${baseUrl}/todos`)
    const json = await response.json()
    todoCache={
      lastUpdated: now,
      data: json
    }
  }
  return todoCache.data
}


app.get('/', (c) => {
  return c.text('Hey dude!')
})

app.get('/todo', async (c) => {
  const response = await fetch(`${baseUrl}/todos/1`)
  const json = await response.json()
  return c.json(json)
})


app.get('/photos',async(c) => {
 const page = parseInt(c.req.query('page')) || 1;
 const limit = parseInt(c.req.query('limit')) || 100;
 const allPhotos = await getPhotos()

 const start = (page - 1) * limit;
  const end = start + limit;
  const paginated  = allPhotos.slice(start, end);

  return c.json({
    page,
    limit,
    total: allPhotos.length,
    data: paginated
  })

})


app.get('/comments',async(c)=>{
  const page = parseInt(c.req.query('start')) || 0;
  const limit  =  parseInt(c.req.query('end')) || 50;
  const allComments = await getComments()

  const start = (page-1)*limit;  
  const end = start +limit; 
  const paginated = allComments.slice(start,end);

  return c.json({
    page,
    limit,
    total: allComments.length,
    data: paginated
  })
})

app.get('/todos',async(c)=>{
  const page = parseInt(c.req.query('page')) || 1;
  const limit = parseInt(c.req.query('limit')) || 100;
  const allTodos = await getTodos() 

  const start = (page-1)*limit;
  const end = start+limit;
  const paginated = allTodos.slice(start,end);
  
  return c.json({
    page,
    limit,
    total: allTodos.length,
    data: paginated
  })
})


export default app

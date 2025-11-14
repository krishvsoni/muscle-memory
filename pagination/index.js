import express from 'express';
import axios from 'axios';


const app = express();



const BASE_URL= 'https://jsonplaceholder.typicode.com';

/*
response* = 
  {
    "albumId": ,
    "id": ,
    "title": "",
    "url": "",
    "thumbnailUrl": ""
  },
*/

app.get('/', (req, res) => {
    res.json({message:'hello dude'});
});

app.get('/posts', async (req, res) => {
    const response = await axios.get(`${BASE_URL}/photos`);
    res.json(response.data);
});



// offset based pagination  
app.get('/offset/posts',async(req,res) => {
    try{
    const limit =  parseInt(req.query.limit) || 10;
    const offset =  parseInt(req.query.offset) || 0;
    const response = await axios.get(`${BASE_URL}/photos`);
    const data = response.data;
    const paginatedData = data.slice(offset,offset + limit);

    res.json({
        total: data.length,
        limit,
        offset,
        previous: offset-limit >=0  ? offset-limit : null,   
        next: offset + limit < data.length ? offset +limit : null,
        results: paginatedData
    })
}
    catch(err){
    res.status(500).json({message: err.message});
}
});


// cursor based pagination

app.get('/cursor/posts',async(req,res) => {

    try{
    const limit = parseInt(req.query.limit) || 10;
    const cursor = parseInt(req.query.cursor) || 0; // i.e id  of last item from previous page
    const response = await axios.get(`${BASE_URL}/photos`);
    const data = response.data;
    const filteredData =  data.filter(item => item.id>cursor);
    const paginatedData = filteredData.slice(0,limit);

    const nextCursor=paginatedData.length > 0 ? paginatedData[paginatedData.length - 1].id : null;

    res.json({
        limit,
        cursor,
        nextCursor,
        results: paginatedData
    });
}
    catch(err){
    res.status(500).json({message: err.message});
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



// http://localhost:3000/offset/posts?limit=5&offset=10
// http://localhost:3000/cursor/posts?limit=5&cursor=10
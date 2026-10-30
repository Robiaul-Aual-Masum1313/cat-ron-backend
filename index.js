import express from 'express'
const app = express()
const PORT = 8000

app.get('/', (req,res) => {
    res.send('Server running properly')
})
// server url http://localhost:8000/
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
    
})
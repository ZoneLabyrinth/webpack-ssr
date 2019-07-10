if(typeof window === 'undefined') {
    global.window = {};
}

const fs = require('fs')
const path = require('path')
const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server')
//引入模板
const template = fs.readFileSync(path.join(__dirname,'../dist/search.html'),'utf-8')
const data = require('../data/data.json')

const server = (port) => {
    const app = express();
    app.use(express.static('dist'));

    app.get('/search',(req,res)=>{
        const html = renderMarkup(renderToString(SSR))
        res.status(200).send(html)
    })

    app.listen(port,()=>{
        console.log('Server is running on port:' + port)
    })

}

 const renderMarkup = (str) => {
     //替换template
     const dataStr = JSON.stringify(data);
     let tem =  template.replace('<!-- HTML_PLACEHOLDER-->',str)
     .replace('<!-- INITIAL_PLACEHOLDER-->',`<script>window.__initail_data = ${dataStr}</script>`)
     console.log(tem);
     return tem
 }
server(process.env.PORT|| 3000);
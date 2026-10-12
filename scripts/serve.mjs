import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../dist'),port=Number(process.env.PORT||8187);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if(!(await stat(file)).isFile())throw Error();res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Niet gevonden');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));

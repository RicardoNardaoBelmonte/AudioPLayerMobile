import {criarUsuario, buscarUsuario, criarMusica, deletarMusica, listarMusicas} from './db.js';
import { buscarMusica } from "./fetchMusicas.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';


const router = express.Router();


// Tipagem simples para payload de token
interface TokenPayload {
  id: number;
  nome: string;
}

//middleware para verifica��o de token para utilizar em login e outros m�todos que requerem token
function verifyToken(req: Request) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return { error: "Você precisa estar logado", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  if (!token) throw new Error("Token não encontrado!");

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY!) as unknown as TokenPayload;
    return { payload };
  } catch (e) {
    return { error: "Login inválido ou expirado", status: 401 };
  }
}

//fun��o para converter para minutos e segundos
function msToMinutesAndSeconds(ms: number) {
    const minutes = Math.floor(ms / 60000); 
    const seconds = Math.floor((ms % 60000) / 1000); 
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

//m�todos para login e register
router.post('/register', async (req: Request, res: Response) => {
    try{
        const {nome, senha} = req.body;
        if(!nome || !senha) return res.status(400).json({error: "Nome ou senha são obrigatórios"});

        const userParaInserir = await buscarUsuario(nome);

        const {nome: nomeExistente} = userParaInserir ?? {};

        if (nomeExistente) return res.status(400).json({error: "O Usuário já existe"});

        const senhaHash = await bcrypt.hash(senha, 10);

        const user = await criarUsuario(nome, senhaHash);
        return res.status(201).json({message: "Usuário criado com sucesso!", userId: user});

    }catch(e: any){
        return res.status(500).json({error: e.message})
    }
})

router.post('/login', async (req: Request, res: Response) => {
    const {nome, senha} = req.body;

    if(!nome || !senha ) return res.status(400).json({error: "É necessário preencher todos os campos"});

    try{
        const user = await buscarUsuario(nome);

        if(!user) return res.status(404).json({error: "Usuúrio não encontrado"});

        const senhaValidada = await bcrypt.compare(senha, user.senha);

        if(!senhaValidada) return res.status(404).json({error: "Senha incorreta!"});

        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY não definida no ambiente");
        }

        const token = jwt.sign(
            {id: user.id, nome: user.nome},
            process.env.SECRET_KEY,
            {expiresIn: "24h"}
        );

        return res.status(200).json({ token, user });
      }catch(e: any){
        return res.status(500).json({message: e.message});
    }
})

//m�todos para musicas
router.post('/musicas', async (req: Request, res: Response) => {
    try{
        const {musica, path: musicaPath} = req.body;

        if(!musica || !musicaPath) return  res.status(400).json({error: "Música ou path não adicionados"});

        const {payload, error, status} = verifyToken(req);
        if(error) return res.status(status).json({ error: error });

        if (!payload){
            throw new Error('Token não encontrado')
        }

        const usuario_id = payload.id;

        const duracao = msToMinutesAndSeconds(musica.duracao);
        
        const musicId = await criarMusica({
            titulo: musica.nome, 
            artista: musica.artista,
            path: musicaPath,
            thumb: musica.thumb,
            duracao: duracao,
            usuario_id: usuario_id,
        });
        
        return res.status(201).json({message: "Música adicionada com sucesso"});
    }catch(e: any){
        return res.status(500).json({error: e.message})
    }
})

router.get('/musicas', async (req: Request, res: Response) => {
    try{
        const {payload, error, status} = verifyToken(req);
        
        if(error) return res.status(status).json({error: error});

        if(!payload){
            throw new Error("Token não encontrado!")
        }

        const idFromToken = payload.id;

        const musicas = await listarMusicas(idFromToken);
        
        return res.status(200).json({musicas});
    }catch(e: any){
        return res.status(500).json({error: e.message});
    }
})

router.delete('/musicas', async (req: Request, res: Response) => {
    try{
        const {id} = req.body;
        const { payload, error, status} = verifyToken(req);

        if(error) return res.status(status).json({error: error});

        if(!payload){
            throw new Error("Token não encontrado!")
        }

        const idFromToken = payload.id;

        const musicaDeletada = await deletarMusica(id, idFromToken);
        console.log(id);
        console.log(idFromToken);

        if (!musicaDeletada) return res.status(404).json({error: "Música não encontrada ou id do usuário não bate"})
        
        return res.status(200).json({message: "Música deletada com sucesso"});
    }catch(e: any){
        return res.status(500).json({error: e.message});
    }
})

//m�todo para buscar musica na pasta public
router.get('/public/musicas', async (req: Request, res: Response) => {
    const musicDir = path.join(process.cwd(), "public/musicas");
    const files = fs.readdirSync(musicDir);

    const musicas = files.map(file => ({
        nome: file.replace(".mp3", ""),
        path: `/public/musicas/${file}`,
    }));
    
    return res.json(musicas)
})

router.get("/spotify", async (req, res) => {
  try {
    const { nome } = req.query;
    if (!nome) return res.status(400).json({ error: "Nome da música é obrigatório" });

    const resultados = await buscarMusica(nome as string);
    return res.json(resultados);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

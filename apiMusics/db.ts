import Database from 'better-sqlite3';
import { ICriarMusica, IUsuario } from './interfaces.js';

const db = new Database('music.db');


db.prepare(`
        CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        senha TEXT NOT NULL 
        );
    `).run();

db.prepare(`
        CREATE TABLE IF NOT EXISTS musicas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        artista TEXT NOT NULL,
        path TEXT NOT NULL,
        duracao TEXT,
        thumb TEXT,
        usuario_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
    `).run();

export async function criarUsuario(nome: string, senha: string): Promise<number>{
    const stmt = db.prepare(`INSERT INTO usuarios (nome, senha) VALUES (?, ?)`)
    const info = stmt.run(nome, senha);
    return Number(info.lastInsertRowid);
}

export async function buscarUsuario(nome: string): Promise<IUsuario | undefined>{
    const stmt = db.prepare("SELECT * FROM usuarios WHERE nome = ? ");
    const info = stmt.get(nome) as IUsuario || undefined;
    return info;
}

export async function deletarUsuario(id: number): Promise<number>{
    const stmt = db.prepare("DELETE FROM usuarios WHERE id = ?");
    const info = stmt.run(id);
    return info.changes;
}

export async function criarMusica({titulo, artista, path, thumb, duracao, usuario_id}: ICriarMusica): Promise<number>{
    const stmt = db.prepare("INSERT INTO musicas (titulo, artista, path, thumb, duracao, usuario_id) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(titulo, artista, path, thumb, duracao, usuario_id);
    return Number(info.lastInsertRowid);
}   

export async function deletarMusica(id: number, user_id: number): Promise<number>{
    const stmt = db.prepare("DELETE FROM musicas WHERE id = ? AND usuario_id = ?");
    const info = stmt.run(id, user_id);
    return info.changes;
}
  
export async function listarMusicas(id: number): Promise<ICriarMusica[]> {
    const stmt = db.prepare("SELECT * FROM musicas WHERE usuario_id = ?");
    const info = stmt.all(id) as ICriarMusica[];
    return info;
}
import { useState } from "react";
import { IFormUsuarios } from "../interfaces/interfcaes";
import { useMutation } from "@tanstack/react-query";
import { IonButton, IonInput } from "@ionic/react";

const FormUsuarios: React.FC <IFormUsuarios> = ({setVisibleFormUsuarios, tipoFormUsuarios, setNome, setIsLogged}) => {

    const loginMutation = useMutation({
        mutationFn: async (data: ({nome: string, senha: string})) => {
            const res = await fetch('http://localhost:3000/api/login', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if(!res.ok) throw new Error(json.error || "Erro ao fazer Login");
            return json;
        },onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('nome', data.user.nome);
            setNome(data.user.nome);
            alert("Login realizado com sucesso!");
            setIsLogged(true);
            setVisibleFormUsuarios(false);
        },onError: (e) => {
            alert(e.message || "Erro ao fazer login");
            setVisibleFormUsuarios(false);
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (data: ({nome: string, senha: string})) => {
            const res = await fetch('http://localhost:3000/api/register', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if(!res.ok) throw new Error(json.error || "Erro ao fazer registro");
            return json;
        },onSuccess: () => {
            alert("Usuário registrado com sucesso!");
            setVisibleFormUsuarios(false);
        },onError: (e) => alert(e.message || "Erro ao fazer registro"),
    });

    const [formData, setFormData] = useState<{username: string, password: string}>({username : "", password: ""})

    function handleSubmit(e: React.FormEvent<HTMLFormElement>, data: {username: string, password: string}, type: string): void{
        e.preventDefault();
        if(type === "Logar"){
            loginMutation.mutate({nome: data.username, senha: data.password});
        } else if (type === "Registrar"){
            registerMutation.mutate({nome: data.username, senha: data.password});
        }
    }

    return(
        <div className="fixed inset-0 bg-black/60 items-center flex justify-center z-50">
            <div className="flex flex-col bg-background border border-borderGray p-5 w-72 h-72 rounded-lg relative">
                <button className="text-gray-400 absolute right-5 top-5" onClick={() => setVisibleFormUsuarios(false)}>X</button>

                <form className="flex flex-col justify-center items-center gap-5" onSubmit={(e) => handleSubmit(e, formData, tipoFormUsuarios)}>
                    <h2 className="text-primary">{tipoFormUsuarios}</h2>

                    <IonInput name="username" type="text" placeholder='Nome' className='!pl-1 border border-borderGray rounded !text-white focus:outline-borderGray' value={formData.username} onIonInput={(e) => setFormData({...formData, username: e.detail.value ?? ""})}/>

                    <IonInput name="password" type="password" placeholder='Senha' className='!pl-1 border border-borderGray rounded !text-white focus:outline-borderGray' value={formData.password} onIonInput={(e) => setFormData({...formData, password: e.detail.value ?? ""})}/>

                    <IonButton type='submit' className='formUsuarioBtn capitalize bg-primary cursor-pointer text-black !rounded w-20 h-10' aria-label='Enviar'>Enviar</IonButton>
                </form> 
            </div>
        </div>
    )   
}

export default FormUsuarios;
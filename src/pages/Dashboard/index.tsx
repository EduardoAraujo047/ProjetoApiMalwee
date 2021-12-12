import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../services/api";

import { Title, Form, Repositories, Error } from "./styles";

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Main: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState <Repository[]> (() => {
        const storageRepository = localStorage.getItem(
            'http://pokeapi.co/api/v2/pokemon/',
        )

        if(storageRepository){
            return JSON.parse(storageRepository)
        }

        return [];  
    });

    const handleAddRepository = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!newRepo){
            setInputError("Tente pokemon/nome do pokemon para pesquisar.")
            return;
        }


        try{
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;

            setRepositories([...repositories, repository]);
            setInputError('');

        } catch(err){
            setInputError("Pokemon não encontrado ou inexistente.")
            
        }
    }

    useEffect(() => {
        localStorage.setItem(
            'http://pokeapi.co/api/v2/pokemon/',
            JSON.stringify(repositories)
        )
    }, [repositories]);

    return (
        <>
            <Title>Explore repositórios no PokéAPI</Title>
            <Form onSubmit={handleAddRepository}>
                <input value={newRepo} onChange={e => setNewRepo(e.target.value)} placeholder="Digite o nome do repositório..."/>
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link to="#">
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>
        </>
    );
}

export default Main;
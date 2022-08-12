import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

import './style.css'
import logo from '../poke-logo.jpeg';

const Main = () => {
    const [pokeData , setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [disable, setDisable] = React.useState(true);


    const pokeFunc = async() => {
        const res = await axios.get(url);

        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemonData(res.data.results);
        setLoading(false)

        console.log("PREV", res.data.previous);
        console.log("NEXT", res.data.next);

        if (res.data.previous != null) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }

    const getPokemonData = async (res) => {
      res.map(async (item) => {
        const result = await axios.get(item.url);
        setPokeData((state) => {
          let newArray = [];
          let newPokemons = [];
          state = [...state, result.data];

          state.forEach((value, index) => {
            if (newArray.includes(value.name)) {
            } else {
              newArray.push(value.name);
              newPokemons.push(value);
            }
          });

          newPokemons.sort((a, b) => (a.id > b.id ? 1 : -1));
          return newPokemons;
        });
      });
    };

    useEffect(() => {
      pokeFunc();
    }, [url]);

    return (
      <>
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand poke-nav" href="#">
            <img
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
              alt=""
            />
            &nbsp; Lista de pokemon
          </a>
        </nav>
        <div className="container">
          <Card pokemon={pokeData} loading={loading}></Card>
          <div className="btn-div">
            <button
              type="button"
              disabled={disable}
              className="btn btn-func"
              onClick={() => {
                setPokeData([]);
                setUrl(prevUrl);
              }}
            >
              Anterior
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-func"
              onClick={() => {
                setPokeData([]);
                setUrl(nextUrl);
              }}
            >
              Próximo
            </button>
          </div>
        </div>
      </>
    );
};

export default Main;
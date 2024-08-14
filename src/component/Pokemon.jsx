import React, { useEffect, useState } from "react";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";

const Pokemon = () => {
  const [card, setCard] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [light, setLight] = useState(true)

  const url = "https://pokeapi.co/api/v2/pokemon?limit=230";
  const pokemon = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      const pokemonData = data.results.map(async (currItem) => {
        const res = await fetch(currItem.url);
        const data = await res.json();
        return data;
      });

      const detailedData = await Promise.all(pokemonData);
    //   console.log(detailedData);
      setCard(detailedData);
     
    } catch (err) {
      setError(err);
    //   console.log(err);
    }
  };

  if (error) {
    return (
      <div>
        <h1>{err.message}</h1>
      </div>
    );
  }

  useEffect(() => {
    pokemon();
  }, []);

  const searchPokemon = card.filter((currPokemon) =>
    currPokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTheme=()=>{
    setLight(!light)
    if(light == true){
      document.querySelector("body").style.background = "black"
    }else{
      document.querySelector("body").style.background = "white"
    }
  }

  return (
    <div className="h-screen w-full mx-auto text-center my-12 font-semibold font-mono">
        <div className="flex fixed top-1 right-4 rounded-full bg-transparent border-2 py-2 px-2 cursor-pointer z-50" onClick={toggleTheme}>
            <span className="text-2xl">{!light?<CiLight className="text-white"/> : <MdDarkMode />}</span>
        </div>
      <div className="text-3xl sm:text-4xl">
        <h1 className={`${light? "heading-light" : "heading-dark"}`} >Catch your Pokemon</h1>
      </div>
      <div className="my-10">
        <input
          type="text"
          placeholder="Search pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none border-none w-72 px-3 py-1 rounded-lg text-xl bg-transparent"
          id={`${light ? "input-light" : "input-dark"}`}
        />
      </div>
      <div className="flex justify-center items-center flex-wrap gap-10 mt-10">
        {searchPokemon.map((item, index) => {
          return (
            <div
              key={index}
              className="w-60 bg-gray-400 flex flex-col justify-center items-center rounded-lg hover:scale-110 transition py-3 px-4 hover:shadow-2xl hover:bg-gray-200 cursor-pointer">
              <img
                src={item.sprites.other.dream_world.front_default}
                alt=""
                className="w-24 h-24"
              />
              <h1 className="capitalize">{item.name}</h1>
              <span className="bg-green-600 text-white px-3 rounded-full py-1">
                {item.types
                  .map((currItem) => {
                    return currItem.type.name;
                  })
                  .join(",")}
              </span>

              <div className="grid grid-cols-2 font-light text-sm mt-4">
                <div className="grid text-left">
                  <span>
                    {" "}
                    <b>Height</b> : {item.height}
                  </span>
                  <span>
                    {" "}
                    <b>Speed</b> : {item.stats[5].base_stat}
                  </span>
                  <span>
                    {" "}
                    <b>Exp</b> : {item.base_experience}
                  </span>
                </div>
                <div className="grid text-right">
                  <span>
                    {" "}
                    <b>Weight</b> : {item.weight}
                  </span>
                  <span>
                    {" "}
                    <b>Defense</b> : {item.stats[2].base_stat}
                  </span>
                  <span>
                    {" "}
                    <b>Attack</b> : {item.stats[1].base_stat}
                  </span>
                </div>
              </div>
              <span className="text-sm font-light text-left">
                <b>Ability</b>:
                {item.abilities
                  .map((currItem) => {
                    return currItem.ability.name;
                  })
                  .join(",")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pokemon;

// src/context/GameContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const { profile, updateHearts } = useUser();
  const [hearts, setHearts] = useState(5);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const saved = localStorage.getItem("hearts");
    if (saved !== null) {
      setHearts(parseInt(saved));
    } else if (profile?.hearts !== undefined) {
      setHearts(profile.hearts);
      localStorage.setItem("hearts", profile.hearts);
    } else {
      setHearts(5);
      localStorage.setItem("hearts", "5");
    }
    
    setLoading(false);
  }, [profile]); 

  const deductHeart = async () => {
    return new Promise((resolve) => {
      setHearts((prev) => {
        const updated = Math.max(prev - 1, 0);
        localStorage.setItem("hearts", updated.toString());
        updateHearts?.(updated); 
        resolve(updated);
        return updated;
      });
    });
  };

  const addHeart = () => {
    setHearts((prev) => {
      const updated = Math.min(prev + 1, 5);
      localStorage.setItem("hearts", updated.toString());
      updateHearts?.(updated);
      return updated;
    });
  };

  return (
    <GameContext.Provider
      value={{
        hearts,
        loading, 
        deductHeart,
        addHeart,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
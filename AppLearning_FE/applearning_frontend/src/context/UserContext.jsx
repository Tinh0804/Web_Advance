// UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services"; // cái này tùy dự án của bạn

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tải profile & đồng bộ tim từ localStorage
  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getProfile();
        let user = res.data;
        const localHearts = localStorage.getItem("hearts");
        user = {
          ...user,
          hearts: localHearts !== null ? parseInt(localHearts) : user.hearts,
        };

        setProfile(user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateHearts = (value) => {
    setProfile((prev) => ({
      ...prev,
      hearts: value,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        loading,
        updateHearts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

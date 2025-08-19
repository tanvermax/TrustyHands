import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../Provider/useAuth";

const useUserData = () => {
  const { User } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!User?.email) return <><p>loading</p></>;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/user/${User.email}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [User]);

  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/user/${User.email}`, updatedData);
      setProfile(response.data);
      return { success: true };
    } catch (err) {
      console.error("Failed to update profile:", err);
      return { success: false, error: err };
    }
  };

  return { profile, setProfile, loading, error, updateProfile };
};

export default useUserData;

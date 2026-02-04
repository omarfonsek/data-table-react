import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useUsersApi() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get("http://localhost:4000/users");
      
      // Transformar los datos de la API al formato esperado por la tabla
      const transformedData = response.data.data.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        mobile: user.mobile,
        role: "Usuario",
        createdAt: user.registeredAt,
      }));
      
      setUsers(transformedData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers
  };
}
import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventsResponse = await fetch('http://localhost:3000/events');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      const categoriesResponse = await fetch('http://localhost:3000/categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      const usersResponse = await fetch('http://localhost:3000/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ events, categories, users, setEvents }}>
      {children}
    </DataContext.Provider>
  );
};
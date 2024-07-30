import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Root from './components/Root';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';
import { DataProvider } from './contexts/DataContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventPage />} />
            <Route path="events/edit/:eventId" element={<EditEventPage />} />
            <Route path="add-event" element={<AddEventPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  </ChakraProvider>
);
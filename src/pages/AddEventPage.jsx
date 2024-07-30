import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  CheckboxGroup,
  Checkbox,
  Select,
} from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';

const AddEventPage = () => {
  const { categories, users, setEvents } = useContext(DataContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = {
        title,
        description,
        image,
        startTime,
        endTime,
        categoryIds: categoryIds.length ? categoryIds.map((id) => parseInt(id)) : ['unknown'],
        createdBy: parseInt(createdBy),
      };

      console.log('New Event Data: ', newEvent);

      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      const addedEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, addedEvent]);

      navigate('/events');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <Box p={4}>
      <Heading>Add Event</Heading>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Image URL</FormLabel>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Start Time</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Time</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Categories</FormLabel>
          <CheckboxGroup
            value={categoryIds}
            onChange={setCategoryIds}
          >
            <VStack align="start">
              {categories.map((category) => (
                <Checkbox key={category.id} value={category.id.toString()}>
                  {category.name}
                </Checkbox>
              ))}
              <Checkbox value="unknown">other</Checkbox>
            </VStack>
          </CheckboxGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Created By</FormLabel>
          <Select
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Add Event
        </Button>
      </VStack>
    </Box>
  );
};

export default AddEventPage;
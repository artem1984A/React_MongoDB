import React, { useState, useContext } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Container,
  Textarea,
  Select,
  CheckboxGroup,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext';

const AddEventPage = () => {
  const { categories, users, setEvents } = useContext(DataContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleCategoryChange = (values) => {
    setSelectedCategories(values.map(Number));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    if (!title || !description || !startTime || !endTime || !createdBy || !location) {
      toast({
        title: 'Error',
        description: 'All fields must be filled out.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const newEvent = {
      title,
      description,
      image,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      location,
      categoryIds: selectedCategories,
      createdBy, // This should now be a string representing the user's _id
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error('Failed to add event');

      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      toast({
        title: 'Event created.',
        description: 'Your event has been added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/home');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error creating the event.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" p={4}>
      <Heading mb={4}>Add New Event</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Categories</FormLabel>
            <CheckboxGroup
              value={selectedCategories.map(String)}
              onChange={handleCategoryChange}
            >
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Checkbox>
                ))}
                <Checkbox value="999">others</Checkbox> {/* Adding the 'Others' category */}
              </VStack>
            </CheckboxGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Created By</FormLabel>
            <Select
              placeholder="Select creator"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Add Event
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default AddEventPage;
import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Checkbox,
  CheckboxGroup,
  HStack,
  Avatar,
  Text,
  useToast,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select
} from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditEventPage = () => {
  const { eventId } = useParams();
  const { events, setEvents, categories, users } = useContext(DataContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const event = events.find((event) => event.id === parseInt(eventId));
        if (!event) throw new Error('Event not found');

        setTitle(event.title);
        setDescription(event.description);
        setImage(event.image);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setSelectedCategories(event.categoryIds.map(String));
        setCreatedBy(event.createdBy);
        setLocation(event.location);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, events]);

  const handleCategoryChange = (selectedValues) => {
    setSelectedCategories(selectedValues.map(Number));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const updatedEvent = {
      ...events.find((event) => event.id === parseInt(eventId)),
      title,
      description,
      image,
      startTime,
      endTime,
      categoryIds: selectedCategories,
      createdBy: parseInt(createdBy, 10),
      location,
    };

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error('Failed to update event');

      const eventData = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.id === eventData.id ? eventData : ev))
      );

      toast({
        title: 'Event updated.',
        description: 'The event has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'There was an error updating the event.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" />;

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Failed to load event</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const creator = users.find((user) => user.id === createdBy);

  return (
    <Box maxW="container.sm" mx="auto" p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl id="image">
            <FormLabel>Image URL</FormLabel>
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </FormControl>

          <FormControl id="startTime" isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>

          <FormControl id="endTime" isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>

          <FormControl id="location" isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl id="categories">
            <FormLabel>Categories</FormLabel>
            <CheckboxGroup value={selectedCategories.map(String)} onChange={handleCategoryChange}>
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox key={category.id} value={String(category.id)}>
                    {category.name}
                  </Checkbox>
                ))}
                <Checkbox value="999">others</Checkbox>
              </VStack>
            </CheckboxGroup>
          </FormControl>

          <FormControl id="createdBy" isRequired>
            <FormLabel>Created By</FormLabel>
            <Select
              placeholder="Select creator"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  <Avatar size="xs" mr={2} src={user.image} name={user.name} />
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>

          {creator && (
            <HStack spacing={3} align="center" justifyContent="center" my={4}>
              <Avatar size="sm" src={creator.image} />
              <Text fontSize="md">Created By: {creator.name || 'Unknown Author'}</Text>
            </HStack>
          )}

          <Center>
            <HStack spacing={4}>
              <Button colorScheme="red" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                Save Changes
              </Button>
            </HStack>
          </Center>
        </VStack>
      </form>
    </Box>
  );
};

export default EditEventPage;
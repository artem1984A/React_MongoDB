import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, VStack, Select } from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';

const EditEventPage = () => {
  const { eventId } = useParams();
  const { events, categories, users } = useContext(DataContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const event = events.find(e => e.id === parseInt(eventId));
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setImage(event.image);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setCategoryIds(event.categoryIds || []);
      setCreatedBy(event.createdBy || '');
    }
  }, [eventId, events]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        title,
        description,
        image,
        startTime,
        endTime,
        categoryIds,
        createdBy: parseInt(createdBy), // Ensure createdBy is an integer
      };

      console.log("Updated Event Data: ", updatedEvent);

      await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      });

      // Fetch the updated event data
      const updatedEventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
      const updatedEventData = await updatedEventResponse.json();
      console.log("Updated Event from Server: ", updatedEventData);

      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Box p={4}>
      <Heading>Edit Event</Heading>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
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
          <Select
            multiple
            value={categoryIds}
            onChange={(e) => setCategoryIds(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Created By</FormLabel>
          <Select
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue">Update Event</Button>
      </VStack>
    </Box>
  );
};

export default EditEventPage;
import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Center,
  Avatar,
} from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';

const EventPage = () => {
  const { eventId } = useParams();
  const { events, categories, users } = useContext(DataContext);

  // Find the event using the MongoDB _id field
  const event = events.find((e) => e._id === eventId);

  if (!event) return <div>Event not found</div>;

  const categoryNames = event.categoryIds
    .map((id) => categories.find((cat) => cat.id === id)?.name)
    .join(', ');

  // Find the creator using the MongoDB _id field
  const creator = users.find((user) => user._id === event.createdBy);

  return (
    <Center>
      <Box maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="md">
        <Heading mb={4}>{event.title}</Heading>
        <Image src={event.image} alt={event.title} mb={4} />
        <Text mb={4}>{event.description}</Text>
        <Text mb={2}>
          <strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}
        </Text>
        <Text mb={4}>
          <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
        </Text>
        <Text mb={4}>
          <strong>Categories:</strong> {categoryNames}
        </Text>
        {creator && (
          <HStack mb={4}>
            <Avatar src={creator.image} name={creator.name} />
            <Text>Created By: {creator.name || 'Unknown Author'}</Text>
          </HStack>
        )}
        <Button as={Link} to={`/home/events/edit/${event._id}`} colorScheme="blue" mr={4}>
          Edit
        </Button>
        <Button as={Link} to="/home/events" colorScheme="red">
          Back to Events
        </Button>
      </Box>
    </Center>
  );
};

export default EventPage;
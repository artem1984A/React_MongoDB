import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Container,
  Button,
  Avatar,
  Center,
  useBreakpointValue,
} from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';

const EventPage = () => {
  const { eventId } = useParams();
  const { events, categories, users } = useContext(DataContext);

  const event = events.find((event) => event.id === parseInt(eventId));

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const getCategoryNames = (categoryIds) => {
    return categoryIds.map((id) => categories.find((category) => category.id === id)?.name || 'Unknown').join(', ');
  };

  const creator = users.find((user) => user.id === event.createdBy);

  const stackDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <Container maxW="container.lg" p={4}>
      <VStack spacing={4} align="center">
        <Heading>{event.title}</Heading>
        {event.image && <Image src={event.image} alt={event.title} boxSize={{ base: '100%', md: '300px' }} />}
        <Text>{event.description}</Text>
        <Text>
          {new Date(event.startTime).toLocaleString()} -{' '}
          {new Date(event.endTime).toLocaleString()}
        </Text>
        <Text>
          Categories: {event.categoryIds?.length ? getCategoryNames(event.categoryIds) : 'Unknown'}
        </Text>
        {creator && (
          <HStack direction={stackDirection} spacing={4} alignItems="center">
            <Avatar size="sm" src={creator.image} name={creator.name} />
            <Text>Created By: {creator.name}</Text>
          </HStack>
        )}
        <HStack spacing={4}>
          <Button as={Link} to={`/events/edit/${event.id}`} colorScheme="blue">
            Edit
          </Button>
          <Button as={Link} to="/events" colorScheme="gray">
            Back to Events
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default EventPage;
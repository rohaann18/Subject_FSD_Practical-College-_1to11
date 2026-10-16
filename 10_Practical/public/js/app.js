const travelList = document.getElementById('travel-list');
const feedback = document.getElementById('feedback');

// Convert the MongoDB date into a simple readable date.
const formatDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

const createTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
};

const addImagePlaceholder = (container) => {
  container.replaceChildren();

  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder';

  const icon = createTextElement('span', 'placeholder-icon', '✈');
  icon.setAttribute('aria-hidden', 'true');

  placeholder.append(icon);
  placeholder.append(createTextElement('span', '', 'Travel image unavailable'));
  container.append(placeholder);
};

const addTravelImage = (container, travel) => {
  if (!travel.imageUrl) {
    addImagePlaceholder(container);
    return;
  }

  try {
    const imageUrl = new URL(travel.imageUrl, window.location.origin);

    if (!['http:', 'https:'].includes(imageUrl.protocol)) {
      addImagePlaceholder(container);
      return;
    }

    const image = document.createElement('img');
    image.className = 'travel-image';
    image.src = imageUrl.href;
    image.alt = `Travel experience: ${travel.title}`;
    image.addEventListener('error', () => addImagePlaceholder(container));
    container.append(image);
  } catch (error) {
    addImagePlaceholder(container);
  }
};

const showFeedback = (message, type) => {
  feedback.textContent = message;
  feedback.className = `feedback show ${type}`;
};

const showEmptyState = () => {
  travelList.replaceChildren();

  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.append(createTextElement('h2', '', 'No travel experiences yet.'));
  emptyState.append(createTextElement('p', '', 'Be the first to share your journey!'));

  const shareLink = createTextElement('a', 'button button-primary', 'Share Experience');
  shareLink.href = 'add-travel.html';
  emptyState.append(shareLink);
  travelList.append(emptyState);
};

const showLoadError = () => {
  travelList.replaceChildren();

  const errorState = document.createElement('div');
  errorState.className = 'error-state';
  errorState.append(createTextElement('h2', '', 'Unable to load travel experiences.'));
  errorState.append(createTextElement('p', '', 'Please try again.'));
  travelList.append(errorState);
};

const deleteTravel = async (travelId, deleteButton) => {
  const shouldDelete = confirm(
    'Are you sure you want to delete this travel experience?'
  );

  if (!shouldDelete) {
    return;
  }

  deleteButton.disabled = true;
  deleteButton.textContent = 'Deleting...';

  try {
    const response = await fetch(`/api/travels/${travelId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error('Delete request failed');
    }

    await loadTravels();
    showFeedback('Travel experience deleted successfully.', 'success');
  } catch (error) {
    deleteButton.disabled = false;
    deleteButton.textContent = 'Delete';
    showFeedback('Unable to delete travel experience. Please try again.', 'error');
  }
};

const createTravelCard = (travel) => {
  const card = document.createElement('article');
  card.className = 'travel-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'travel-image-wrapper';
  addTravelImage(imageWrapper, travel);

  const content = document.createElement('div');
  content.className = 'travel-card-content';
  content.append(createTextElement('h2', '', travel.title));
  content.append(createTextElement('p', 'travel-meta', `Location: ${travel.location}`));
  content.append(createTextElement('p', 'travel-meta', `Date: ${formatDate(travel.travelDate)}`));
  content.append(createTextElement('p', 'travel-description', travel.description));

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const editLink = createTextElement('a', 'button button-secondary', 'Edit');
  editLink.href = `edit-travel.html?id=${encodeURIComponent(travel._id)}`;

  const deleteButton = createTextElement('button', 'button button-danger', 'Delete');
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', () => deleteTravel(travel._id, deleteButton));

  actions.append(editLink, deleteButton);
  content.append(actions);
  card.append(imageWrapper, content);

  return card;
};

// Fetch and display every travel experience from the backend API.
const loadTravels = async () => {
  travelList.replaceChildren(
    createTextElement('p', 'loading-message', 'Loading travel experiences...')
  );

  try {
    const response = await fetch('/api/travels');
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error('Travel request failed');
    }

    if (result.data.length === 0) {
      showEmptyState();
      return;
    }

    travelList.replaceChildren();
    result.data.forEach((travel) => {
      travelList.append(createTravelCard(travel));
    });
  } catch (error) {
    showLoadError();
  }
};

document.addEventListener('DOMContentLoaded', loadTravels);

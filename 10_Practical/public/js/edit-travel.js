const editForm = document.getElementById('edit-travel-form');
const formMessage = document.getElementById('form-message');
const updateButton = document.getElementById('update-button');

const params = new URLSearchParams(window.location.search);
const travelId = params.get('id');

const showFormMessage = (message, type) => {
  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;
};

const hideFormMessage = () => {
  formMessage.textContent = '';
  formMessage.className = 'form-message';
};

const loadTravel = async () => {
  if (!travelId) {
    showFormMessage('Invalid travel experience.', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/travels/${travelId}`);
    const result = await response.json();

    if (response.status === 400) {
      showFormMessage('Invalid travel experience.', 'error');
      return;
    }

    if (response.status === 404) {
      showFormMessage('Travel experience not found.', 'error');
      return;
    }

    if (!response.ok || !result.success) {
      throw new Error('Unable to load travel experience');
    }

    document.getElementById('title').value = result.data.title;
    document.getElementById('location').value = result.data.location;
    document.getElementById('travelDate').value = result.data.travelDate.split('T')[0];
    document.getElementById('imageUrl').value = result.data.imageUrl || '';
    document.getElementById('description').value = result.data.description;

    editForm.hidden = false;
    updateButton.disabled = false;
    hideFormMessage();
  } catch (error) {
    showFormMessage('Unable to load travel experience. Please try again.', 'error');
  }
};

// Show a clear message when native HTML validation finds an invalid field.
editForm.addEventListener(
  'invalid',
  (event) => {
    if (event.target.validity.typeMismatch) {
      showFormMessage('Please enter a valid image URL.', 'error');
    } else {
      showFormMessage('Please fill in all required fields.', 'error');
    }
  },
  true
);

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const location = document.getElementById('location').value.trim();
  const travelDate = document.getElementById('travelDate').value;
  const imageUrl = document.getElementById('imageUrl').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !location || !travelDate || !description) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  updateButton.disabled = true;
  updateButton.textContent = 'Updating...';
  hideFormMessage();

  try {
    const response = await fetch(`/api/travels/${travelId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        location,
        description,
        travelDate,
        imageUrl
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to update travel experience. Please try again.');
    }

    showFormMessage('Travel experience updated successfully!', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (error) {
    showFormMessage(
      error.message || 'Unable to update travel experience. Please try again.',
      'error'
    );
    updateButton.disabled = false;
    updateButton.textContent = 'Update Experience';
  }
});

document.addEventListener('DOMContentLoaded', loadTravel);

const travelForm = document.getElementById('travel-form');
const formMessage = document.getElementById('form-message');
const submitButton = document.getElementById('submit-button');

const showFormMessage = (message, type) => {
  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;
};

// Show a clear message when native HTML validation finds an invalid field.
travelForm.addEventListener(
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

travelForm.addEventListener('submit', async (event) => {
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

  submitButton.disabled = true;
  submitButton.textContent = 'Sharing...';
  formMessage.className = 'form-message';
  formMessage.textContent = '';

  try {
    const response = await fetch('/api/travels', {
      method: 'POST',
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
      throw new Error(result.message || 'Unable to share travel experience. Please try again.');
    }

    showFormMessage('Travel experience shared successfully!', 'success');
    travelForm.reset();

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (error) {
    showFormMessage(
      error.message || 'Unable to share travel experience. Please try again.',
      'error'
    );
    submitButton.disabled = false;
    submitButton.textContent = 'Share Experience';
  }
});

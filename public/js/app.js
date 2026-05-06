document.addEventListener('DOMContentLoaded', () => {
  const deleteForms = document.querySelectorAll('.delete-form');
  deleteForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      const confirmed = window.confirm('Delete this appointment permanently?');
      if (!confirmed) {
        event.preventDefault();
      }
    });
  });
});

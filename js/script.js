$(function () {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const TASKS_KEY = 'tasks';
  
    renderTasks();
    updateThemeFromStorage();

    $('#theme-btn').on('click', function () {
      const current = $('html').attr('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      $('html').attr('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  
    function updateThemeFromStorage() {
      const saved = localStorage.getItem('theme') || 'light';
      $('html').attr('data-theme', saved);
    }

    $('#search-input').on('input', function () {
      const query = $(this).val().trim().toLowerCase();
      $('.task-item').each(function () {
        const title = $(this).find('.task-title').text().toLowerCase();
        $(this).toggle(title.includes(query));
      });
    });

    $('#open-add-modal').on('click', () => $('.modal__add').addClass('modal--active'));
  
    $('#tasks-list').on('click', '.task-btn.edit', function () {
      const $task = $(this).closest('.task-item');
      const id = $task.data('id');
      const title = $task.find('.task-title').text();
  
      $('#edit-task-id').val(id);
      $('#edit-task-title-input').val(title);
      $('.modal__edit').addClass('modal--active');
    });
  
    $('#tasks-list').on('click', '.task-btn.delete', function () {
      const id = $(this).closest('.task-item').data('id');
      $('#delete-task-id').val(id);
      $('.modal__delete').addClass('modal--active');
    });

    $(document).on('click', '.modal__close, .modal__close-btn', function () {
      $(this).closest('.modal').removeClass('modal--active');
    });

    $('.modal').on('click', function (e) {
      if (e.target === this) {
        $(this).removeClass('modal--active');
      }
    });

    $('#add-task-form').on('submit', function (e) {
      e.preventDefault();
      const title = $('#task-title-input').val().trim();
      if (!title) return;
  
      const newTask = {
        id: Date.now(),
        title: title,
        completed: false
      };
  
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      $(this)[0].reset();
      $('.modal__add').removeClass('modal--active');
    });

    $('#edit-task-form').on('submit', function (e) {
      e.preventDefault();
      const id = Number($('#edit-task-id').val());
      const newTitle = $('#edit-task-title-input').val().trim();
      if (!newTitle) return;
  
      tasks = tasks.map(task => 
        task.id === id ? { ...task, title: newTitle } : task
      );
  
      saveTasks();
      renderTasks();
      $('.modal__edit').removeClass('modal--active');
    });

    $('#confirm-delete').on('click', function () {
      const id = Number($('#delete-task-id').val());
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      renderTasks();
      $('.modal__delete').removeClass('modal--active');
    });

    $('#tasks-list').on('change', '.task-checkbox', function () {
      const id = $(this).closest('.task-item').data('id');
      const completed = $(this).is(':checked');
  
      tasks = tasks.map(task =>
        task.id === id ? { ...task, completed } : task
      );
  
      saveTasks();
      renderTasks();
    });

    function saveTasks() {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  
    function renderTasks() {
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
      });
    
      if (sortedTasks.length === 0) {
        $('#tasks-list').html('<p class="empty-message">Нет задач.</p>');
        return;
      }
    
      const html = sortedTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
          <span class="task-title">${task.title}</span>
          <div class="task-actions">
            <button class="task-btn edit">Редактировать</button>
            <button class="task-btn delete">Удалить</button>
          </div>
        </li>
      `).join('');
    
      $('#tasks-list').html(html);
    }
});
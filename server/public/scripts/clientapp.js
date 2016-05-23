$(function() {

  console.log('Hey buckaroo!');
  //adds the tasks to the DOM
  appendTasks();

  //event listeners for the buttons on the DOM
  $('.addTask').on('click', addTask);
  $('.target-tasks').on('click','.complete', completeTask);
  $('.target-tasks').on('click','.delete', deleteTask);


});

//the function that does a GET from the DB to append to the DOM
function appendTasks() {

  $.get('/tasks', function(tasks) {

      var $el = $('.target-tasks');

      $el.empty();

      //what differentiates if a task is complete or not when added to DOM
      tasks.forEach(function(task) {
        if (task.completed == false) {
          $el.append('<li class="' + task.id + '">' + task.task + '<input type="checkbox" name="complete" class="complete" value="true"><label class="complete" for="complete">Complete</label><button type="button" class="delete">Delete</button></li>');
          $('.' + task.id).data('taskID', task);
        } else {
          $el.append('<li class="completed ' + task.id + '">' + task.task + '<button type="button" class="delete">Delete</button></li>');
          $('.' + task.id).data('taskID', task);
        }

      });
    });
}

//adds a task to the DB via a POST to the DB
function addTask() {

  var task = {};

  task.completed = false;

  $.each($('.new-task').serializeArray(), function(i, field) {

    task[field.name] = field.value;

  });


  $.post('/tasks', task, function() {
    $('.new-task').find("input[type=text], textarea").val("");
    appendTasks();
  });


}

//function that updates the DB when a task is checked as completed via a PUT
function completeTask() {

  var task = $(this).parent().data('taskID');

  task.completed = !task.completed;

  $.ajax({
    type:'PUT',
    url:'/tasks',
    data: task,
    success:function() {
      appendTasks();
    }
  });

}

//deletes the task after asking a prompt
function deleteTask() {

  var task = $(this).parent().data('taskID');

  var confirmation = prompt('Are you sure you with to delete?\n'
   +' Type "DELETE" in all capitals into the prompt if you wish to continue')

  if (confirmation === 'DELETE') {
    $.ajax({
      type:'DELETE',
      url:'/tasks',
      data: task,
      success: function() {
        appendTasks();
      }
    });
  }


}

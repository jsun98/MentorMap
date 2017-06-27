$(document).ready(function() {
  $('#user-full-name').text(user.profile.first_name+" "+user.profile.last_name);
  $('#user-role').text(user.profile.role || "New User");
});

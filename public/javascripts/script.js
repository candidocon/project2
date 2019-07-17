// document.addEventListener(
//   "DOMContentLoaded",
//   () => {
//     console.log("IronGenerator JS imported successfully!");
//   },
//   false
// );

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);

  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

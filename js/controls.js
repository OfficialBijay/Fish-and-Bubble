//controls
let c1 = 0,
  c2 = 0;
document.getElementById("start").addEventListener("click", function () {
  c1++;
  // flag = !flag;
  gamestart.play();
  animate();
  if (c1 % 2 == 0) {
    document.getElementById("start").innerText = "Start";
    window.location.reload(true);
  } else {
    document.getElementById("start").innerText = "Restart";
    document.getElementById("log-in").style.top = "400px";
    document.getElementById("pause").style.display = "block";
  }
});
document.getElementById("pause").addEventListener("click", function () {
  c2++;
  flag = !flag;
  animate();
  if (c2 % 2 == 0) {
    document.getElementById("pause").innerText = "Pause";
  } else {
    document.getElementById("pause").innerText = "Resume";
  }
});
document.getElementById('new-game').addEventListener('click',function(){
    window.location.reload(true);
})
document.getElementById('log-in').addEventListener('click',function(){
  window.location.href='./index.html';
})

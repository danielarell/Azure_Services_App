


function createMessage(text, image, lr) {

  return `
<div class="chatMessage ">
  <img src="${image}" alt="Avatar" width="16" height="16">
    <p>${text}</p>
    <span class="time-${lr}"></span>
</div>
`
}



//alert("hi");
chatBox = document.getElementsByClassName("mainChat")[0];
function addMessage(text) {
  chatBox.innerHTML += text;
}
addMessage(createMessage("aa", "https://static.wikia.nocookie.net/silly-cat/images/f/f2/Baskit_Cat.png", "left"));
addMessage(createMessage("b", "https://static.wikia.nocookie.net/silly-cat/images/5/5b/Buh.png", "right"));
//chatBox.innerHTML = createMessage("b");


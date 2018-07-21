//Load cards from localStorage
for (i = 0; i < localStorage.length; i ++) {
  var key = localStorage.key(i);
  var cardData = JSON.parse(localStorage.getItem(key));
  $(".bottom-box").prepend(newCard(key, cardData.title, cardData.body, cardData.quality));
};

//Event listeners
$('.save-btn').on('click', saveBtn);
$(".bottom-box").on('click', eventDelegation);
$('form').on('keyup', enableSave);
$('.bottom-box').on('keyup', saveEdit);

//Functions
function newCard(id , title , body , quality) {
  return `<div id=${id} class="card-container">
            <h4 class="title-of-card" contenteditable="true">${title}</h4>
            <button class="delete-button"></button>
            <p class="body-of-card" contenteditable="true">${body}</p>
            <button class="upvote"></button>
            <button class="downvote"></button>
            <p class="quality">quality:<span class="qualityVariable">${quality}</span>
            </p>
            <hr>
            </div>`;
};

function cardObject() {
  return {
    title: $('.title-input').val(),
    body: $('.body-input').val(),
    quality: "swill",
    id: Date.now()
  }
};

function localStoreCard(card) {
  var cardString = JSON.stringify(card);
  localStorage.setItem(card.id , cardString);
};

function saveBtn(event) {
  event.preventDefault();
  var cardObj = cardObject();
  var card = newCard(cardObj.id, cardObj.title, cardObj.body, cardObj.quality);
  $( ".bottom-box" ).prepend(card);
  localStoreCard(cardObj);
  $('form')[0].reset();
  $('.save-btn').attr('disabled','');
};

function eventDelegation(event){
  var currentQuality = $(event.target).siblings('.quality').text();
  var cardHTML = $(event.target).closest('.card-container');
  var cardID = cardHTML[0].id;
  var cardObj = JSON.parse(localStorage.getItem(cardID));
  if (event.target.className === "delete-button") { deleteFunction(event, cardID) }
};

function deleteFunction(e, id) {
  localStorage.removeItem(id);
  $(e.target).closest('.card-container').remove();
};

function enableSave(event) {
  var titleVal = $('.title-input').val();
  var bodyVal = $('.body-input').val();
  if (bodyVal !== '' && titleVal !== '') {
    $('.save-btn').removeAttr('disabled');
  }
  else {
    $('.save-btn').attr('disabled', '');
  }
};

function saveEdit(event) {
  var html = $(event.target).closest('.card-container');
  var id = html[0].id;
  console.log($(event.target).hasClass('body-of-card'));
  var card = JSON.parse(localStorage.getItem(id));
  if (event.target.className === 'title-of-card') { card.title = $(event.target).text()}
  if (event.target.className === 'body-of-card') { card.body = $(event.target).text()}
  localStorage.setItem(id,JSON.stringify(card));
};

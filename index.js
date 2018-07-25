//Load cards from localStorage
loadCards();

//Event listeners
$('.save-btn').on('click', saveBtn);
$(".bottom-box").on('click', eventDelegation);
$('form').on('keyup', enableSave);
$('.bottom-box').on('keyup', saveEdit);
$('.search-input').on('keyup',filterCards);
$('.filter-buttons').on('click',filterButton);
$('.show-all').on('click', showAll);
//Functions
function newCard(id , title , body , importance, status) {
  return `<div id=${id} class="card-container">
            <h4 class="title-of-card" contenteditable="true">${title}</h4>
            <button class="delete-button"></button>
            <p class="body-of-card" contenteditable="true">${body}</p>
            <button class="upvote"></button>
            <button class="downvote"></button>
            <p class="importance">importance: <span class="importanceVariable">${importance}</span>
            </p>
            <button class="complete-btn">Complete</button>
            <hr>
            </div>`;
};

function cardObject() {
  return {
    title: $('.title-input').val(),
    body: $('.body-input').val(),
    importance: 'Normal',
    id: Date.now(),
    status: false
  }
};

function loadCards(){
  for (i = 0; i < localStorage.length; i ++) {
    var key = localStorage.key(i);
    var cardData = JSON.parse(localStorage.getItem(key));
    $('.bottom-box').prepend(newCard(cardData.id, cardData.title, cardData.body, cardData.importance));
    if (i >= 10){$(`#${cardData.id}`).hide()}
    if (cardData.status) { $(`#${cardData.id}`).addClass('complete')}
    console.log(cardData.status); 
  };
}

function localStoreCard(card) {
  var cardString = JSON.stringify(card);
  localStorage.setItem(card.id , cardString);
};

function saveBtn(event) {
  event.preventDefault();
  var cardObj = cardObject();
  var card = newCard(cardObj.id, cardObj.title, cardObj.body, cardObj.importance);
  $( ".bottom-box" ).prepend(card);
  localStoreCard(cardObj);
  $('form')[0].reset();
  $('.save-btn').attr('disabled','');
};

function eventDelegation(event){
  var currentImportance = $(event.target).siblings('.importance').text();
  var cardHTML = $(event.target).closest('.card-container');
  var cardID = cardHTML[0].id;
  var cardObj = JSON.parse(localStorage.getItem(cardID));
  if(event.target.className === 'complete-btn') {markAsComplete(cardHTML, cardObj)}
  if (event.target.className === 'delete-button') {deleteFunction(event, cardID)}
  if (event.target.className === 'upvote') {increaseImportance(event, cardID, cardObj)}
  if (event.target.className === 'downvote') {decreaseImportance(event, cardID, cardObj)}
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

function increaseImportance(event, id, card) {
  var html = $(event.target).closest('.card-container');
  var importanceLevels = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var index = importanceLevels.indexOf(card.importance);
  if (index === 4) {return true}
  card.importance = importanceLevels[index + 1];
  html.find('.importanceVariable').text(card.importance);
  localStorage.setItem(id, JSON.stringify(card));
};

function decreaseImportance(event, id, card) {
  var html = $(event.target).closest('.card-container');
  var importanceLevels = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var index = importanceLevels.indexOf(card.importance);
  if (index === 0) {return true}
  card.importance = importanceLevels[index - 1];
  html.find('.importanceVariable').text(card.importance);
  localStorage.setItem(id, JSON.stringify(card))
}

function saveEdit(event) {
  var html = $(event.target).closest('.card-container');
  var id = html[0].id;
  var card = JSON.parse(localStorage.getItem(id));
  if (event.target.className === 'title-of-card') { card.title = $(event.target).text()}
  if (event.target.className === 'body-of-card') { card.body = $(event.target).text()}
  localStorage.setItem(id,JSON.stringify(card));
};

function filterCards(event) {
  $('.card-container').each(cardSearch);
}

function cardSearch(event) {
  var title = $(this).find('.title-of-card').text().toLowerCase();
  var body = $(this).find('.body-of-card').text().toLowerCase();
  var filter = $('.search-input').val().toLowerCase();
  if (!title.includes(filter) && !body.includes(filter)) { $(this).hide() }
  else { $(this).show() }
}

function filterButton(event) {
  event.preventDefault();
  if (event.target.className !== "filter-buttons") {
    filterByClass(event.target.className);
  }
  if (event.target.className === "reset-filter") {
    $('.card-container').show();
  }
}

function filterByClass(elementClass) {
  $('.card-container').each(function(index, card) {
    var importance = $(card).find('.importanceVariable').text();
    if (importance === 'None') {
      console.log(importance);
      console.log($(card).find('.importanceVariable').text());
    }
    if (importance === elementClass){ $(card).show() }
    else {$(card).hide()}
  });
}

function showAll(event) {
  event.preventDefault();
  $('.card-container').show();
}

function markAsComplete(cardHTML, cardObj) {
  cardHTML.toggleClass('complete');
  console.log(cardObj.status)
  cardObj.status = !cardObj.status; 
  localStoreCard(cardObj); 
  console.log(cardObj.status)

}

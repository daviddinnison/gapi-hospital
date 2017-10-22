function renderStars(item){
    if (item.rating !== undefined) {
      return(`<p class = 'rating'>${item.rating} star rating</p>`)
    } else {
      return(`<p class="unavailable">no ratings</p>`)
    }
  }
  



function renderHtml(state) {
    const resultTemplate = state.searchResults.map(function (items) {
      // console.log(items.photos)
      return (`
        <div class = "listen">  
          <div class='individual-result' id='${items.id}'>
          <img src ='${items.icon}'>
          <p class = "hospital-name">${items.name}</p>
          <p>${items.vicinity}</p>
          <div class="rateYo"  data-rating='${items.rating}'></div>
          ${renderStars(items)}
          ${renderOpenNow(items)}
          </div>
        </div>
      `);
    });
    //<img src='${items.photos()}'>
    $('.results').html(resultTemplate);
    $('.rateYo').each(function (i, elem) {
      if (elem.dataset.rating !== 'undefined') {
        $(elem).rateYo({
          rating: elem.dataset.rating,
          readOnly: true
        });
  
      }
    });
    $('.loading').addClass('hidden');
    $('.results').removeClass('hidden');
    $("html, body").animate({ scrollTop: $('#map').offset().top }, 1000);
  }

  
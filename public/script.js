const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("searchInput").value.trim();
  result = await axios(`/api/${searchInput}`)
  $(document).ready(async function () {
        drawCards(result.data);
      });
    });

const drawCards = async (result) => {
  let card = "";
  let i = 0;
    for (let singleResult of result) {
      card += `<div class="col">
          <div class="card shadow-lg">
            <a href='${singleResult.link}' target="_blank">
             <img class="bd-placeholder-img card-img-top" width="100%" src="${singleResult.img}" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em" id='price' class='bg-warning bg-gradient text-dark p-2 bg-opacity-75'>Price: $${singleResult.priceWhole + singleResult.priceFraction}</text>
             <a class="mt-4" id="${i}-walmart-link" href = '' target="_blank"><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em" id='${i}-walmart-price' class='d-none bg-gradient text-dark p-2 bg-opacity-50'></text></a>
            </a>
            <div class="card-body">
            <a href='${singleResult.link}' target="_blank">
              <p class="card-text" id="title_${i}">${singleResult.title}</p>
            </a>
              <div class="d-flex justify-content-between align-items-center flex-column mt-2">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary" onclick="window.open('${singleResult.link}','_blank')">Buy Now</button>
                </div>
                ${singleResult.couponAmount ? `<large class="bg-success text-white p-2 bg-opacity-75 mt-2 rounded">${singleResult.couponAmount}</large>` : ''}
              </div>
            </div>
          </div>
        </div>`;
      i++;
  }
  $("#cards").html(card ? card : '<h2>No Search Results Yet!</h2>');
  await getWalmartPrice(result);
  localStorage.setItem('lastSearch', JSON.stringify(result));
}

async function getWalmartPrice(data) {
  let filteredTitle = '';
  let id = 0;
  for (let singleResult of data) {
    filteredTitle = singleResult.title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s{2,}/g, ' ');
    await fetchWalmart(filteredTitle, id)
    id++;
  }
}

async function fetchWalmart(filteredTitle, id) {
  try {
    await fetch(`/api/walmart/${filteredTitle}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
    }).then((response) => response.json())
      .then((result) => {
    if (result) {
      document.getElementById(`${id}-walmart-price`).classList.replace('d-none', 'bg-success');
      document.getElementById(`${id}-walmart-price`).innerHTML = "At Walmart: " + result.walmartPrice;
      document.getElementById(`${id}-walmart-link`).href = result.walmartLink;
    }
    })
  } catch (err) {
    document.getElementById(`${id}-walmart-price`).classList.replace('d-none','bg-danger');
    document.getElementById(`${id}-walmart-price`).innerHTML = "Not Available At Walmart";
  }
}

storedCards = JSON.parse(localStorage.getItem("lastSearch"));
if (storedCards) {
  drawCards(storedCards);
} else {
  $("#cards").html('<h2>No Search Results Yet!</h2>');
}



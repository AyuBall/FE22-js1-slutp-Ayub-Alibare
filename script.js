const apiKey = "7e698065af42f3ccdb7b6bc638e15662"
const baseUrl = "https://www.flickr.com/services/rest/"
const urlWithKey = `${baseUrl}?method=flickr.photos.search&api_key=${apiKey}&`
function createUrlData(text, sort, page, pageAmount) {
  return `${urlWithKey}text=${text}&sort=${sort}&page=${page}&per_page=${pageAmount}&format=json&nojsoncallback=1`
}

function allData(text, sort, page, pageAmount, size, initialCb, successCb) {



  return fetch(
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e698065af42f3ccdb7b6bc638e15662&text="
    +text
    +"&sort="
    +sort
    +"&page="
    +page
    +"&per_page="
    +pageAmount
    +"&format=json&nojsoncallback=1"
  )
    .then(response => response.json())
    .then(res => res.photos.photo)
    .then(result => {
        //Errorhandling om man skriver ogiltigt sökord.
      if (result.length === 0) {
        let errorMsg = document.createElement("div");
        errorMsg.innerHTML = `Invalid search-word`;
        document.body.appendChild(errorMsg);
      }

 
    
  





      initialCb()
      for (let i = 0; i < result.length; i++) {
        let item = result[i]
        let imageId = item.id;
        let secret = item.secret;
        let server = item.server;
        fetch("https://live.staticflickr.com/" + server + "/" + imageId + "_" + secret + "_" + size + ".jpg")
          .then(response => response.url)
          .then(successCb)
      }
    })
}

let loadingElm = $("#loading-element")
loadingElm.hide()
$("#form").submit(function(event) {
  event.preventDefault()
  let errorElm = $("#error-content")
  let txtFld = $("#text-field")
  let sortFld = $("#sort-select-field")
  let imageSizeFld = $("#image-size-select-field")
  let imageAmountFld = $("#image-amount-select-field")
  let contentElem = $("#content")
  let textValid = txtFld.val() !== "" && txtFld.val() !== undefined 
  let sizeValid = imageSizeFld.val() !== "" && imageSizeFld.val() !== undefined 
  let pageAmountValid = imageAmountFld.val() !== "" && imageAmountFld.val() !== undefined 
  let sortValid = sortFld.val() !== "" && sortFld.val() !== undefined 
  let valid = textValid && sortValid && pageAmountValid && sizeValid


    const doAnimation = {
        targets: '#loading-element',
        //translate: '20vw',
        easing: 'linear',
        //loop: 'true',
        //delay: 100, //anime.stagger(100),
        translateX: '20vw', 
        //translateY: '180px',
        duration: 3000,
        direction: 'alternate',
        //easing: 'easeOutElastic(1, .5)',
        loop: true
    }
    loadingElm.show()
    anime(doAnimation)

  function initCb() {
    errorElm.empty()
    loadingElm.show()
    contentElem.empty()
  }

  function successCb(imgUrl) {
    let imageElement = document.createElement("img")
    imageElement.src = imgUrl;
    contentElem.append(imageElement)
    loadingElm.hide()
  } 

  if (!valid) {
    let pElement = document.createElement("p")
    pElement.innerHTML = "Fyll i allt"
    errorElm.append(pElement)
    loadingElm.hide()
  }
  else {
    allData(
      txtFld.val(), 
      sortFld.val(), 
      "1", 
      imageAmountFld.val(), 
      imageSizeFld.val(),
      initCb,
      successCb
    )
  }
})
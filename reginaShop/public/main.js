
var cart = document.getElementsByClassName("buy")
var trash = document.getElementsByClassName("trash");
var checkout = document.getElementsByClassName("checkout");


Array.from(cart).forEach(function (element) {
  element.addEventListener('click', function () {
    const itemTitle = this.parentNode.parentNode.childNodes[1].innerText
    const itemId = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
    fetch('cartAdd', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'item': itemTitle.trim(), //remember what ellie said//
        'itemID': itemId
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
Array.from(checkout).forEach(function (element) {
  element.addEventListener('click', function () {
    const itemTitle = this.parentNode.parentNode.childNodes[1].innerText
    const itemId = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
    fetch('payForItem', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'item': itemTitle.trim(), //remember what ellie said//
        'itemID': itemId
      })
    }).then(function (response) {
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const item = this.parentNode.parentNode.childNodes[1].innerText
    console.log("Client side item delete", item); //this is the correct task

    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('cartRemove', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'item': item.trim(),
        // 'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});



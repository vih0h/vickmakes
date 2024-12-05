const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const phoneInput = document.getElementById("phone")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
  cartModal.style.display = "flex"
  updateCartModal();
})

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
  if (event.target === cartModal){
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
  // console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)
  }
})

// função p/ adicionar ao Carrinho
function addToCart(name, price){
  const existingItem = cart.find(item => item.name === name)

  if(existingItem){
    //se o item já existe, adiciona +1 à quantidade
    existingItem.quantity += 1;
  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    }) 
  }

  Toastify({
    text: `Item "${name}" adicionado! `,
    duration: 1500,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "black",
    },
  }).showToast();

  updateCartModal()
}

// Atualiza o Carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col" )

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
      </div>
    `
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

// função para remover item do Carrinho
cartItemsContainer.addEventListener("click", function (event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")
    removeItemCart(name);
  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);
  if(index !== -1){
    const item = cart[index];
    if (item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

  // const isOpen = checkRestaurantIsOpen();
  // if (!isOpen){
  //   Toastify({
  //     text: "Restaurante fechado no momento! E aí, gostou do modelo? Faça o seu Cardápio Online também: (31) 98410-7540 Ezequias [planos a partir de R$ 49,90 por mês]",
  //     duration: 5000,
  //     close: true,
  //     gravity: "top", // `top` or `bottom`
  //     position: "right", // `left`, `center` or `right`
  //     stopOnFocus: true, // Prevents dismissing of toast on hover
  //     style: {
  //       background: "#EF4444",
  //     },
  //   }).showToast();
  //   return;
  // }

  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    rerturn;
  }

  // Enviar o pedido para a API WhatsApp
  const cartItems = cart.map((item)=>{
    return(
      `${item.quantity}x ${item.name} |`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  // const phone = "+5531984107540"

  window.open(`https://wa.me/${phoneInput.value}?text=Pedido: ${message} Endereço: ${addressInput.value}`, "_blank")

  cart = [];
  updateCartModal();
})

// Verificar a hora e manipular o card horário
function checkRestaurantIsOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23; //true (restaurante aberto)
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantIsOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
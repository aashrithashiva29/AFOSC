// var stripe = Stripe('pk_test_51H7gTXJPyl22FwkuP6ipydtphj3EyL9fudMaxTVYQ5sWrC92V25ePbamrc5GGqEqYT9PYJmTx4v79LdINS64fIqV00SgS0hjIa');

const stripe = Stripe('pk_test_51H7gTXJPyl22FwkuP6ipydtphj3EyL9fudMaxTVYQ5sWrC92V25ePbamrc5GGqEqYT9PYJmTx4v79LdINS64fIqV00SgS0hjIaY');
// Your Publishable Key
const elements = stripe.elements();

// Create our card inputs
var style = {
    base: {
        color: "#fff"
    }
};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

// Give our token to our form
const stripeTokenHandler = token => {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    form.submit();
}

// Create token from card data
form.addEventListener('submit', e => {
    e.preventDefault();

    stripe.createToken(card).then(res => {
        if (res.error) errorEl.textContent = res.error.message;
        else stripeTokenHandler(res.token);
    })
})
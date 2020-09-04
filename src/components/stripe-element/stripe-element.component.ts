import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { LoadingController } from "ionic-angular";
import { ServiceProvider } from "../../providers/service/service";

declare var Stripe;

@Component({
  selector: 'stripe-element',
  templateUrl: 'stripe-element.component.html'
})
export class StripeElementComponent implements OnInit, OnChanges {
  @Input() secretClient: string;
  @Input() totalAmount: number = 0;
  @Input() callback: Function;
  @Input() requireActionCallback: Function;
  @Input() showSaveCard: boolean = false;
  @Input() submitBtnText: string;
  @Input() hidePostalCode: boolean = false;

  public saveCard = false;
  public card;

  // Create a Stripe client.
  public stripe = Stripe('pk_test_nwGlM9Xw8v2s5ZpgmIWXu0Z1');
  // public stripe = Stripe('pk_live_j3vg5kibohkmjdzWTlGSc3EU');

  constructor(public loadingCtrl: LoadingController,
    public service: ServiceProvider) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.secretClient != null) {
      this.stripe.handleCardAction(this.secretClient)
      .then(result => {
        if (result.error) {
          // Inform the user if there was an error.
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          if (this.requireActionCallback != null) {
            this.card.clear();
            this.requireActionCallback(this.saveCard, result.paymentIntent.id);
          }
        }
      }).catch(err => {
        this.service.openAlert('Error!!', "There is an error with your card maybe invalid card detail or something else.");
      }); 
    }
  }

  ngOnInit(): void {
    // Create an instance of Elements.
    let elements = this.stripe.elements();
    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // Create an instance of the card Element.
    this.card = elements.create('card', {style: style, hidePostalCode: this.hidePostalCode});

    // Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    this.card.addEventListener('change', function(event) {
      let displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Handle form submission.
    let form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      let loading = this.loadingCtrl.create({
        content: "Please wait while validating card.."
      });
      loading.present();

      this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card
      }).then(result => {
        loading.dismiss();
        if (result.error) {
          // Inform the user if there was an error.
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          if (result.paymentMethod) {
            this.card.clear();
            if (this.callback != null) {
              this.callback(this.saveCard, result.paymentMethod.id);
            }
          }
        }
      }).catch(err => {
        loading.dismiss();
        this.service.openAlert('Error!!', "There is an error with your card maybe invalid card detail or something else.");
      }); 
    });
  }
}
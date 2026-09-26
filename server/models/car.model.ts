import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter car name'],
    },
    description: {
      type: String,
      required: [true, 'Please enter car description'],
    },
    status: {
      type: String,
      default: 'Draft',
    },
    rentPerDay: {
      type: Number,
      required: [true, 'Please enter rent per day'],
    },
    address: {
      type: String,
      required: [true, 'Please enter address'],
    },
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //   },
    //   coordinates: {
    //     type: [Number],
    //     index: "2dsphere",
    //   },
    //   formattedAddress: String,
    //   streetName: String,
    //   city: String,
    //   state: String,
    //   stateCode: String,
    //   zipcode: String,
    //   country: String,
    //   countryCode: String,
    // },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    brand: {
      type: String,
      required: [true, 'Please enter car brand'],
    },
    year: {
      type: Number,
      required: [true, 'Please enter car year'],
    },
    transmission: {
      type: String,
      required: [true, 'Please enter car transmission'],
    },
    mileage: {
      type: Number,
      required: [true, 'Please enter car mileage'],
    },
    power: {
      type: Number,
      required: [true, 'Please enter car power'],
    },
    seats: {
      type: Number,
      required: [true, 'Please enter car seats'],
    },
    doors: {
      type: Number,
      required: [true, 'Please enter car doors'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please enter car fuel type'],
    },
    category: {
      type: String,
      required: [true, 'Please enter car category'],
    },
    reviews: [String],
  },
  {
    timestamps: true,
  },
);

carSchema.virtual('ratings').get(function () {
  return {
    value: 5,
    count: 10,
  };
});

const Car = mongoose.model('Car', carSchema);
export default Car;

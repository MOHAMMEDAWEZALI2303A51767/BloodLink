const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Donor = require('./models/Donor');

dotenv.config();

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const cities = [
  'Hyderabad',
  'Warangal',
  'Karimnagar',
  'Nizamabad',
  'Khammam',
  'Adilabad',
  'Mahbubnagar'
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Connected');

    for (let i = 1; i <= 50; i++) {
      const email = 'donor' + i + '@bloodlink.com';

      let user = await User.findOne({ email: email });

      if (!user) {
        user = await User.create({
          name: 'Donor ' + i,
          email: email,
          password: 'password123',
          role: 'user'
        });
      }

      const donorExists = await Donor.findOne({ user: user._id });

      if (!donorExists) {
        await Donor.create({
          user: user._id,
          fullName: 'Donor ' + i,
          age: Math.floor(Math.random() * 30) + 18,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
          phone: '9' + Math.floor(100000000 + Math.random() * 900000000),
          email: email,
          city: cities[Math.floor(Math.random() * cities.length)],
          isAvailable: Math.random() > 0.2
        });
      }
    }

    console.log('50 Donors Added Successfully');
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDatabase();
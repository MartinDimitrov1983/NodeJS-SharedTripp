const models = require('../models');
const config = require('../config/config');
// const { validationResult } = require('express-validator');

module.exports = {
    get: {
        create: (req, res, next) => {

            const hbsObject = {
                pageTitle: 'Create Trip'

            };
            res.render('create', hbsObject);
        },

        all: (req, res, next) => {

            models.Trip
                .find()
                .then((trips) => {

                    trip = trips.map(t => t._doc)

                    const hbsObject = {
                        trip,
                        pageTitle: 'All Trip',

                    }
                    res.render('all', hbsObject);
                }).catch(console.log);
        },

        details: (req, res, next) => {

            const { id } = req.params;

            models.Trip.findById(id)
                .populate("buddies")
                .populate("creator")
                .then((trip) => {
                    trip = trip._doc

                    trip.isAuthor = trip.creator._id.toString() === req.user._id.toString()
                    trip.Author = trip.creator.email
                    trip.isFull = trip.seats === 0
                    trip.isJoined = trip.buddies.filter(b=> b.email === req.user.email).length === 1
                    trip.members = trip.buddies.map(b => b.email).join(", ") || "....."
                
                    const hbsObject = {
                        trip,
                        pageTitle: 'Trip Details',

                    }
                    res.render('details', hbsObject);
                }).catch(console.log);
        },

        join:  (req, res, next) => {
            const { id } = req.params;

            models.Trip
                .findById(id)
                .then((trip) => {
                
                    trip.buddies.push(req.user._id)
                    trip.seats--;
                    return models.Trip.findByIdAndUpdate({ _id: trip._id }, trip)
                })
                .then(() => {
                    req.user.trips.push(id)
                    return models.User.findByIdAndUpdate({ _id: req.user._id }, req.user)
                })
                .then(() => {
                    res.redirect(`/trip/details/${id}`)
                })
                .catch(console.error)
        },

        delete: (req, res, next) => {
            const { id } = req.params;

            models.Trip
                .findByIdAndRemove(id)
                .then(() => {
                    res.redirect('/');
                });
        }
    },

    post: {
        create: (req, res, next) => {


            const { startAndEndPoint, dateTime, carImage, seats, description } = req.body;
            const [startPoint, endPoint] = startAndEndPoint.split(" - ");
            const [date, time] = dateTime.split(" - ");

            if (endPoint === undefined) {
                res.render("create", { errorMassages: ["Start and End point mist be separate with ' - '"] })
                return
            }

            if (time === undefined) {
                res.render("create", { errorMassages: ["Date and Time mist be separate with ' - '"] })
                return
            }

            models.Trip.create({ startPoint, endPoint, date, time, carImage, seats, description, creator: req.user._id, buddies: [] })
                .then((tData) => {
                    req.user.trips.push(tData._id)

                    return models.User.findByIdAndUpdate({ _id: req.user._id }, req.user)
                })
                .then(() => {
                    res.redirect("/")
                })
                .catch((err) => {
                    const errorMassages = Object.entries(err.errors).map(tuple => {
                        return tuple[1].message
                    })
                    console.log(errorMassages)

                    res.render("create", { errorMassages })
                })
        },

        
    }
};
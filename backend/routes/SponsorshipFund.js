const router = require("express").Router();
let SponsorshipFund = require("../models/SponsorshipFund.model");

router.route("/").get((req, res) => {
  SponsorshipFund.find()
    .then((SponsorshipFund) => res.json(SponsorshipFund))
    .catch((err) => res.status(400).json(err));
});

router.route("/").post((req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Body has missing values");
  }
  SponsorshipFund.create(req.body)
    .then((body) => res.status(200).json(body))
    .catch((err) => res.status(400).json(err));
});

router.route("/:id").put((req, res) => {
  const id = req.params;
  const updatedBody = req.body;
  SponsorshipFund.findOne({ id: id })
    .then((sponsorshipFundToUpdate) => {
      if (!sponsorshipFundToUpdate) {
        res.status(400);
        throw new Error("Sponsorship Fund not found");
      }
      SponsorshipFund.findByIdAndUpdate(
        sponsorshipFundToUpdate._id,
        updatedBody,
        {
          new: false,
        }
      )
        .then(() => res.status(200).json(updatedBody))
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => res.status(400).json(err));
});

router.route("/:id").delete((req, res) => {
  const id = req.params;
  SponsorshipFund.findOne({ id: id })
    .then((sponsorshipFundToDelete) => {
      if (!sponsorshipFundToDelete) {
        res.status(400);
        throw new Error("Sponsorship Fund not found");
      }
      res.status(200).json(sponsorshipFundToDelete);
      sponsorshipFundToDelete.remove();
    })
    .catch((err) => res.status(400).json(err));
});

router.route("/:id").get((req, res) => {
  const id = req.params;
  SponsorshipFund.findOne({ id: id })
    .then((sponsorshipFundToRetrieve) => {
      if (!sponsorshipFundToRetrieve) {
        res.status(400);
        throw new Error("Sponsorship Fund not found");
      }
      res.status(200).json(sponsorshipFundToRetrieve);
    })
    .catch((err) => res.status(400).json(err));
});

module.exports = router;

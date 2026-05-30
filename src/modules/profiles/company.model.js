const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    logo: { type: String, default: "" },
    companyName: { type: String, trim: true, maxlength: 150, default: "" },
    bio: { type: String, trim: true, maxlength: 2000, default: "" },
    employeeCount: { type: Number, min: 0, default: 0 },
    location: {
      address: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
    },
    contactPhones: [{ type: String, trim: true }],
    projectImages: [{ type: String }],
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

companyProfileSchema.index({ companyName: 1 });
companyProfileSchema.index({ "location.city": 1 });

companyProfileSchema.methods.checkComplete = function () {
  return Boolean(
    this.logo &&
      this.companyName &&
      this.bio &&
      this.employeeCount > 0 &&
      (this.location?.city || this.location?.address) &&
      this.contactPhones?.length,
  );
};

companyProfileSchema.pre("save", function () {
  this.isProfileComplete = this.checkComplete();
});

const CompanyProfile = mongoose.model("Company", companyProfileSchema);

module.exports = CompanyProfile;

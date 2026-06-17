import PricingPackage from "../models/PricingPackage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPricingPackages = asyncHandler(async (req, res) => {
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);
  const isAgent = req.user?.role === "AGENT";
  const includeInactive = (isSuperAdmin || isAgent) && req.query.includeInactive === "true";
  const filter = includeInactive ? {} : { isActive: true };
  if (isAgent) filter.agentId = req.user._id;
  const packages = await PricingPackage.find(filter).sort({ category: 1, price: 1 });
  res.json(packages);
});

export const createPricingPackage = asyncHandler(async (req, res) => {
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);
  const pricingPackage = await PricingPackage.create({
    ...req.body,
    agentId: isSuperAdmin ? req.body.agentId || req.user._id : req.user._id
  });
  res.status(201).json(pricingPackage);
});

export const updatePricingPackage = asyncHandler(async (req, res) => {
  const existing = await PricingPackage.findById(req.params.id);
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);

  if (!existing) {
    res.status(404);
    throw new Error("Pricing package not found");
  }

  if (!isSuperAdmin && existing.agentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can edit only your own pricing");
  }

  const pricingPackage = await PricingPackage.findByIdAndUpdate(req.params.id, {
    ...req.body,
    agentId: isSuperAdmin ? req.body.agentId || existing.agentId : existing.agentId
  }, {
    new: true,
    runValidators: true
  });

  if (!pricingPackage) {
    res.status(404);
    throw new Error("Pricing package not found");
  }

  res.json(pricingPackage);
});

export const deletePricingPackage = asyncHandler(async (req, res) => {
  const existing = await PricingPackage.findById(req.params.id);
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);

  if (!existing) {
    res.status(404);
    throw new Error("Pricing package not found");
  }

  if (!isSuperAdmin && existing.agentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can delete only your own pricing");
  }

  await PricingPackage.findByIdAndDelete(req.params.id);

  res.json({ message: "Pricing package deleted" });
});

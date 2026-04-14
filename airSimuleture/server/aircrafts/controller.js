import Aircraft from "../models/Aircraft.js";

export async function list(req, res) {
  res.json([]);
}

export async function get(req, res) {
  res.json({});
}

export async function create(req, res) {
  res.status(201).json(req.body);
}

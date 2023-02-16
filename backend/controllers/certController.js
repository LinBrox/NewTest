const Certs = require('../models/certModel')
const asycHandler = require('express-async-handler')

const getCerts = asycHandler(async (req, res) => {
  const certs = await Certs.find({ user: req.user._id })
  res.json(certs)
})

const createCert = asycHandler(async (req, res) => {
  const { name, title, date, hash, logo } = req.body

  if (!name || !title || !date || !hash | !logo) {
    res.status(400)
    throw new Error('Please fill all the fields')
  } else {
    const cert = new Certs({ user: req.user._id, name, title, date, hash, logo })

    const createdCert = await cert.save()

    res.status(201).json(createdCert)
  }
})

const getCertById = asycHandler(async (req, res) => {
  const cert = await Certs.findById(req.params.id)

  if (cert) {
    res.json(cert)
  } else {
    res.status(404).json({ message: 'Note not found' })
  }

  res.json(cert)
})

const updateCert = asycHandler(async (req, res) => {
  const { name, title, date, hash, logo } = req.body

  //this line finds the cert if it exists based on the Id of the user
  const cert = await Certs.findById(req.params.id)

  //checks to see if the cert belongs to the user
  if (cert.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('You cannot preform this action.')
  }

  if (cert) {
    cert.name = name
    cert.title = title
    cert.date = date
    cert.hash = hash
    cert.logo = logo

    const updatedCert = await cert.save()
    res.json(updatedCert)
  } else {
    res.status(401)
    throw new Error('Certificate Note Found')
  }
})

const deleteCert = asycHandler(async (req, res) => {
  const cert = await Certs.findById(req.params.id)

  if (cert.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('You cannot preform this action.')
  }

  if (cert) {
    await cert.remove()
    res.json({ message: 'Certificate Removed' })
  } else {
    res.status(401)
    throw new Error('Certificate Note Found')
  }
})

module.exports = { getCerts, createCert, getCertById, updateCert, deleteCert }

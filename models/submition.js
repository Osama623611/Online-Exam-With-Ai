const mongoose = require('mongoose')
const Exam = require('./exam')
const getWrongAnswers = require('../Ai/getWrongAnswers')
const cloudinary = require('cloudinary').v2
const {
  CLOUD_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET
} = require('../config/env')

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET
})

const Schema = mongoose.Schema

const submitionSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: [String],
    required: true
  },
  wrongAnswers: {
    type: [Number]
  },
  score: {
    type: Number,
    default: null
  }
})

submitionSchema.virtual('url').get(function () {
  return `/submition/${this._id}`
})

submitionSchema.pre('save', async function (next) {
  const exam = await Exam.findById(this.exam)
  if (exam.type === 'oral') return next()

  try {
    // When we submit an exam we need to calculate the score and put the wrong answers
    if (!exam) {
      throw new Error('Exam not found')
    }

    const rightAnswers =
      exam.type === 'mcq'
        ? exam.mcqQuestions.map((question) => question.answer)
        : exam.essayQuestions.map((question) => question.answer)

    this.wrongAnswers = getWrongAnswers(exam.type, rightAnswers, this.answers)
    this.score =
      ((rightAnswers.length - this.wrongAnswers.length) / rightAnswers.length) *
      100
    next() // Call next to proceed with the save operation
  } catch (error) {
    next(error) // Pass any errors to the next middleware
  }
})

submitionSchema.pre('remove', async function (next) {
  // remove the audios from cloudinary
  try {
    const urls = this.answers
    await cloudinary.api.delete_resources(urls, {
      resource_type: 'video'
    })

    next()
  } catch (error) {
    console.log('Error While removing audios from cloudinary', error)
    next(error)
  }
})

module.exports = mongoose.model('Submition', submitionSchema)
